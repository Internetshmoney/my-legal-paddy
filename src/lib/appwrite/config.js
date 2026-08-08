function idsFrom(value) {
  return (value || '').split(',').map((id) => id.trim()).filter(Boolean);
}

const managerUserIds = idsFrom(
  process.env.APPWRITE_MANAGER_USER_IDS || process.env.APPWRITE_ADMIN_USER_IDS
);
const articleEditorUserIds = idsFrom(process.env.APPWRITE_ARTICLE_EDITOR_USER_IDS);

export const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT || '',
  projectId: process.env.APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'legal-paddy',
  articlesCollectionId: process.env.APPWRITE_ARTICLES_COLLECTION_ID || 'articles',
  tutorsCollectionId: process.env.APPWRITE_TUTORS_COLLECTION_ID || 'tutors',
  articleImagesBucketId: process.env.APPWRITE_ARTICLE_IMAGES_BUCKET_ID || 'article-images',
  managerUserIds,
  articleEditorUserIds,
  dashboardUserIds: [...new Set([...managerUserIds, ...articleEditorUserIds])],
};

export function getDashboardRole(userId) {
  if (appwriteConfig.managerUserIds.includes(userId)) return 'manager';
  if (appwriteConfig.articleEditorUserIds.includes(userId)) return 'article-editor';
  return null;
}

export const appwriteConfigured = Boolean(
  appwriteConfig.endpoint && appwriteConfig.projectId && appwriteConfig.apiKey
);

export const sessionCookieName = appwriteConfig.projectId
  ? `a_session_${appwriteConfig.projectId}`
  : 'a_session_my_legal_paddy';
