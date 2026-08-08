import 'server-only';

import { appwriteConfig, appwriteConfigured } from './config';
import { articleImageUrl, getAdminServices } from './server';

function articleFromDocument(document) {
  return {
    id: document.$id,
    slug: document.slug,
    title: document.title,
    excerpt: document.excerpt,
    category: document.category,
    author: document.author,
    date: new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(document.publishedAt || document.$createdAt)),
    publishedAt: document.publishedAt || document.$createdAt,
    readingTime: `${Math.max(1, Math.ceil((document.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 220))} min read`,
    image: document.imageUrl || articleImageUrl(document.imageFileId) || '/brand/my-legal-paddy-dark.png',
    featured: Boolean(document.featured),
    content: document.content,
    status: document.status,
    source: 'appwrite',
  };
}

export async function listAppwriteArticles({ publishedOnly = false } = {}) {
  if (!appwriteConfigured) return [];
  try {
    const { databases } = getAdminServices();
    const response = await databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.articlesCollectionId,
      queries: [],
    });
    return response.documents
      .filter((document) => !publishedOnly || document.status === 'published')
      .map(articleFromDocument)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } catch (error) {
    console.error('[Appwrite] Could not list articles:', error.message);
    return [];
  }
}

export async function getAppwriteArticleBySlug(slug) {
  const articles = await listAppwriteArticles({ publishedOnly: true });
  return articles.find((article) => article.slug === slug) || null;
}

export async function listTutors({ approvedOnly = false } = {}) {
  if (!appwriteConfigured) return [];
  try {
    const { databases } = getAdminServices();
    const response = await databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.tutorsCollectionId,
      queries: [],
    });
    return response.documents
      .filter((tutor) => !approvedOnly || tutor.status === 'approved')
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  } catch (error) {
    console.error('[Appwrite] Could not list tutors:', error.message);
    return [];
  }
}
