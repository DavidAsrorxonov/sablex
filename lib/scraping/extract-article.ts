import "server-only";

import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

import { isGenericTitle } from "@/lib/scraping/rejection-rules";
import type { ArticleExtractionResult } from "@/lib/scraping/types";
import { createArticleSlug, getCandidateRejectionReason, normalizeUrl } from "@/lib/scraping/url";
import type { SourceRow } from "@/lib/supabase/types";

const ARTICLE_BODY_SELECTORS = [
  "article",
  "main article",
  '[data-testid*="article-body"]',
  '[data-testid*="story-body"]',
  '[class*="article-body"]',
  '[class*="story-body"]',
  '[class*="ArticleBody"]',
  '[class*="body-content"]',
  '[itemprop="articleBody"]',
  "main",
];

const UNWANTED_CONTENT_SELECTOR = [
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "iframe",
  "form",
  "nav",
  "footer",
  "header",
  "aside",
  "figure figcaption",
  '[class*="ad" i]',
  '[id*="ad" i]',
  '[class*="advert" i]',
  '[class*="newsletter" i]',
  '[class*="subscribe" i]',
  '[class*="subscription" i]',
  '[class*="related" i]',
  '[class*="most" i]',
  '[class*="share" i]',
  '[class*="social" i]',
  '[data-testid*="ad" i]',
  '[data-testid*="newsletter" i]',
  '[data-testid*="related" i]',
].join(",");

export function extractArticleFromHtml(
  html: string,
  source: SourceRow,
  originalUrl: string,
): ArticleExtractionResult {
  const $ = cheerio.load(html);

  removeUnwantedNodes($);

  const canonicalUrl = getCanonicalUrl($, originalUrl);
  const canonicalRejectReason = getCandidateRejectionReason(canonicalUrl, source);

  if (canonicalRejectReason) {
    return { ok: false, reason: `canonical_${canonicalRejectReason}` };
  }

  const title = getTitle($);

  if (isGenericTitle(title)) {
    return { ok: false, reason: "generic_or_missing_title" };
  }

  const imageUrl = getImageUrl($, canonicalUrl);

  if (!imageUrl) {
    return { ok: false, reason: "missing_image_url" };
  }

  const publishedAt = getPublishedDate($);

  if (!publishedAt) {
    return { ok: false, reason: "missing_published_date" };
  }

  const paragraphs = getArticleParagraphs($);
  const meaningfulParagraphs = paragraphs.filter(isMeaningfulParagraph);
  const rawText = meaningfulParagraphs.join("\n\n");
  const meaningfulCharacterCount = rawText.replace(/\s+/g, " ").trim().length;

  if (meaningfulParagraphs.length < 3 && meaningfulCharacterCount < 900) {
    return { ok: false, reason: "insufficient_meaningful_body" };
  }

  return {
    ok: true,
    article: {
      sourceId: source.id,
      originalUrl,
      canonicalUrl,
      slug: createArticleSlug(title, canonicalUrl),
      title,
      imageUrl,
      publishedAt,
      rawText,
    },
  };
}

function removeUnwantedNodes($: cheerio.CheerioAPI) {
  $(UNWANTED_CONTENT_SELECTOR).remove();
}

function getCanonicalUrl($: cheerio.CheerioAPI, originalUrl: string) {
  const candidates = [
    $('link[rel="canonical"]').attr("href"),
    $('meta[property="og:url"]').attr("content"),
    originalUrl,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = normalizeUrl(candidate, originalUrl);

    if (normalized) {
      return normalized;
    }
  }

  return originalUrl;
}

function getTitle($: cheerio.CheerioAPI) {
  const candidates = [
    $('meta[property="og:title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    $("h1").first().text(),
    $("title").first().text(),
  ];

  for (const candidate of candidates) {
    const title = cleanTitle(candidate ?? "");

    if (title) {
      return title;
    }
  }

  return "";
}

function cleanTitle(value: string) {
  return normalizeWhitespace(value)
    .replace(/\s+\|\s+.*$/g, "")
    .replace(/\s+-\s+(Reuters|NPR|Fox News|BBC News|The Guardian).*$/gi, "")
    .trim();
}

function getImageUrl($: cheerio.CheerioAPI, baseUrl: string) {
  const candidates = [
    $('meta[property="og:image"]').attr("content"),
    $('meta[name="twitter:image"]').attr("content"),
    $("article img").first().attr("src"),
    $("main img").first().attr("src"),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const normalized = normalizeUrl(candidate, baseUrl);

    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function getPublishedDate($: cheerio.CheerioAPI) {
  const candidates = [
    $('meta[property="article:published_time"]').attr("content"),
    $('meta[name="article:published_time"]').attr("content"),
    $('meta[name="pubdate"]').attr("content"),
    $('meta[name="publishdate"]').attr("content"),
    $('meta[name="date"]').attr("content"),
    $("time[datetime]").first().attr("datetime"),
    extractJsonLdDate($),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const date = new Date(candidate);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return null;
}

function extractJsonLdDate($: cheerio.CheerioAPI) {
  const scripts = $('script[type="application/ld+json"]').toArray();

  for (const script of scripts) {
    const rawJson = $(script).text();

    try {
      const parsed = JSON.parse(rawJson) as unknown;
      const date = findDatePublished(parsed);

      if (date) {
        return date;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function findDatePublished(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const date = findDatePublished(item);

      if (date) {
        return date;
      }
    }

    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const directDate = record.datePublished;

  if (typeof directDate === "string") {
    return directDate;
  }

  const graph = record["@graph"];

  if (graph) {
    return findDatePublished(graph);
  }

  return null;
}

function getArticleParagraphs($: cheerio.CheerioAPI) {
  for (const selector of ARTICLE_BODY_SELECTORS) {
    const container = $(selector).first();

    if (container.length === 0) {
      continue;
    }

    const paragraphs = extractParagraphsFromContainer($, container);

    if (paragraphs.length > 0) {
      return paragraphs;
    }
  }

  return [];
}

function extractParagraphsFromContainer(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<AnyNode>,
) {
  const paragraphTexts = container
    .find("p")
    .toArray()
    .map((element) => cleanParagraph($(element).text()))
    .filter(Boolean);

  if (paragraphTexts.length > 0) {
    return paragraphTexts;
  }

  const blockTexts = container
    .find("div, section")
    .toArray()
    .map((element) => cleanParagraph($(element).text()))
    .filter(Boolean);

  if (blockTexts.length > 1) {
    return Array.from(new Set(blockTexts));
  }

  const fullText = cleanParagraph(container.text());

  return splitLongParagraph(fullText);
}

function cleanParagraph(value: string) {
  return normalizeWhitespace(value)
    .replace(/^Advertisement\s*/i, "")
    .replace(/^Share\s*/i, "")
    .replace(/^Listen\s+\d+\s+min\s*/i, "")
    .trim();
}

function splitLongParagraph(value: string) {
  if (!value) {
    return [];
  }

  if (value.length < 1_200) {
    return [value];
  }

  const sentences = value.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;

    if (next.length > 500) {
      if (current) {
        paragraphs.push(current);
      }

      current = sentence;
    } else {
      current = next;
    }
  }

  if (current) {
    paragraphs.push(current);
  }

  return paragraphs;
}

function isMeaningfulParagraph(value: string) {
  const normalized = value.trim();

  if (normalized.length < 60) {
    return false;
  }

  if (/^(advertisement|sign up|subscribe|newsletter|read more|view comments)/i.test(normalized)) {
    return false;
  }

  if (/[{};][.#]?[a-z-]+[:{]/i.test(normalized)) {
    return false;
  }

  const words = normalized.split(/\s+/);

  return words.length >= 10;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
