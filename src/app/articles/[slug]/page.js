import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleDetail from "@/components/articles/ArticleDetail";
import { getPublicArticleBySlug, getPublicArticles } from "@/lib/content/publicArticles";

export const dynamic = 'force-dynamic';

const siteUrl = "https://mylegalpaddy.app";

function cleanDescription(value = "") {
  const plainText = String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plainText.length > 160 ? `${plainText.slice(0, 157).trimEnd()}...` : plainText;
}

function absoluteUrl(value) {
  if (!value) return `${siteUrl}/team/law-students-group.jpg`;
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return `${siteUrl}/team/law-students-group.jpg`;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const description = cleanDescription(article.excerpt);
  const image = absoluteUrl(article.image);

  return {
    title: article.title,
    description,
    keywords: [article.category, 'Nigerian law', 'law students', 'legal education'],
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      url: `/articles/${article.slug}`,
      siteName: 'My Legal Paddy',
      title: article.title,
      description,
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.category,
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
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
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  const canonicalUrl = `${siteUrl}/articles/${article.slug}`;
  const description = cleanDescription(article.excerpt);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: article.title,
    description,
    image: [absoluteUrl(article.image)],
    datePublished: article.publishedAt || article.date,
    dateModified: article.updatedAt || article.publishedAt || article.date,
    author: { "@type": "Person", name: article.author },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    articleSection: article.category,
    inLanguage: "en-NG",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.97),_rgba(248,244,232,0.9))] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_24%),linear-gradient(135deg,_rgba(9,9,11,0.98),_rgba(24,24,27,0.95))]">
        <ArticleDetail article={article} relatedArticles={relatedArticles} />
      </main>
      <Footer />
    </>
  );
}
