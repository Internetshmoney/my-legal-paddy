import Link from 'next/link';
import { articles as allArticles } from '@/data/articles';

function ArticleCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/90 p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-black/10 dark:border-white/5 dark:bg-zinc-950/95 dark:shadow-[0_20px_50px_-40px_rgba(255,255,255,0.08)]">
      <div className="mb-5 overflow-hidden rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900">
        <img src={article.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
      </div>
      <span className="mb-4 inline-flex rounded-full border border-[#c9b974]/30 bg-[#f7f0d8]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7f704a] dark:bg-[#3a2f16]/40 dark:text-[#dbcf9a]">
        {article.category}
      </span>
      <h3 className="text-xl font-semibold leading-tight text-zinc-950 transition-colors duration-300 group-hover:text-zinc-900 dark:text-white dark:group-hover:text-zinc-100">
        {article.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{article.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        <span>{article.date}</span>
        <span>{article.readingTime}</span>
      </div>
      <p className="mt-6 text-sm font-medium text-zinc-900 dark:text-zinc-100">By {article.author}</p>
    </article>
  );
}

function FeaturedArticleCard({ article }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/95 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 dark:border-white/5 dark:bg-zinc-950/95 dark:shadow-[0_25px_70px_-50px_rgba(255,255,255,0.08)]">
      <div className="overflow-hidden rounded-t-[2rem] bg-zinc-100 dark:bg-zinc-900">
        <img src={article.image} alt="" className="aspect-[16/10] w-full object-cover" />
      </div>
      <div className="p-8 sm:p-10">
        <span className="inline-flex rounded-full border border-[#c9b974]/30 bg-[#f7f0d8]/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7f704a] dark:bg-[#3a2f16]/40 dark:text-[#dbcf9a]">
          {article.category}
        </span>
        <h2 className="mt-6 text-3xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
          {article.excerpt}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{article.date}</span>
          <span>{article.readingTime}</span>
          <span className="text-zinc-900 dark:text-white">By {article.author}</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedArticles() {
  const featuredArticle = allArticles.find((article) => article.featured) || allArticles[0];
  const articles = allArticles.filter((article) => article.slug !== featuredArticle.slug).slice(0, 4);

  return (
    <section className="w-full border-b border-black/10 bg-white py-16 dark:border-white/10 dark:bg-zinc-950/95 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5 pb-10 text-zinc-950 dark:text-white sm:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            LATEST ARTICLES
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Insights That Matter
          </h1>
          <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Explore thoughtful articles on law, technology, careers, human rights, business, and opportunities.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <Link href={`/articles/${featuredArticle.slug}`}><FeaturedArticleCard article={featuredArticle} /></Link>

          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}><ArticleCard article={article} /></Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/articles"
            className="inline-flex rounded-full border border-zinc-900/10 bg-zinc-950 px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-zinc-800 dark:border-white/10 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
