'use client';

import { useActionState } from 'react';
import { createArticle } from '@/app/admin/actions';

const field = 'mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-[#9c874b]';

export default function ArticleComposer() {
  const [state, action, pending] = useActionState(createArticle, {});
  return (
    <form action={action} className="rounded-3xl border bg-white p-6 shadow-sm" encType="multipart/form-data">
      <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8f7d4d]">New article</p><h2 className="mt-2 text-2xl font-semibold">Write and publish</h2></div></div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium md:col-span-2">Title<input className={field} name="title" required /></label>
        <label className="text-sm font-medium">Slug (optional)<input className={field} name="slug" placeholder="generated-from-title" /></label>
        <label className="text-sm font-medium">Category<input className={field} name="category" required placeholder="e.g. Criminal Law" /></label>
        <label className="text-sm font-medium md:col-span-2">Writer’s name<input className={field} name="author" required placeholder="Enter the actual writer for this article" /></label>
        <label className="text-sm font-medium md:col-span-2">Summary<textarea className={field} name="excerpt" rows="3" required /></label>
        <label className="text-sm font-medium">Cover image upload<input className={field} name="image" type="file" accept="image/jpeg,image/png,image/webp" /></label>
        <label className="text-sm font-medium">Or cover image URL<input className={field} name="imageUrl" type="url" /></label>
        <label className="text-sm font-medium md:col-span-2">Article body <span className="font-normal text-zinc-500">(plain text or HTML)</span><textarea className={`${field} min-h-80 font-mono text-sm`} name="content" required /></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-6 text-sm"><label className="flex items-center gap-2"><input name="featured" type="checkbox" /> Feature this article</label><label className="flex items-center gap-2"><input name="publishNow" type="checkbox" /> Publish immediately</label></div>
      {state?.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="mt-6 rounded-full bg-zinc-950 px-7 py-3 font-semibold text-white disabled:opacity-60">{pending ? 'Saving…' : 'Save article'}</button>
    </form>
  );
}
