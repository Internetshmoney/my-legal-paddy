import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_24px_70px_-52px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9b974]/50 hover:shadow-[0_30px_90px_-58px_rgba(0,0,0,0.55)] dark:border-white/10 dark:bg-zinc-950">
      <Link href={`/articles/${article.slug}`} className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#c9b974]/35">
        <div className="overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <img
            src={article.image}
            alt=""
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        <div className="p-6">
          <span className="inline-flex rounded-full border border-[#c9b974]/35 bg-[#fbf6df] px-3 py-1 text-xs font-semibold text-[#7a6a41] dark:bg-[#2b2517] dark:text-[#dfcf95]">
            {article.category}
          </span>

          <h2 className="mt-5 text-xl font-semibold leading-tight text-zinc-950 transition-colors duration-300 group-hover:text-[#7a6a41] dark:text-white dark:group-hover:text-[#dfcf95]">
            {article.title}
          </h2>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>{article.date}</span>
            <span>{article.readingTime}</span>
          </div>

          <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            By {article.author}
          </p>
        </div>
      </Link>
    </article>
  );
}
