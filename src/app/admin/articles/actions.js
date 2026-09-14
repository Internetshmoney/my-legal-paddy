'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '@/lib/appwrite/config';
import { getAdminServices, getCurrentAdmin } from '@/lib/appwrite/server';

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumImageSize = 700 * 1024;

function text(formData, name, maximum, label, required = true) {
  const value = String(formData.get(name) || '').trim();
  if (required && !value) throw new Error(`${label} is required.`);
  if (value.length > maximum) throw new Error(`${label} is too long.`);
  return value;
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);
}

function checkedImageUrl(value) {
  if (!value) return '';
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error('Cover image URL must be a valid web address.'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Cover image URL must use HTTP or HTTPS.');
  return parsed.toString();
}

export async function updateDraftArticle(previousState, formData) {
  let replacementFileId = '';
  let destination = '';
  try {
    const admin = await getCurrentAdmin();
    if (!admin) throw new Error('You are not authorized to edit articles.');

    const id = text(formData, 'id', 36, 'Article ID');
    const { databases, storage } = getAdminServices();
    const existing = await databases.getDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: id });
    if (existing.status !== 'draft') return { error: 'Only draft articles can be edited. Move this article to draft first.' };

    const title = text(formData, 'title', 255, 'Title');
    const content = text(formData, 'content', 100_000, 'Article content');
    const slug = slugify(text(formData, 'slug', 90, 'Slug', false) || title);
    if (!slug) return { error: 'Enter a title or slug containing letters or numbers.' };
    const articles = await databases.listDocuments({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, queries: [Query.limit(5_000)] });
    if (articles.documents.some((article) => article.$id !== id && article.slug === slug)) return { error: 'That article slug is already in use.' };

    const image = formData.get('image');
    if (image instanceof File && image.size > 0) {
      if (image.size > maximumImageSize) return { error: 'The cover image is too large. Choose it again so the dashboard can optimise it before saving.' };
      if (!imageTypes.has(image.type)) return { error: 'Cover image must be a JPEG, PNG, or WebP file.' };
      const uploaded = await storage.createFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: ID.unique(), file: InputFile.fromBuffer(Buffer.from(await image.arrayBuffer()), image.name) });
      replacementFileId = uploaded.$id;
    }

    const publishNow = formData.get('publishNow') === 'on';
    await databases.updateDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: id, data: {
      title,
      slug,
      excerpt: text(formData, 'excerpt', 2_000, 'Summary'),
      category: text(formData, 'category', 100, 'Category'),
      author: text(formData, 'author', 150, 'Writer name'),
      content,
      imageUrl: checkedImageUrl(text(formData, 'imageUrl', 2_000, 'Cover image URL', false)),
      imageFileId: replacementFileId || existing.imageFileId || '',
      featured: formData.get('featured') === 'on',
      status: publishNow ? 'published' : 'draft',
      ...(publishNow ? { publishedAt: new Date().toISOString() } : {}),
    } });

    if (replacementFileId && existing.imageFileId) {
      await storage.deleteFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: existing.imageFileId }).catch(() => {});
    }
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath(`/admin/articles/${id}/edit`);
    revalidatePath(`/admin/articles/${id}/preview`);
    destination = publishNow ? `/articles/${slug}` : `/admin/articles/${id}/preview`;
  } catch (error) {
    if (replacementFileId) {
      await getAdminServices().storage.deleteFile({ bucketId: appwriteConfig.articleImagesBucketId, fileId: replacementFileId }).catch(() => {});
    }
    console.error('[Admin] Could not update draft article:', error.message);
    return { error: /required|too long|valid web address|HTTP or HTTPS/.test(error.message) ? error.message : 'The draft could not be updated. Please try again.' };
  }
  redirect(destination);
}
