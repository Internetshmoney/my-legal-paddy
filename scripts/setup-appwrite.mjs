import { Client, Databases, Permission, Role, Storage } from 'node-appwrite';

const required = ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY'];
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);

const databaseId = process.env.APPWRITE_DATABASE_ID || 'legal-paddy';
const articlesId = process.env.APPWRITE_ARTICLES_COLLECTION_ID || 'articles';
const tutorsId = process.env.APPWRITE_TUTORS_COLLECTION_ID || 'tutors';
const subscribersId = process.env.APPWRITE_SUBSCRIBERS_COLLECTION_ID || 'newsletter-subscribers';
const bucketId = process.env.APPWRITE_ARTICLE_IMAGES_BUCKET_ID || 'article-images';
const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);

async function ignoreConflict(action) { try { return await action(); } catch (error) { if (error.code !== 409) throw error; } }
async function database() { await ignoreConflict(() => databases.create({ databaseId, name: 'My Legal Paddy' })); }
async function collection(id, name) { await ignoreConflict(() => databases.createCollection({ databaseId, collectionId: id, name, permissions: [], documentSecurity: false })); }
async function string(collectionId, key, size, required = true, xdefault) { await ignoreConflict(() => databases.createStringAttribute({ databaseId, collectionId, key, size, required, xdefault })); }

await database();
await collection(articlesId, 'Articles');
await string(articlesId, 'title', 255); await string(articlesId, 'slug', 255); await string(articlesId, 'excerpt', 2000);
await string(articlesId, 'category', 100); await string(articlesId, 'author', 150); await string(articlesId, 'content', 100000);
await string(articlesId, 'imageUrl', 2000, false, ''); await string(articlesId, 'imageFileId', 36, false, ''); await string(articlesId, 'status', 20);
await ignoreConflict(() => databases.createBooleanAttribute({ databaseId, collectionId: articlesId, key: 'featured', required: true }));
await ignoreConflict(() => databases.createDatetimeAttribute({ databaseId, collectionId: articlesId, key: 'publishedAt', required: false }));

await collection(tutorsId, 'Tutors');
await string(tutorsId, 'name', 150); await ignoreConflict(() => databases.createEmailAttribute({ databaseId, collectionId: tutorsId, key: 'email', required: true }));
await string(tutorsId, 'university', 200); await string(tutorsId, 'level', 100); await string(tutorsId, 'subjects', 1000); await string(tutorsId, 'availability', 500); await string(tutorsId, 'bio', 3000); await string(tutorsId, 'status', 20); await string(tutorsId, 'photoUrl', 2000, false, '');
await ignoreConflict(() => databases.createFloatAttribute({ databaseId, collectionId: tutorsId, key: 'hourlyRate', required: true, min: 0 }));

await collection(subscribersId, 'Newsletter Subscribers');
await ignoreConflict(() => databases.createEmailAttribute({ databaseId, collectionId: subscribersId, key: 'email', required: true }));
await ignoreConflict(() => storage.createBucket({ bucketId, name: 'Article Images', permissions: [Permission.read(Role.any())], fileSecurity: false, enabled: true, maximumFileSize: 10485760, allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp'] }));

console.log('Appwrite articles, tutors, newsletter subscribers, attributes, and image bucket are ready.');
