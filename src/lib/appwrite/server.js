import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig, appwriteConfigured, sessionCookieName } from './config';

export function createAdminClient() {
  if (!appwriteConfigured) throw new Error('Appwrite environment variables are not configured.');
  return new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);
}

export async function createSessionClient() {
  if (!appwriteConfigured) return null;
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;
  if (!session) return null;
  return new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setSession(session);
}

export function getAdminServices() {
  const client = createAdminClient();
  return { client, databases: new Databases(client), storage: new Storage(client) };
}

export async function getCurrentAdmin() {
  try {
    const client = await createSessionClient();
    if (!client) return null;
    const user = await new Account(client).get();
    return appwriteConfig.adminUserIds.includes(user.$id) ? user : null;
  } catch {
    return null;
  }
}

export function articleImageUrl(fileId) {
  if (!fileId) return '';
  return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.articleImagesBucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
}
