export const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT || '',
  projectId: process.env.APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'legal-paddy',
  articlesCollectionId: process.env.APPWRITE_ARTICLES_COLLECTION_ID || 'articles',
  tutorsCollectionId: process.env.APPWRITE_TUTORS_COLLECTION_ID || 'tutors',
  articleImagesBucketId: process.env.APPWRITE_ARTICLE_IMAGES_BUCKET_ID || 'article-images',
  adminUserIds: (process.env.APPWRITE_ADMIN_USER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean),
};

export const appwriteConfigured = Boolean(
  appwriteConfig.endpoint && appwriteConfig.projectId && appwriteConfig.apiKey
);

export const sessionCookieName = appwriteConfig.projectId
  ? `a_session_${appwriteConfig.projectId}`
  : 'a_session_my_legal_paddy';
