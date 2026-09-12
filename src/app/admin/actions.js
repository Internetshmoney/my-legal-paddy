'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Account, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig, appwriteConfigured, getDashboardRole, sessionCookieName } from '@/lib/appwrite/config';
import { createAdminClient, createSessionClient, getAdminServices, getCurrentAdmin } from '@/lib/appwrite/server';

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
    const account = new Account(createAdminClient());
    const session = await account.createEmailPasswordSession({ email: String(formData.get('email') || ''), password: String(formData.get('password') || '') });
    if (!getDashboardRole(session.userId)) {
      await new Account(createAdminClient().setSession(session.secret)).deleteSession({ sessionId: 'current' }).catch(() => {});
      return { error: 'This Appwrite account is not approved as an administrator.' };
    }
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, session.secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', expires: new Date(session.expire), path: '/' });
  } catch (error) {
    return { error: error.message || 'Login failed.' };
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
  try {
    await requireArticleAccess();
    const { databases, storage } = getAdminServices();
    const title = String(formData.get('title') || '').trim();
    const content = String(formData.get('content') || '').trim();
    if (!title || !content) return { error: 'Title and article content are required.' };
    let imageFileId = '';
    const image = formData.get('image');
    if (image instanceof File && image.size > 0) {
      const uploaded = await storage.createFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: ID.unique(), file: InputFile.fromBuffer(Buffer.from(await image.arrayBuffer()), image.name) });
      imageFileId = uploaded.$id;
    }
    const publishNow = formData.get('publishNow') === 'on';
    const articleData = {
        title,
        slug: slugify(String(formData.get('slug') || title)),
        excerpt: String(formData.get('excerpt') || '').trim(),
        category: String(formData.get('category') || 'Legal Commentary'),
        author: String(formData.get('author') || 'Contributing Writer'),
        content,
        imageUrl: String(formData.get('imageUrl') || '').trim(),
        imageFileId,
        status: publishNow ? 'published' : 'draft',
        featured: formData.get('featured') === 'on',
    };
    if (publishNow) articleData.publishedAt = new Date().toISOString();
    await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.articlesCollectionId,
      documentId: ID.unique(),
      data: articleData,
    });
    revalidatePath('/'); revalidatePath('/articles');
    return { success: 'Article saved successfully.' };
  } catch (error) { return { error: error.message }; }
}

export async function setArticleStatus(formData) {
  await requireArticleAccess();
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const { databases } = getAdminServices();
  await databases.updateDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: id, data: { status, ...(status === 'published' ? { publishedAt: new Date().toISOString() } : {}) } });
  revalidatePath('/'); revalidatePath('/articles'); revalidatePath('/admin');
}

export async function deleteArticle(formData) {
  await requireArticleAccess();
  const { databases } = getAdminServices();
  await databases.deleteDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: String(formData.get('id')) });
  revalidatePath('/'); revalidatePath('/articles'); revalidatePath('/admin');
}

export async function submitTutorApplication(previousState, formData) {
  if (!appwriteConfigured) return { error: 'Tutor applications are temporarily unavailable while Appwrite is being configured.' };
  if (formData.get('website')) return { success: 'Application received.' };
  try {
    const { databases } = getAdminServices();
    await databases.createDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId: ID.unique(), data: {
      name: String(formData.get('name') || '').trim(), email: String(formData.get('email') || '').trim(), university: String(formData.get('university') || '').trim(), level: String(formData.get('level') || '').trim(), subjects: String(formData.get('subjects') || '').trim(), hourlyRate: Number(formData.get('rate') || 0), availability: String(formData.get('availability') || '').trim(), bio: String(formData.get('bio') || '').trim(), status: 'pending', photoUrl: '',
    }});
    revalidatePath('/admin');
    return { success: 'Application received. We will contact you after review.' };
  } catch (error) { return { error: error.message }; }
}

export async function setTutorStatus(formData) {
  await requireTutorManager();
  const { databases } = getAdminServices();
  await databases.updateDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId: String(formData.get('id')), data: { status: String(formData.get('status')) } });
  revalidatePath('/admin'); revalidatePath('/tutors');
}

export async function deleteTutor(formData) {
  await requireTutorManager();
  const { databases } = getAdminServices();
  await databases.deleteDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.tutorsCollectionId, documentId: String(formData.get('id')) });
  revalidatePath('/admin'); revalidatePath('/tutors');
}
