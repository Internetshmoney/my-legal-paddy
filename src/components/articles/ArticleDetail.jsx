import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";

export default function ArticleDetail({ article, relatedArticles }) {
  const paragraphs = article.content ?? [article.excerpt];

  return (
    <article className="pb-20">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 shadow-[0_30px_100px_rgba(15,23,42,0.08)] dark:bg-zinc-900/80">
          <img
            src={article.image}
            alt={article.title}
            className="h-72 w-full object-cover sm:h-96"
          />

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <span className="inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
              {article.category}
            </span>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{article.readingTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-6 text-lg leading-9 text-foreground/90">
            {paragraphs.map((paragraph, index) => (
              <p key={`${article.slug}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {relatedArticles.length > 0 ? (
        <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-border/70 bg-background/80 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.06)] dark:bg-zinc-900/80 sm:p-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600/90 dark:text-amber-400/90">
                  MORE READING
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                  Continue exploring the publication
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  className="group rounded-[1.4rem] border border-border/70 bg-background/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-amber-500/5"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
                    {relatedArticle.category}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-tight text-foreground">
                    {relatedArticle.title}
                  </h3>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    Read next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
