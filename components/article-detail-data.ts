import type { BiasMeterValues } from "@/components/bias-meter";

export type SourceBiasLabel = "Left" | "Center" | "Right";

export type SourceBreakdownRow = {
  label: SourceBiasLabel;
  count: number;
  percentage: number;
};

export type TopSource = {
  name: string;
  bias: SourceBiasLabel;
};

export type RelatedStory = {
  category: string;
  region: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  publishedDate: string;
  readTime: string;
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
  overallBiasLabel: SourceBiasLabel;
  confidence: number;
  summaryGeneratedAt: string;
  summaryReadTime: string;
  summaryBullets: string[];
  bodyParagraphs: string[];
  sourceBreakdown: SourceBreakdownRow[];
  topSources: TopSource[];
  relatedStories: RelatedStory[];
};

export const articleDetails: ArticleDetail[] = [
  {
    slug: "trump-sends-iran-revised-peace-proposal",
    category: "Politics",
    region: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    byline: "David Morgan",
    publishedDate: "May 31, 2026",
    readTime: "12 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "A formal political press setting with American flags",
    caption: "President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.",
    credit: "Photo: Andrew Harnik/Getty Images",
    framing: { left: 20, center: 31, right: 49 },
    sourceCount: 12,
    overallBiasLabel: "Right",
    confidence: 0.78,
    summaryGeneratedAt: "Generated May 31, 2026",
    summaryReadTime: "3 min read",
    summaryBullets: [
      "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt to uranium enrichment and the removal of enriched uranium stockpiles.",
      "The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.",
      "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
      "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
      "Israel supports the tougher stance, praising the administration's determination to prevent Iran from acquiring nuclear weapons.",
    ],
    bodyParagraphs: [
      "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
      "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship stockpiles of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
      "\"This is a take-it-or-leave-it proposal,\" a senior administration official told the Wall Street Journal. \"The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.\"",
      "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
      "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
      "European allies have urged both sides to continue negotiations. \"We believe diplomacy is still the best path forward,\" said a spokesperson for the EU's foreign policy chief.",
      "Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration's tougher stance. \"This is the kind of leadership that was missing in the past,\" said Israeli Prime Minister Benjamin Netanyahu in a statement.",
      "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached - or if tensions will escalate further.",
    ],
    sourceBreakdown: [
      { label: "Left", count: 2, percentage: 20 },
      { label: "Center", count: 4, percentage: 31 },
      { label: "Right", count: 6, percentage: 49 },
    ],
    topSources: [
      { name: "Fox News", bias: "Right" },
      { name: "The Wall Street Journal", bias: "Center" },
      { name: "Reuters", bias: "Center" },
      { name: "BBC", bias: "Center" },
      { name: "CNN", bias: "Left" },
      { name: "The New York Times", bias: "Center" },
      { name: "The Washington Post", bias: "Center" },
      { name: "Newsmax", bias: "Right" },
    ],
    relatedStories: [
      {
        category: "World",
        region: "Middle East",
        title: "Iran Says It Will Not Negotiate Under 'Maximum Pressure'",
        imageUrl:
          "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=300&q=80",
        imageAlt: "Iranian flag at sunset",
        publishedDate: "May 29, 2026",
        readTime: "8 min read",
      },
      {
        category: "Politics",
        region: "United States",
        title: "Bipartisan Group Urges Diplomacy With Iran",
        imageUrl:
          "https://images.unsplash.com/photo-1613324996029-f6190a1782b4?auto=format&fit=crop&w=300&q=80",
        imageAlt: "The United States Capitol building",
        publishedDate: "May 26, 2026",
        readTime: "5 min read",
      },
      {
        category: "Politics",
        region: "United States",
        title: "US Sanctions More Iranian Entities Over Nuclear Program",
        imageUrl:
          "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=300&q=80",
        imageAlt: "A government building with columns",
        publishedDate: "May 28, 2026",
        readTime: "6 min read",
      },
      {
        category: "Science",
        region: "Nuclear Policy",
        title: "What's in the 2015 Iran Nuclear Deal?",
        imageUrl:
          "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=300&q=80",
        imageAlt: "Nuclear warning symbol",
        publishedDate: "May 25, 2026",
        readTime: "10 min read",
      },
      {
        category: "World",
        region: "Middle East",
        title: "Oman Hosts Another Round of US-Iran Nuclear Talks",
        imageUrl:
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=300&q=80",
        imageAlt: "Oman flag outdoors",
        publishedDate: "May 27, 2026",
        readTime: "7 min read",
      },
      {
        category: "World",
        region: "Middle East",
        title: "Israel Reaffirms Red Line Over Iranian Nuclear Program",
        imageUrl:
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=300&q=80",
        imageAlt: "Israeli flag in daylight",
        publishedDate: "May 24, 2026",
        readTime: "6 min read",
      },
    ],
  },
];

export function getArticleDetail(slug: string) {
  return articleDetails.find((article) => article.slug === slug);
}
