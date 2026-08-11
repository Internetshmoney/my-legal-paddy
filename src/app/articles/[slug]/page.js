import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleDetail from "@/components/articles/ArticleDetail";
import { getPublicArticleBySlug, getPublicArticles } from "@/lib/content/publicArticles";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | My Legal Paddy",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${article.title} | My Legal Paddy`,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      url: `/articles/${article.slug}`,
      siteName: 'My Legal Paddy',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [{ url: article.image, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articles = await getPublicArticles();
  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.97),_rgba(248,244,232,0.9))] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_24%),linear-gradient(135deg,_rgba(9,9,11,0.98),_rgba(24,24,27,0.95))]">
        <ArticleDetail article={article} relatedArticles={relatedArticles} />
      </main>
      <Footer />
    </>
  );
}
