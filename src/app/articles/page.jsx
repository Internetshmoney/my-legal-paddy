import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';

import ArticleCard from '@/components/articles/ArticleCard';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { articles } from '@/data/articles';

const categories = [
  'All',
  'Technology Law',
  'Corporate Law',
  'Commercial Law',
  'Criminal Law',
  'Constitutional Law',
  'Tort Law',
  'Human Rights',
  'International Law',
  'Legal Research & Writing',
  'Career',
  'Student Life',
  'Opportunities',
];

export const metadata = {
  title: 'Articles | My Legal Paddy',
  description:
    'Premium legal insights for law students and young professionals across Africa.',
};

export default function ArticlesPage() {
  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];
  const latestArticles = articles.filter((article) => article.id !== featuredArticle.id);

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <Navbar />

      <section className="border-b border-black/10 bg-[#f8f7f3] py-16 dark:border-white/10 dark:bg-black sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase text-[#8f7d4d] dark:text-[#d8ca92]">
              ARTICLES
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-6xl">
              Legal Insights That Matter
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Explore carefully curated articles covering law, technology, careers, human rights and practical legal knowledge for students and young professionals across Africa.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex min-h-16 items-center gap-3 rounded-[1.5rem] border border-black/10 bg-white px-5 shadow-[0_24px_70px_-55px_rgba(0,0,0,0.55)] transition-all duration-300 focus-within:border-[#c9b974]/70 focus-within:shadow-[0_28px_90px_-62px_rgba(0,0,0,0.6)] dark:border-white/10 dark:bg-zinc-950">
              <Search className="size-5 shrink-0 text-[#8f7d4d]" aria-hidden="true" />
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <input
                id="article-search"
                type="search"
                placeholder="Search articles..."
                className="h-14 min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="mt-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-3 lg:min-w-0 lg:flex-wrap lg:justify-center">
              {categories.map((category) => {
                const isActive = category === 'All';

                return (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? 'border-[#c9b974]/60 bg-[#fbf6df] text-[#75643d] shadow-[0_14px_35px_-28px_rgba(0,0,0,0.5)] dark:bg-[#2b2517] dark:text-[#dfcf95]'
                        : 'border-black/10 bg-white text-zinc-600 hover:border-[#c9b974]/50 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-white'
                    }`}
                    aria-pressed={isActive}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white py-16 dark:border-white/10 dark:bg-zinc-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-[#f8f7f3] shadow-[0_30px_95px_-65px_rgba(0,0,0,0.55)] dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-[1.12fr_0.88fr]">
            <Link href={`/articles/${featuredArticle.slug}`} className="group block overflow-hidden bg-zinc-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:bg-zinc-800">
              <img
                src={featuredArticle.image}
                alt=""
                className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:min-h-[560px]"
              />
            </Link>

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <span className="w-fit rounded-full border border-[#c9b974]/35 bg-white px-4 py-1.5 text-xs font-semibold text-[#7a6a41] dark:bg-[#2b2517] dark:text-[#dfcf95]">
                {featuredArticle.category}
              </span>

              <h2 className="mt-6 text-3xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
                {featuredArticle.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>By {featuredArticle.author}</span>
                <span>{featuredArticle.date}</span>
                <span>{featuredArticle.readingTime}</span>
              </div>

              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                Read Article
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8f7d4d] dark:text-[#d8ca92]">
                LATEST ARTICLES
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white sm:text-4xl">
                New thinking for modern legal minds
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              Fresh editorial pieces selected for students, researchers and early-career professionals building depth across legal fields.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Articles pagination">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-zinc-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9b974]/50 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#c9b974]/50 bg-[#fbf6df] px-5 py-3 text-sm font-semibold text-[#75643d] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3e8bd] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35 dark:bg-[#2b2517] dark:text-[#dfcf95]"
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  );
}
