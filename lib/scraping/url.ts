import "server-only";

import { createHash } from "node:crypto";

import type { SourceRow } from "@/lib/supabase/types";
import { getGenericRejectReason } from "@/lib/scraping/rejection-rules";

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "cmpid",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
];

const MONTH_PATH_PATTERN =
  /\/20\d{2}\/(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\/\d{1,2}\//i;

export function normalizeUrl(rawUrl: string, baseUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl, baseUrl);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    parsed.hash = "";

    for (const param of TRACKING_PARAMS) {
      parsed.searchParams.delete(param);
    }

    if (parsed.searchParams.size === 0) {
      parsed.search = "";
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function isSameSourceHost(candidateUrl: string, sourceUrl: string): boolean {
  try {
    const candidateHost = new URL(candidateUrl).hostname.replace(/^www\./, "");
    const sourceHost = new URL(sourceUrl).hostname.replace(/^www\./, "");

    return candidateHost === sourceHost || candidateHost.endsWith(`.${sourceHost}`);
  } catch {
    return false;
  }
}

export function getCandidateRejectionReason(url: string, source: SourceRow): string | null {
  if (!isSameSourceHost(url, source.listing_url)) {
    return "external_url";
  }

  const parsed = new URL(url);
  const genericReason = getGenericRejectReason(parsed);

  if (genericReason) {
    return genericReason;
  }

  const path = parsed.pathname.replace(/\/+$/, "");
  const strategy = source.parser_strategy;

  if (strategy === "reuters") {
    if (/\/20\d{2}\/\d{2}\/\d{2}\//.test(path) || /-[A-Z0-9]{6,}$/i.test(path)) {
      return null;
    }

    return "source_url_not_article_like";
  }

  if (strategy === "npr") {
    if (/\/(sections|podcasts|programs|people|series)\//i.test(path)) {
      return "source_non_article_path";
    }

    if (/\/\d{4}\/\d{2}\/\d{2}\//.test(path) || /\/\d{8,13}\//.test(path)) {
      return null;
    }

    return "source_url_not_article_like";
  }

  if (strategy === "fox_news") {
    if (/\/(shows|live-news|video|sports|food-drink|shopping|deals)\//i.test(path)) {
      return "source_non_article_path";
    }

    if (/^\/(politics|world|us|media|opinion|business|health|science|tech)\//i.test(path)) {
      return hasLongSlug(path) ? null : "source_url_not_article_like";
    }

    return "source_url_not_article_like";
  }

  if (strategy === "bbc") {
    if (/^\/(sport|weather)\b/i.test(path) || /\/(live|topics)\//i.test(path)) {
      return "source_non_article_path";
    }

    if (/^\/news\/articles\/[a-z0-9]+/i.test(path) || /^\/news\/[a-z0-9-]{18,}$/i.test(path)) {
      return null;
    }

    return "source_url_not_article_like";
  }

  if (strategy === "guardian") {
    if (/\/(tone|profile|thefilter-us)\//i.test(path)) {
      return "source_non_article_path";
    }

    if (MONTH_PATH_PATTERN.test(path)) {
      return null;
    }

    return "source_url_not_article_like";
  }

  if (hasArticleSignals(path)) {
    return null;
  }

  return "generic_url_not_article_like";
}

export function createArticleSlug(title: string, url: string) {
  const slugBase = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 8);

  return `${slugBase || "article"}-${hash}`;
}

function hasLongSlug(path: string) {
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) ?? "";

  return lastSegment.length >= 18 && lastSegment.includes("-");
}

function hasArticleSignals(path: string) {
  return (
    /\/20\d{2}[/-]\d{1,2}[/-]\d{1,2}\//.test(path) ||
    MONTH_PATH_PATTERN.test(path) ||
    /\/\d{8,13}(\/|$)/.test(path) ||
    hasLongSlug(path)
  );
}
