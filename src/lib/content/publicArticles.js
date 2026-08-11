import { cache } from 'react';
import { articles as bloggerArticles } from '@/data/articles';
import { getAppwriteArticleBySlug, listAppwriteArticles } from '@/lib/appwrite/data';

export const getPublicArticles = cache(async function getPublicArticles() {
  const appwriteArticles = await listAppwriteArticles({ publishedOnly: true });
  const appwriteSlugs = new Set(appwriteArticles.map((article) => article.slug));
  return [...appwriteArticles, ...bloggerArticles.filter((article) => !appwriteSlugs.has(article.slug))]
    .sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date));
});

export const getPublicArticleBySlug = cache(async function getPublicArticleBySlug(slug) {
  return (await getAppwriteArticleBySlug(slug)) || bloggerArticles.find((article) => article.slug === slug) || null;
});
