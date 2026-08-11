'use server';

import { createHash } from 'node:crypto';
import { appwriteConfig, appwriteConfigured } from '@/lib/appwrite/config';
import { getAdminServices } from '@/lib/appwrite/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(previousState, formData) {
  if (!appwriteConfigured) return { error: 'Subscriptions are temporarily unavailable.' };
  if (formData.get('website')) return { success: 'You are on the list.' };

  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!emailPattern.test(email)) return { error: 'Enter a valid email address.' };

  try {
    const { databases } = getAdminServices();
    const documentId = createHash('sha256').update(email).digest('hex').slice(0, 36);
    await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.subscribersCollectionId,
      documentId,
      data: { email },
    });
    return { success: 'You are on the list.' };
  } catch (error) {
    if (error?.code === 409) return { success: 'You are already subscribed.' };
    return { error: 'We could not save your subscription. Please try again.' };
  }
}
