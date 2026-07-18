import { notFound } from "next/navigation";

import { ArticleDetailPage } from "@/components/article-detail-page";
import { articleDetails, getArticleDetail } from "@/components/article-detail-data";

export function generateStaticParams() {
  return articleDetails.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleDetail(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailPage article={article} />;
}
