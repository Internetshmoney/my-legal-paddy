import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ArticleComposer from '@/components/admin/ArticleComposer';
import { appwriteConfig } from '@/lib/appwrite/config';
import { getAdminServices, getCurrentAdmin } from '@/lib/appwrite/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit draft | My Legal Paddy', robots: { index: false, follow: false, noarchive: true } };

export default async function EditDraftPage({ params }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const { id } = await params;

  let article;
  try {
    const document = await getAdminServices().databases.getDocument({ databaseId: appwriteConfig.databaseId, collectionId: appwriteConfig.articlesCollectionId, documentId: id });
    if (document.status !== 'draft') notFound();
    article = {
      id: document.$id,
      title: document.title || '',
      slug: document.slug || '',
      excerpt: document.excerpt || '',
      category: document.category || '',
      author: document.author || '',
      content: document.content || '',
      imageUrl: document.imageUrl || '',
      featured: Boolean(document.featured),
    };
  } catch {
    notFound();
  }

  return <main className="min-h-screen bg-[#f7f5ef] px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8f7d4d]">Draft workspace</p><h1 className="mt-2 text-3xl font-semibold">Edit article</h1></div>
        <div className="flex flex-wrap gap-3"><Link href={`/admin/articles/${id}/preview`} className="rounded-full border border-[#b5a05e] bg-[#faf7eb] px-4 py-2 text-sm font-semibold text-[#695a2f]">Full preview</Link><Link href="/admin" className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">Back to articles</Link></div>
      </div>
      <ArticleComposer article={article} />
    </div>
  </main>;
}
