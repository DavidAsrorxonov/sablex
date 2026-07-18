import { notFound } from "next/navigation";

import { ArticleDetailPage } from "@/components/article-detail-page";
import { getArticleBySlug } from "@/lib/supabase/queries/articles";

export const dynamic = "force-dynamic";

export default async function NewsDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailPage article={article} />;
}
