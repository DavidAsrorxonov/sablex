import "server-only";

import { scrapeUrlWithOxylabs } from "@/lib/oxylabs/client";
import { extractArticleFromHtml } from "@/lib/scraping/extract-article";
import { extractHomepageArticleCandidates } from "@/lib/scraping/extract-homepage-links";
import type { ScrapeLogLevel, ScrapeRunSummary, SourceScrapeSummary } from "@/lib/scraping/types";
import { findExistingArticleUrls, insertArticle } from "@/lib/supabase/queries/articles";
import { insertLog } from "@/lib/supabase/queries/logs";
import type { Json, SourceRow } from "@/lib/supabase/types";

const CANDIDATE_MULTIPLIER = 4;

export async function runManualScrapePipeline(
  sources: SourceRow[],
  limitPerSource: number,
): Promise<ScrapeRunSummary> {
  const startedAt = Date.now();
  const summary = createInitialSummary(sources);

  await logScrape("info", "Scrape started", {
    selectedSources: summary.selectedSources,
    limitPerSource,
  });

  for (const source of sources) {
    const sourceSummary = await scrapeSource(source, limitPerSource, summary.rejectionReasons);
    summary.sourceSummaries.push(sourceSummary);
    summary.candidatesFound += sourceSummary.candidatesFound;
    summary.candidatesRejected += sourceSummary.candidatesRejected;
    summary.duplicatesSkipped += sourceSummary.duplicatesSkipped;
    summary.detailPagesScraped += sourceSummary.detailPagesScraped;
    summary.articlesInserted += sourceSummary.articlesInserted;
    summary.articlesRejected += sourceSummary.articlesRejected;
    summary.articlesFailed += sourceSummary.articlesFailed;
  }

  summary.totalDurationMs = Date.now() - startedAt;
  summary.status = summary.sourceSummaries.every((source) => source.status === "failed")
    ? "failed"
    : "completed";

  await logScrape(summary.status === "completed" ? "info" : "error", "Scrape completed", {
    status: summary.status,
    sourcesChecked: summary.sourcesChecked,
    candidatesFound: summary.candidatesFound,
    candidatesRejected: summary.candidatesRejected,
    duplicatesSkipped: summary.duplicatesSkipped,
    detailPagesScraped: summary.detailPagesScraped,
    articlesInserted: summary.articlesInserted,
    articlesRejected: summary.articlesRejected,
    articlesFailed: summary.articlesFailed,
    totalDurationMs: summary.totalDurationMs,
  });

  return summary;
}

async function scrapeSource(
  source: SourceRow,
  limitPerSource: number,
  rejectionReasons: Record<string, number>,
): Promise<SourceScrapeSummary> {
  const startedAt = Date.now();
  const sourceSummary = createSourceSummary(source);

  await logScrape("info", "Source scrape started", {
    sourceId: source.id,
    sourceName: source.name,
    listingUrl: source.listing_url,
  });

  try {
    const homepageHtml = await scrapeUrlWithOxylabs(source.listing_url);
    await logScrape("info", "Homepage fetched", {
      sourceName: source.name,
      listingUrl: source.listing_url,
    });

    const maxCandidates = Math.max(limitPerSource * CANDIDATE_MULTIPLIER, limitPerSource);
    const homepageExtraction = extractHomepageArticleCandidates(homepageHtml, source, maxCandidates);
    const homepageRejectedCount = sumReasonCounts(homepageExtraction.rejectedReasons);
    sourceSummary.candidatesFound = homepageExtraction.candidates.length + homepageRejectedCount;
    sourceSummary.candidatesRejected += homepageRejectedCount;
    mergeReasonCounts(rejectionReasons, homepageExtraction.rejectedReasons);

    await logScrape("info", "Candidate links extracted", {
      sourceName: source.name,
      candidatesFound: sourceSummary.candidatesFound,
      candidatesKept: homepageExtraction.candidates.length,
      candidatesRejected: homepageRejectedCount,
    });

    const candidateUrls = homepageExtraction.candidates.map((candidate) => candidate.url);
    const existingUrls = await findExistingArticleUrls(candidateUrls);
    const detailCandidates = homepageExtraction.candidates.filter((candidate) => {
      if (existingUrls.has(candidate.url)) {
        sourceSummary.duplicatesSkipped += 1;
        return false;
      }

      return true;
    });

    await logScrape("info", "Duplicate candidate URLs skipped", {
      sourceName: source.name,
      duplicatesSkipped: sourceSummary.duplicatesSkipped,
    });

    for (const candidate of detailCandidates) {
      if (sourceSummary.articlesInserted >= limitPerSource) {
        break;
      }

      try {
        const detailHtml = await scrapeUrlWithOxylabs(candidate.url);
        sourceSummary.detailPagesScraped += 1;
        const extraction = extractArticleFromHtml(detailHtml, source, candidate.url);

        if (!extraction.ok) {
          sourceSummary.articlesRejected += 1;
          incrementReason(rejectionReasons, extraction.reason);
          continue;
        }

        const postExtractionExisting = await findExistingArticleUrls([
          extraction.article.originalUrl,
          extraction.article.canonicalUrl,
        ]);

        if (
          postExtractionExisting.has(extraction.article.originalUrl) ||
          postExtractionExisting.has(extraction.article.canonicalUrl)
        ) {
          sourceSummary.duplicatesSkipped += 1;
          continue;
        }

        await insertArticle({
          source_id: extraction.article.sourceId,
          original_url: extraction.article.originalUrl,
          canonical_url: extraction.article.canonicalUrl,
          slug: extraction.article.slug,
          title: extraction.article.title,
          image_url: extraction.article.imageUrl,
          published_at: extraction.article.publishedAt,
          raw_text: extraction.article.rawText,
          scraped_at: new Date().toISOString(),
          analyzed_at: null,
        });

        sourceSummary.articlesInserted += 1;
        await logScrape("info", "Article inserted", {
          sourceName: source.name,
          title: extraction.article.title,
          originalUrl: extraction.article.originalUrl,
        });
      } catch (error) {
        sourceSummary.articlesFailed += 1;
        const message = getErrorMessage(error);
        await logScrape("warn", "Article detail scrape failed", {
          sourceName: source.name,
          candidateUrl: candidate.url,
          error: message,
        });
      }
    }

    sourceSummary.durationMs = Date.now() - startedAt;
    sourceSummary.status = "completed";
    await logScrape("info", "Source scrape completed", {
      ...sourceSummary,
    });

    return sourceSummary;
  } catch (error) {
    sourceSummary.status = "failed";
    sourceSummary.error = getErrorMessage(error);
    sourceSummary.durationMs = Date.now() - startedAt;
    await logScrape("error", "Source scrape failed", {
      sourceName: source.name,
      error: sourceSummary.error,
    });

    return sourceSummary;
  }
}

function createInitialSummary(sources: SourceRow[]): ScrapeRunSummary {
  return {
    status: "completed",
    sourcesChecked: sources.length,
    selectedSources: sources.map((source) => source.name),
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
    sourceSummaries: [],
  };
}

function createSourceSummary(source: SourceRow): SourceScrapeSummary {
  return {
    sourceId: source.id,
    sourceName: source.name,
    status: "completed",
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    durationMs: 0,
  };
}

async function logScrape(level: ScrapeLogLevel, message: string, metadata: Json = {}) {
  const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
  logMethod(`[scrape] ${message}`, metadata);

  try {
    await insertLog({
      level,
      scope: "scrape",
      message,
      metadata,
    });
  } catch (error) {
    console.warn("[scrape] Failed to insert scrape log", getErrorMessage(error));
  }
}

function mergeReasonCounts(target: Record<string, number>, source: Record<string, number>) {
  for (const [reason, count] of Object.entries(source)) {
    target[reason] = (target[reason] ?? 0) + count;
  }
}

function sumReasonCounts(reasons: Record<string, number>) {
  return Object.values(reasons).reduce((total, count) => total + count, 0);
}

function incrementReason(reasons: Record<string, number>, reason: string) {
  reasons[reason] = (reasons[reason] ?? 0) + 1;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}
