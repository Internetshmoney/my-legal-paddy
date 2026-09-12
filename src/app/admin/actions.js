'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Account, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import sharp from 'sharp';
import { appwriteConfig, appwriteConfigured, getDashboardRole, sessionCookieName } from '@/lib/appwrite/config';
import { recordAuditEvent } from '@/lib/appwrite/audit';
import { listAppwriteArticles } from '@/lib/appwrite/data';
import { createAdminClient, createSessionClient, getAdminServices, getCurrentAdmin } from '@/lib/appwrite/server';
import { sanitizeArticleHtml } from '@/lib/content/sanitize';
import { enforceRateLimit } from '@/lib/security/rateLimit';
import { articleImageUrl as validateArticleImageUrl, emailAddress, numberInRange, oneOf, optionalText, requiredText } from '@/lib/validation';

const articleStatuses = ['draft', 'published'];
const tutorStatuses = ['pending', 'under-review', 'approved', 'rejected', 'suspended'];
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumImageSize = 10 * 1024 * 1024;

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);
}

async function requireArticleAccess() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('You are not authorized to perform this action.');
  return admin;
}

async function requireTutorManager() {
  const admin = await requireArticleAccess();
  if (!admin.canManageTutors) throw new Error('Only the dashboard manager can manage tutors.');
  return admin;
}

export async function loginAdmin(previousState, formData) {
  if (!appwriteConfigured) return { error: 'Appwrite is not configured yet. Add the required environment variables first.' };
  try {
    await enforceRateLimit('admin-login', { limit: 5, windowMs: 15 * 60 * 1000 });
    const account = new Account(createAdminClient());
    const email = emailAddress(formData);
    // Passwords are opaque credentials; trimming would change a valid password.
    const password = String(formData.get('password') || '');
    if (!password) return { error: 'Password is required.' };
    if (password.length > 256) return { error: 'Password is too long.' };
    const session = await account.createEmailPasswordSession({ email, password });
    if (!getDashboardRole(session.userId)) {
      await new Account(createAdminClient().setSession(session.secret)).deleteSession({ sessionId: 'current' }).catch(() => {});
      return { error: 'This Appwrite account is not approved as an administrator.' };
    }
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, session.secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', expires: new Date(session.expire), path: '/' });
  } catch (error) {
    if (error.message === 'Too many requests. Please wait and try again.') return { error: error.message };
    console.error('[Admin] Login failed:', error.message);
    if (error?.type === 'general_unauthorized_scope') {
      return { error: 'Admin sign-in is not configured correctly. The Appwrite server key is missing a required scope.' };
    }
    return { error: 'The email or password is incorrect, or this account is not authorized.' };
  }
  redirect('/admin');
}

export async function logoutAdmin() {
  try {
    const client = await createSessionClient();
    if (client) await new Account(client).deleteSession({ sessionId: 'current' });
  } catch {}
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  redirect('/admin/login');
}

export async function createArticle(previousState, formData) {
  let imageFileId = '';
  let savedArticleId = '';
  try {
    const admin = await requireArticleAccess();
    const { databases, storage } = getAdminServices();
    const title = requiredText(formData, 'title', 255, 'Title');
    const rawContent = requiredText(formData, 'content', 100_000, 'Article content');
    const content = sanitizeArticleHtml(rawContent);
    if (!content.replace(/<[^>]*>/g, '').trim()) return { error: 'Article content cannot be empty.' };
    const slug = slugify(optionalText(formData, 'slug', 90, 'Slug') || title);
    if (!slug) return { error: 'Enter a title or slug containing letters or numbers.' };
    const existingArticles = await listAppwriteArticles();
    if (existingArticles.some((article) => article.slug === slug)) return { error: 'That article slug is already in use.' };
    const image = formData.get('image');
    if (image instanceof File && image.size > 0) {
      if (image.size > maximumImageSize) return { error: 'Cover image must be 10 MB or smaller.' };
      if (!imageTypes.has(image.type)) return { error: 'Cover image must be a JPEG, PNG, or WebP file.' };
      const originalBuffer = Buffer.from(await image.arrayBuffer());
      let safeBuffer;
      try {
        safeBuffer = await sharp(originalBuffer, { failOn: 'error', limitInputPixels: 40_000_000 })
          .rotate()
          .resize({ width: 2_400, height: 2_400, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
      } catch {
        return { error: 'Cover image is invalid or corrupted.' };
      }
      const uploaded = await storage.createFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: ID.unique(), file: InputFile.fromBuffer(safeBuffer, `article-${Date.now()}.webp`) });
      imageFileId = uploaded.$id;
    }
    const publishNow = formData.get('publishNow') === 'on';
    const articleData = {
        title,
        slug,
        excerpt: requiredText(formData, 'excerpt', 2_000, 'Summary'),
        category: requiredText(formData, 'category', 100, 'Category'),
        author: requiredText(formData, 'author', 150, 'Writer name'),
        content,
        imageUrl: validateArticleImageUrl(optionalText(formData, 'imageUrl', 2_000, 'Cover image URL')),
        imageFileId,
        status: publishNow ? 'published' : 'draft',
        featured: formData.get('featured') === 'on',
    };
    if (publishNow) articleData.publishedAt = new Date().toISOString();
    const article = await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.articlesCollectionId,
      documentId: ID.unique(),
      data: articleData,
    });
    savedArticleId = article.$id;
    await recordAuditEvent({ actor: admin, action: 'article.created', resourceType: 'article', resourceId: article.$id, summary: `${publishNow ? 'Published' : 'Created draft'}: ${title}` });
    revalidatePath('/'); revalidatePath('/articles'); revalidatePath('/admin');
  } catch (error) {
    if (imageFileId) {
      try {
        await getAdminServices().storage.deleteFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: imageFileId });
      } catch (cleanupError) {
        console.error('[Admin] Could not remove orphaned article image:', cleanupError.message);
      }
    }
    console.error('[Admin] Could not create article:', error.message);
    return { error: error.message?.startsWith('Invalid') || error.message?.includes('required') || error.message?.includes('too long') || error.message?.includes('valid HTTP') ? error.message : 'The article could not be saved. Please try again.' };
  }
  redirect(`/admin/articles/${savedArticleId}/preview`);
}

export async function setArticleStatus(formData) {
  const admin = await requireArticleAccess();
  const id = String(formData.get('id'));
  const status = oneOf(formData, 'status', articleStatuses, 'article status');
  const { databases } = getAdminServices();
  await databases.updateDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: id, data: { status, ...(status === 'published' ? { publishedAt: new Date().toISOString() } : {}) } });
  await recordAuditEvent({ actor: admin, action: 'article.status_changed', resourceType: 'article', resourceId: id, summary: `Status changed to ${status}` });
  revalidatePath('/'); revalidatePath('/articles'); revalidatePath('/admin');
}

export async function deleteArticle(formData) {
  const admin = await requireArticleAccess();
  const { databases, storage } = getAdminServices();
  const documentId = requiredText(formData, 'id', 36, 'Article ID');
  const article = await databases.getDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId });
  await databases.deleteDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId });
  if (article.imageFileId) {
    try {
      await storage.deleteFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: article.imageFileId });
    } catch (error) {
      console.error('[Admin] Could not delete article image:', error.message);
    }
  }
  await recordAuditEvent({ actor: admin, action: 'article.deleted', resourceType: 'article', resourceId: documentId, summary: `Deleted: ${article.title}` });
  revalidatePath('/'); revalidatePath('/articles'); revalidatePath('/admin');
}

export async function submitTutorApplication(previousState, formData) {
  if (!appwriteConfigured) return { error: 'Tutor applications are temporarily unavailable while Appwrite is being configured.' };
  if (formData.get('website')) return { success: 'Application received.' };
  try {
    await enforceRateLimit('tutor-application', { limit: 5, windowMs: 60 * 60 * 1000 });
    if (formData.get('consent') !== 'on') return { error: 'You must agree to be contacted about your application.' };
    const { databases } = getAdminServices();
    await databases.createDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId: ID.unique(), data: {
      name: requiredText(formData, 'name', 150, 'Full name'),
      email: emailAddress(formData),
      university: requiredText(formData, 'university', 200, 'University'),
      level: requiredText(formData, 'level', 100, 'Level or qualification'),
      subjects: requiredText(formData, 'subjects', 1_000, 'Subjects'),
      hourlyRate: numberInRange(formData, 'rate', { min: 1_000, max: 1_000_000, label: 'Hourly rate' }),
      availability: requiredText(formData, 'availability', 500, 'Availability'),
      bio: requiredText(formData, 'bio', 3_000, 'Tutor biography'),
      status: 'pending', photoUrl: '',
    }});
    revalidatePath('/admin');
    return { success: 'Application received. We will contact you after review.' };
  } catch (error) {
    console.error('[Tutors] Application failed:', error.message);
    const safeMessage = /required|too long|valid email|between|Too many requests/.test(error.message) ? error.message : 'We could not save your application. Please try again.';
    return { error: safeMessage };
  }
}

export async function setTutorStatus(formData) {
  const admin = await requireTutorManager();
  const { databases } = getAdminServices();
  const status = oneOf(formData, 'status', tutorStatuses, 'tutor status');
  await databases.updateDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId: requiredText(formData, 'id', 36, 'Tutor ID'), data: { status } });
  await recordAuditEvent({ actor: admin, action: 'tutor.status_changed', resourceType: 'tutor', resourceId: requiredText(formData, 'id', 36, 'Tutor ID'), summary: `Status changed to ${status}` });
  revalidatePath('/admin');
}

export async function deleteTutor(formData) {
  const admin = await requireTutorManager();
  const { databases, storage } = getAdminServices();
  const documentId = requiredText(formData, 'id', 36, 'Tutor ID');
  const tutor = await databases.getDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId });
  await databases.deleteDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId });
  if (tutor.supportingFileId) await storage.deleteFile({ bucketId: appwriteConfig.tutorDocumentsBucketId, fileId: tutor.supportingFileId }).catch((error) => console.error('[Tutors] Supporting document cleanup failed:', error.message));
  await recordAuditEvent({ actor: admin, action: 'tutor.deleted', resourceType: 'tutor', resourceId: documentId, summary: 'Tutor application deleted' });
  revalidatePath('/admin');
}
