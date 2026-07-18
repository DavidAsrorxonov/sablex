import type { ArticleDetail } from "@/components/article-detail-data";
import type { NewsArticle } from "@/components/news-card";
import type {
  ArticleAnalysisRow,
  ArticleRow,
  BiasLabel,
  SourceRow,
} from "@/lib/supabase/types";

export type ArticleWithSourceAndAnalysis = ArticleRow & {
  sources: SourceRow | null;
  article_analyses: ArticleAnalysisRow[] | ArticleAnalysisRow | null;
};

const labelMap: Record<BiasLabel, ArticleDetail["overallBiasLabel"]> = {
  left: "Left",
  center: "Center",
  right: "Right",
  mixed: "Mixed",
  unclear: "Unclear",
};

export function toNewsArticle(row: ArticleWithSourceAndAnalysis): NewsArticle | null {
  const analysis = getSingleAnalysis(row.article_analyses);

  if (!analysis || !row.sources) {
    return null;
  }

  return {
    category: "News",
    region: row.sources.name,
    title: row.title,
    imageUrl: row.image_url,
    imageAlt: row.title,
    framing: {
      left: analysis.left_percentage,
      center: analysis.center_percentage,
      right: analysis.right_percentage,
    },
    sources: 1,
    href: `/news/${row.slug}`,
    publishedDate: formatDate(row.published_at),
    sentimentLabel: titleCase(analysis.sentiment_label),
    framingLabel: `AI-estimated ${labelMap[analysis.bias_label]}`,
    confidence: analysis.confidence,
  };
}

export function toArticleDetail(row: ArticleWithSourceAndAnalysis): ArticleDetail | null {
  const analysis = getSingleAnalysis(row.article_analyses);

  if (!analysis || !row.sources) {
    return null;
  }

  const paragraphs = splitParagraphs(row.raw_text);
  const summaryBullets = splitSummary(analysis.summary);
  const framing = {
    left: analysis.left_percentage,
    center: analysis.center_percentage,
    right: analysis.right_percentage,
  };

  return {
    slug: row.slug,
    category: "News",
    region: row.sources.name,
    title: row.title,
    byline: row.sources.name,
    publishedDate: formatDate(row.published_at),
    readTime: getReadTime(row.raw_text),
    imageUrl: row.image_url,
    imageAlt: row.title,
    caption: row.title,
    credit: row.sources.name,
    framing,
    sourceCount: 1,
    overallBiasLabel: labelMap[analysis.bias_label],
    confidence: analysis.confidence,
    sentimentLabel: titleCase(analysis.sentiment_label),
    summaryGeneratedAt: `Analyzed ${formatDate(analysis.created_at)}`,
    summaryReadTime: getReadTime(analysis.summary),
    summaryBullets,
    bodyParagraphs: paragraphs,
    sourceBreakdown: [
      { label: "Left", count: analysis.left_percentage, percentage: analysis.left_percentage },
      { label: "Center", count: analysis.center_percentage, percentage: analysis.center_percentage },
      { label: "Right", count: analysis.right_percentage, percentage: analysis.right_percentage },
    ],
    topSources: [
      {
        name: row.sources.name,
        bias: labelMap[analysis.bias_label],
      },
    ],
    relatedStories: [],
    framingNotes: analysis.framing_notes,
    loadedTerms: analysis.loaded_terms,
    disclaimer: analysis.disclaimer,
    model: analysis.model,
  };
}

function getSingleAnalysis(
  analysis: ArticleAnalysisRow[] | ArticleAnalysisRow | null,
): ArticleAnalysisRow | null {
  if (Array.isArray(analysis)) {
    return analysis[0] ?? null;
  }

  return analysis;
}

function splitParagraphs(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  return [text.trim()].filter(Boolean);
}

function splitSummary(summary: string) {
  const explicitLines = summary
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  if (explicitLines.length > 1) {
    return explicitLines;
  }

  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.length > 0 ? sentences.slice(0, 5) : [summary];
}

function getReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function titleCase(value: string) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
