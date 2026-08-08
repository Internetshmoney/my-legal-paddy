import { redirect } from 'next/navigation';
import Link from 'next/link';
import ArticleComposer from '@/components/admin/ArticleComposer';
import { deleteArticle, deleteTutor, logoutAdmin, setArticleStatus, setTutorStatus } from './actions';
import { listAppwriteArticles, listTutors } from '@/lib/appwrite/data';
import { getCurrentAdmin } from '@/lib/appwrite/server';

export const dynamic = 'force-dynamic';

function ActionButton({ children, tone = 'neutral' }) {
  const colors = tone === 'danger' ? 'border-red-200 text-red-700' : 'border-zinc-200 text-zinc-700';
  return <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${colors}`}>{children}</button>;
}

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  const [articles, tutors] = await Promise.all([listAppwriteArticles(), listTutors()]);
  return <main className="min-h-screen bg-[#f7f5ef] text-zinc-950">
    <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"><div><p className="font-semibold">My Legal Paddy Admin</p><p className="text-xs text-zinc-500">{admin.email}</p></div><div className="flex items-center gap-3"><Link href="/" className="text-sm font-medium">View site</Link><form action={logoutAdmin}><button className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">Sign out</button></form></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 xl:grid-cols-[1.1fr_.9fr]">
      <ArticleComposer />
      <section className="rounded-3xl border bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-[#8f7d4d]">Articles</p><h2 className="mt-2 text-2xl font-semibold">{articles.length} saved</h2><div className="mt-6 max-h-[780px] space-y-4 overflow-auto">{articles.length ? articles.map(article => <article key={article.id} className="rounded-2xl border p-4"><div className="flex justify-between gap-4"><div><span className="text-xs font-semibold uppercase text-[#8f7d4d]">{article.status}</span><h3 className="mt-1 font-semibold">{article.title}</h3><p className="mt-1 text-sm text-zinc-500">By {article.author}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><form action={setArticleStatus}><input type="hidden" name="id" value={article.id}/><input type="hidden" name="status" value={article.status === 'published' ? 'draft' : 'published'}/><ActionButton>{article.status === 'published' ? 'Move to draft' : 'Publish'}</ActionButton></form><form action={deleteArticle}><input type="hidden" name="id" value={article.id}/><ActionButton tone="danger">Delete</ActionButton></form></div></article>) : <p className="text-sm text-zinc-500">No Appwrite articles yet.</p>}</div></section>
      <section className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2"><p className="text-xs font-bold uppercase tracking-widest text-[#8f7d4d]">Tutor directory</p><h2 className="mt-2 text-2xl font-semibold">Review applications</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{tutors.length ? tutors.map(tutor => <article key={tutor.$id} className="rounded-2xl border p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{tutor.name}</h3><p className="text-sm text-zinc-500">{tutor.email} · {tutor.university}</p></div><span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase">{tutor.status}</span></div><p className="mt-3 text-sm"><b>Subjects:</b> {tutor.subjects}</p><p className="mt-2 text-sm"><b>Rate:</b> ₦{Number(tutor.hourlyRate).toLocaleString()}/hour · {tutor.availability}</p><p className="mt-3 text-sm leading-6 text-zinc-600">{tutor.bio}</p><div className="mt-4 flex flex-wrap gap-2">{['approved','pending','rejected'].filter(status => status !== tutor.status).map(status => <form action={setTutorStatus} key={status}><input type="hidden" name="id" value={tutor.$id}/><input type="hidden" name="status" value={status}/><ActionButton>{status === 'approved' ? 'Approve' : status === 'rejected' ? 'Reject' : 'Set pending'}</ActionButton></form>)}<form action={deleteTutor}><input type="hidden" name="id" value={tutor.$id}/><ActionButton tone="danger">Delete</ActionButton></form></div></article>) : <p className="text-sm text-zinc-500">No tutor applications yet.</p>}</div></section>
    </div>
  </main>;
}
