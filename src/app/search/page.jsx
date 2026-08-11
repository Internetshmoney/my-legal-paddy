import { Search } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { getPublicArticles } from '@/lib/content/publicArticles';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Search Articles | My Legal Paddy' };

export default async function SearchPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const query = String(q).trim();
  const normalizedQuery = query.toLowerCase();
  const articles = query ? (await getPublicArticles()).filter((article) =>
    [article.title, article.excerpt, article.category, article.author]
      .some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
  ) : [];

  return <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
    <Navbar />
    <section className="border-b border-black/10 bg-[#f8f7f3] px-4 py-14 dark:border-white/10 dark:bg-black sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#8f7d4d]">Article search</p><h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Find legal insight</h1>
        <form className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-black/10 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-zinc-900"><Search className="ml-3 size-5 text-[#8f7d4d]" aria-hidden="true"/><label htmlFor="site-search" className="sr-only">Search articles</label><input id="site-search" name="q" type="search" defaultValue={query} autoFocus placeholder="Search by title, topic, category or writer" className="min-h-12 min-w-0 flex-1 bg-transparent px-2 outline-none"/><button className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Search</button></form>
      </div>
    </section>
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-7xl">{query ? <><h2 className="text-2xl font-semibold">{articles.length} result{articles.length === 1 ? '' : 's'} for “{query}”</h2>{articles.length ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map(article => <ArticleCard key={article.id} article={article}/>)}</div> : <p className="mt-6 text-zinc-600 dark:text-zinc-300">No matching articles. Try a broader topic or writer’s name.</p>}</> : <p className="text-center text-zinc-600 dark:text-zinc-300">Enter a title, legal topic, category or writer’s name.</p>}</div></section>
    <Footer />
  </main>;
}
