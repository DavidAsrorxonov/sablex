import "server-only";

import type { SourceRow } from "@/lib/supabase/types";

export const DEFAULT_LIMIT_PER_SOURCE = 5;
export const MAX_LIMIT_PER_SOURCE = 10;

export type ScrapeRequestOptions = {
  sourceIds?: string[];
  sourceNames?: string[];
  limitPerSource: number;
};

export type ArticleCandidate = {
  url: string;
  source: SourceRow;
  anchorText: string;
};

export type ExtractedArticle = {
  sourceId: string;
  originalUrl: string;
  canonicalUrl: string;
  slug: string;
  title: string;
  imageUrl: string;
  publishedAt: string;
  rawText: string;
};

export type ArticleExtractionResult =
  | {
      ok: true;
      article: ExtractedArticle;
    }
  | {
      ok: false;
      reason: string;
    };

export type SourceScrapeSummary = {
  sourceId: string;
  sourceName: string;
  status: "completed" | "failed";
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  durationMs: number;
  error?: string;
};

export type ScrapeRunSummary = {
  status: "completed" | "failed";
  sourcesChecked: number;
  selectedSources: string[];
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
  sourceSummaries: SourceScrapeSummary[];
};

export type ScrapeLogLevel = "info" | "warn" | "error";
