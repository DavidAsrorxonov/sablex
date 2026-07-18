import type { BiasMeterValues } from "@/components/bias-meter";

export type SourceBiasLabel = "Left" | "Center" | "Right";
export type FramingLabel = SourceBiasLabel | "Mixed" | "Unclear";

export type SourceBreakdownRow = {
  label: SourceBiasLabel;
  count: number;
  percentage: number;
};

export type TopSource = {
  name: string;
  bias: FramingLabel;
};

export type RelatedStory = {
  category: string;
  region: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  publishedDate: string;
  readTime: string;
  href?: string;
};

export type ArticleDetail = {
  slug: string;
  category: string;
  region: string;
  title: string;
  byline: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  imageAlt: string;
  caption: string;
  credit: string;
  framing: BiasMeterValues;
  sourceCount: number;
  overallBiasLabel: FramingLabel;
  confidence: number;
  sentimentLabel: string;
  summaryGeneratedAt: string;
  summaryReadTime: string;
  summaryBullets: string[];
  bodyParagraphs: string[];
  sourceBreakdown: SourceBreakdownRow[];
  topSources: TopSource[];
  relatedStories: RelatedStory[];
  framingNotes: string[];
  loadedTerms: string[];
  disclaimer: string;
  model: string;
};
