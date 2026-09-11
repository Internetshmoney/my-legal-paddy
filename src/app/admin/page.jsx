import Link from 'next/link';
import { redirect } from 'next/navigation';
import ArticleComposer from '@/components/admin/ArticleComposer';
import ConfirmActionButton from '@/components/admin/ConfirmActionButton';
import { listAppwriteArticles } from '@/lib/appwrite/data';
import { getCurrentAdmin } from '@/lib/appwrite/server';
import { deleteArticle, logoutAdmin, setArticleStatus } from './actions';

export const dynamic = 'force-dynamic';

function ActionButton({ children }) {
  return <button className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700">{children}</button>;
}

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const articles = await listAppwriteArticles();

  return <main className="min-h-screen bg-[#f7f5ef] text-zinc-950">
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="font-semibold">My Legal Paddy Articles</p>
          <p className="truncate text-xs text-zinc-500">{admin.email} · {admin.canManageTutors ? 'Manager' : 'Article editor'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium">View site</Link>
          <form action={logoutAdmin}>
            <button className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">Sign out</button>
          </form>
        </div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 xl:grid-cols-[1.1fr_.9fr]">
      <ArticleComposer />
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-[#8f7d4d]">Articles</p>
        <h2 className="mt-2 text-2xl font-semibold">{articles.length} saved</h2>
        <div className="mt-6 max-h-[780px] space-y-4 overflow-auto">
          {articles.length ? articles.map((article) => <article key={article.id} className="rounded-2xl border p-4">
            <span className="text-xs font-semibold uppercase text-[#8f7d4d]">{article.status}</span>
            <h3 className="mt-1 font-semibold">{article.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">By {article.author}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={setArticleStatus}>
                <input type="hidden" name="id" value={article.id}/>
                <input type="hidden" name="status" value={article.status === 'published' ? 'draft' : 'published'}/>
                <ActionButton>{article.status === 'published' ? 'Move to draft' : 'Publish'}</ActionButton>
              </form>
              <form action={deleteArticle}>
                <input type="hidden" name="id" value={article.id}/>
                <ConfirmActionButton message={`Delete “${article.title}”? The article and its uploaded image will be permanently removed.`}>Delete</ConfirmActionButton>
              </form>
            </div>
          </article>) : <p className="text-sm text-zinc-500">No Appwrite articles yet.</p>}
        </div>
      </section>
    </div>
  </main>;
}
