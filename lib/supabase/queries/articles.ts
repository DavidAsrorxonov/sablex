import "server-only";

import { createOptionalServerAnonClient, createServiceRoleClient } from "@/lib/supabase/server";
import { throwSupabaseError } from "@/lib/supabase/errors";
import {
  toArticleDetail,
  toNewsArticle,
  type ArticleWithSourceAndAnalysis,
} from "@/lib/supabase/normalizers/articles";
import type { ArticleDetail } from "@/components/article-detail-data";
import type { NewsArticle } from "@/components/news-card";
import type { ArticleAnalysisRow, ArticleRow, Inserts } from "@/lib/supabase/types";

const URL_CHUNK_SIZE = 15;

const analyzedArticleSelect = `
  id,
  source_id,
  original_url,
  canonical_url,
  slug,
  title,
  image_url,
  published_at,
  raw_text,
  scraped_at,
  analyzed_at,
  created_at,
  updated_at,
  sources (
    id,
    name,
    listing_url,
    parser_strategy,
    active,
    logo_url,
    created_at,
    updated_at
  ),
  article_analyses (
    id,
    article_id,
    summary,
    sentiment_score,
    sentiment_label,
    bias_score,
    bias_label,
    left_percentage,
    center_percentage,
    right_percentage,
    confidence,
    framing_notes,
    loaded_terms,
    disclaimer,
    model,
    created_at,
    updated_at
  )
`;

export type InsertArticleInput = Inserts<"articles">;
export type SaveArticleAnalysisInput = Inserts<"article_analyses">;
export type PendingAnalysisArticle = ArticleRow & {
  sources: {
    id: string;
    name: string;
    listing_url: string;
    parser_strategy: string | null;
  } | null;
};

export async function getAnalyzedArticles(limit = 24): Promise<NewsArticle[]> {
  const supabase = createOptionalServerAnonClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(analyzedArticleSelect)
    .not("analyzed_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throwSupabaseError("Failed to fetch analyzed articles", error);
  }

  return ((data ?? []) as unknown as ArticleWithSourceAndAnalysis[])
    .map(toNewsArticle)
    .filter((article): article is NewsArticle => article !== null);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = createOptionalServerAnonClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select(analyzedArticleSelect)
    .eq("slug", slug)
    .not("analyzed_at", "is", null)
    .maybeSingle();

  if (error) {
    throwSupabaseError("Failed to fetch article by slug", error);
  }

  if (!data) {
    return null;
  }

  return toArticleDetail(data as unknown as ArticleWithSourceAndAnalysis);
}

export async function findExistingArticleUrls(urls: string[]): Promise<Set<string>> {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  const existingUrls = new Set<string>();

  if (uniqueUrls.length === 0) {
    return existingUrls;
  }

  const supabase = createServiceRoleClient();

  for (let index = 0; index < uniqueUrls.length; index += URL_CHUNK_SIZE) {
    const chunk = uniqueUrls.slice(index, index + URL_CHUNK_SIZE);
    const { data: originalMatches, error: originalError } = await supabase
      .from("articles")
      .select("original_url, canonical_url")
      .in("original_url", chunk);

    if (originalError) {
      throwSupabaseError("Failed to check existing original article URLs", originalError);
    }

    const { data: canonicalMatches, error: canonicalError } = await supabase
      .from("articles")
      .select("original_url, canonical_url")
      .in("canonical_url", chunk);

    if (canonicalError) {
      throwSupabaseError("Failed to check existing canonical article URLs", canonicalError);
    }

    for (const row of [...(originalMatches ?? []), ...(canonicalMatches ?? [])]) {
      existingUrls.add(row.original_url);
      existingUrls.add(row.canonical_url);
    }
  }

  return existingUrls;
}

export async function insertArticle(input: InsertArticleInput): Promise<ArticleRow> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("articles")
    .insert(input)
    .select()
    .single();

  if (error) {
    throwSupabaseError("Failed to insert article", error);
  }

  return data;
}

export async function getPendingAnalysisArticles(
  limit?: number,
): Promise<PendingAnalysisArticle[]> {
  const supabase = createServiceRoleClient();
  let query = supabase
    .from("articles")
    .select(
      `
        *,
        sources (
          id,
          name,
          listing_url,
          parser_strategy
        ),
        article_analyses (
          id
        )
      `,
    )
    .order("published_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throwSupabaseError("Failed to fetch pending analysis articles", error);
  }

  return ((data ?? []) as unknown as Array<PendingAnalysisArticle & {
    article_analyses: Array<Pick<ArticleAnalysisRow, "id">> | null;
  }>)
    .filter((article) => !article.article_analyses || article.article_analyses.length === 0)
    .map((article) => {
      const pendingArticle = { ...article };
      Reflect.deleteProperty(pendingArticle, "article_analyses");

      return pendingArticle as PendingAnalysisArticle;
    });
}

export async function saveArticleAnalysis(
  input: SaveArticleAnalysisInput,
): Promise<ArticleAnalysisRow> {
  const supabase = createServiceRoleClient();
  const { data: analysis, error: insertError } = await supabase
    .from("article_analyses")
    .insert(input)
    .select()
    .single();

  if (insertError) {
    throwSupabaseError("Failed to save article analysis", insertError);
  }

  const { error: updateError } = await supabase
    .from("articles")
    .update({ analyzed_at: new Date().toISOString() })
    .eq("id", input.article_id);

  if (updateError) {
    throwSupabaseError("Failed to mark article as analyzed", updateError);
  }

  return analysis;
}
