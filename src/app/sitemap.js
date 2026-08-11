import { getPublicArticles } from '@/lib/content/publicArticles';

const siteUrl = 'https://mylegalpaddy.app';

function getLastModified(article) {
  const date = new Date(article.publishedAt || article.date || Date.now());
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export const revalidate = 3600;

export default async function sitemap() {
  const articles = await getPublicArticles();

  const pages = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/articles', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/tutors', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/career-prediction', changeFrequency: 'monthly', priority: 0.7 },
  ];

  return [
    ...pages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: getLastModified(article),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
