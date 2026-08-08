# Appwrite setup

The admin dashboard manages two resources only: **articles** and **tutors**. Writers are entered directly on each article; there is no author directory.

## 1. Create the Appwrite project and administrator

1. Create a project in Appwrite Cloud.
2. Add the production hostname and `localhost` as Web platforms.
3. In **Auth → Users**, create the account that will sign in to the dashboard.
4. Copy that user's ID.
5. Create an API key with Databases and Storage read/write scopes. Keep this key server-side and never prefix it with `NEXT_PUBLIC_`.

## 2. Configure the local project

Copy `.env.example` to `.env.local` and fill in:

```dotenv
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-server-api-key
APPWRITE_ADMIN_USER_IDS=your-admin-user-id
APPWRITE_DATABASE_ID=legal-paddy
APPWRITE_ARTICLES_COLLECTION_ID=articles
APPWRITE_TUTORS_COLLECTION_ID=tutors
APPWRITE_ARTICLE_IMAGES_BUCKET_ID=article-images
```

Multiple admin user IDs can be separated with commas.

## 3. Create the schema

Run this once from PowerShell:

```powershell
npm run appwrite:setup
```

The script creates the database, article and tutor collections, their attributes, and the public article-image bucket. It is safe to rerun if a resource already exists.

## 4. Add the same variables to Vercel

Add all eight variables in the Vercel project's Environment Variables settings for Production, Preview, and Development, then redeploy. Do not expose the API key to the browser.

The dashboard is at `/admin`. Tutor applications submitted at `/tutors` appear there for approval. Only approved tutors are displayed publicly, and only published Appwrite articles appear on the website.
