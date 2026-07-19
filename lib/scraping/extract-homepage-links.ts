import "server-only";

import * as cheerio from "cheerio";
import type { Element } from "domhandler";

import { isGenericUiText } from "@/lib/scraping/rejection-rules";
import type { ArticleCandidate } from "@/lib/scraping/types";
import { getCandidateRejectionReason, normalizeUrl } from "@/lib/scraping/url";
import type { SourceRow } from "@/lib/supabase/types";

const STORY_CONTAINER_SELECTOR = [
  "main",
  "article",
  '[class*="story"]',
  '[class*="card"]',
  '[class*="headline"]',
  '[class*="promo"]',
  '[data-testid*="story"]',
  '[data-testid*="card"]',
  '[data-testid*="headline"]',
].join(",");

const BLOCKED_ANCESTOR_SELECTOR = [
  "header",
  "footer",
  "nav",
  "aside",
  '[role="navigation"]',
  '[aria-label*="navigation" i]',
  '[class*="menu" i]',
  '[class*="footer" i]',
  '[class*="newsletter" i]',
  '[class*="subscribe" i]',
].join(",");

export type HomepageExtractionResult = {
  candidates: ArticleCandidate[];
  rejectedReasons: Record<string, number>;
};

export function extractHomepageArticleCandidates(
  html: string,
  source: SourceRow,
  maxCandidates: number,
): HomepageExtractionResult {
  const $ = cheerio.load(html);
  const candidates = new Map<string, ArticleCandidate>();
  const rejectedReasons: Record<string, number> = {};

  removeNonContentNodes($);

  const anchors = $(STORY_CONTAINER_SELECTOR).find("a[href]").toArray();
  const fallbackAnchors = anchors.length > 0 ? anchors : $("main a[href], body a[href]").toArray();

  for (const anchor of fallbackAnchors) {
    if (candidates.size >= maxCandidates) {
      break;
    }

    const candidate = getCandidateFromAnchor($, anchor, source);

    if (!candidate.ok) {
      incrementReason(rejectedReasons, candidate.reason);
      continue;
    }

    candidates.set(candidate.candidate.url, candidate.candidate);
  }

  return {
    candidates: Array.from(candidates.values()),
    rejectedReasons,
  };
}

function removeNonContentNodes($: cheerio.CheerioAPI) {
  $(
    [
      "script",
      "style",
      "noscript",
      "template",
      "svg",
      "form",
      "[hidden]",
      '[aria-hidden="true"]',
    ].join(","),
  ).remove();
}

function getCandidateFromAnchor(
  $: cheerio.CheerioAPI,
  anchor: Element,
  source: SourceRow,
):
  | { ok: true; candidate: ArticleCandidate }
  | { ok: false; reason: string } {
  const link = $(anchor);

  if (link.closest(BLOCKED_ANCESTOR_SELECTOR).length > 0) {
    return { ok: false, reason: "navigation_or_footer_link" };
  }

  const href = link.attr("href");
  const text = normalizeWhitespace(link.text() || link.attr("aria-label") || "");

  if (!href) {
    return { ok: false, reason: "missing_href" };
  }

  if (isGenericUiText(text)) {
    return { ok: false, reason: "generic_anchor_text" };
  }

  const url = normalizeUrl(href, source.listing_url);

  if (!url) {
    return { ok: false, reason: "invalid_url" };
  }

  const rejectionReason = getCandidateRejectionReason(url, source);

  if (rejectionReason) {
    return { ok: false, reason: rejectionReason };
  }

  return {
    ok: true,
    candidate: {
      url,
      source,
      anchorText: text,
    },
  };
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function incrementReason(reasons: Record<string, number>, reason: string) {
  reasons[reason] = (reasons[reason] ?? 0) + 1;
}
