import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { appwriteConfig } from '@/lib/appwrite/config';
import { articleImageUrl, getAdminServices, getCurrentAdmin } from '@/lib/appwrite/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Article preview | My Legal Paddy',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function ArticlePreviewPage({ params }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const { id } = await params;
  let article;
  try {
    article = await getAdminServices().databases.getDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.articlesCollectionId,
      documentId: id,
    });
  } catch {
    notFound();
  }

  const coverImage = article.imageUrl || articleImageUrl(article.imageFileId);
  const previewDate = article.publishedAt || article.$createdAt;

  return <main className="min-h-screen bg-[#f7f5ef] text-zinc-950">
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-[#f7f5ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8f7d4d]">Private draft preview</p>
          <p className="mt-1 text-xs text-zinc-500">Only approved dashboard users can view this page.</p>
        </div>
        <Link href="/admin" className="shrink-0 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">Back to articles</Link>
      </div>
    </header>

    <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[#8f7d4d]">
          <span>{article.status || 'draft'}</span>
          {article.category ? <><span aria-hidden="true">·</span><span>{article.category}</span></> : null}
        </div>
        <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">{article.title}</h1>
        {article.excerpt ? <p className="mt-6 text-lg leading-8 text-zinc-600 sm:text-xl">{article.excerpt}</p> : null}
        <p className="mt-6 border-t border-zinc-300 pt-5 text-sm text-zinc-600">
          By <strong className="text-zinc-950">{article.author}</strong>
          {previewDate ? <> · {new Intl.DateTimeFormat('en-NG', { dateStyle: 'long' }).format(new Date(previewDate))}</> : null}
        </p>
      </div>

      {coverImage ? <div className="mx-auto mt-10 max-w-4xl overflow-hidden bg-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverImage} alt="" className="max-h-[620px] w-full object-cover" />
      </div> : null}

      <div className="article-content mx-auto mt-12 max-w-3xl" dangerouslySetInnerHTML={{ __html: article.content || '' }} />
    </article>
  </main>;
}
