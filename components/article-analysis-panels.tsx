import type {
  ArticleDetail,
  SourceBiasLabel,
  SourceBreakdownRow,
  TopSource,
} from "@/components/article-detail-data";
import { InfoIcon } from "@/components/homepage-icons";

type ArticleAnalysisPanelsProps = {
  article: ArticleDetail;
};

const biasColors: Record<SourceBiasLabel, string> = {
  Left: "#B42318",
  Center: "#D9D9D6",
  Right: "#174EA6",
};

const biasTextColors: Record<SourceBiasLabel, string> = {
  Left: "text-[#B42318]",
  Center: "text-[#31363F]",
  Right: "text-[#174EA6]",
};

export function ArticleAnalysisPanels({ article }: ArticleAnalysisPanelsProps) {
  return (
    <aside
      aria-label="Article analysis"
      className="space-y-6 lg:col-span-4 xl:col-span-4"
    >
      <BiasAnalysisPanel article={article} />
      <AiSummaryPanel article={article} />
      <SourceBreakdownPanel
        rows={article.sourceBreakdown}
        sources={article.topSources}
        total={article.sourceCount}
      />
    </aside>
  );
}

function Panel({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-[#D5D7DB] bg-white p-5 shadow-sablex-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold leading-[1.25] text-[#111114]">
          {title}
        </h2>
        <InfoIcon className="size-5 shrink-0" />
      </div>
      {children}
    </section>
  );
}

function BiasAnalysisPanel({ article }: { article: ArticleDetail }) {
  const overall = article.framing[article.overallBiasLabel.toLowerCase() as keyof typeof article.framing];

  return (
    <Panel title="Bias Analysis">
      <div className="border-b border-[#D5D7DB] pb-5">
        <p className="text-[13px] font-bold leading-[1.4] text-[#111114]">
          Overall Bias
        </p>
        <p className="mt-2 text-[26px] font-bold leading-[1.15] text-[#174EA6]">
          {article.overallBiasLabel} {overall}%
        </p>
        <p className="mt-1 text-[13px] font-medium leading-[1.45] text-[#174EA6]">
          Based on {article.sourceCount} balanced sources
        </p>
      </div>

      <div className="space-y-4 py-5">
        <BiasScaleRow label="Left" percentage={article.framing.left} />
        <BiasScaleRow label="Center" percentage={article.framing.center} />
        <BiasScaleRow label="Right" percentage={article.framing.right} />
      </div>

      <p className="text-[13px] leading-[1.55] text-[#111114]">
        Our analysis is based on the political leaning of the publication and
        how the story is framed. Sources are weighted by reliability and
        recency.
      </p>

      <button
        type="button"
        className="mt-5 h-11 w-full rounded border border-[#7D828A] bg-white px-4 text-[13px] font-bold text-[#111114] transition hover:bg-[#F4F4F1]"
      >
        How We Analyze Bias
      </button>
    </Panel>
  );
}

function AiSummaryPanel({ article }: { article: ArticleDetail }) {
  return (
    <Panel title="AI Summary">
      <p className="text-[12px] leading-[1.45] text-[#5C6169]">
        {article.summaryGeneratedAt}
        <span className="px-2">-</span>
        {article.summaryReadTime}
      </p>

      <ul className="mt-5 space-y-5 text-[14px] leading-[1.55] text-[#111114]">
        {article.summaryBullets.map((bullet) => (
          <li key={bullet} className="grid grid-cols-[6px_1fr] gap-3">
            <span className="mt-2 size-1.5 rounded-full bg-[#111114]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[12px] leading-[1.45] text-[#5C6169]">
        AI summaries can make mistakes.
      </p>
      <button
        type="button"
        className="mt-3 h-9 rounded border border-[#7D828A] bg-white px-5 text-[12px] font-bold text-[#111114] transition hover:bg-[#F4F4F1]"
      >
        Provide Feedback
      </button>
    </Panel>
  );
}

function SourceBreakdownPanel({
  rows,
  sources,
  total,
}: {
  rows: SourceBreakdownRow[];
  sources: TopSource[];
  total: number;
}) {
  return (
    <Panel title="Source Breakdown">
      <p className="text-[13px] font-bold leading-[1.4] text-[#111114]">
        {total} Total Sources
      </p>

      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <SourceRow key={row.label} row={row} />
        ))}
      </div>

      <div className="mt-7">
        <div className="mb-3 grid grid-cols-[1fr_auto] gap-3 text-[12px] font-bold text-[#111114]">
          <span>Top Sources</span>
          <span>Bias</span>
        </div>
        <div className="space-y-3 text-[13px] leading-[1.4]">
          {sources.map((source) => (
            <div key={source.name} className="grid grid-cols-[1fr_auto] gap-3">
              <span className="min-w-0 truncate font-semibold text-[#111114]">
                {source.name}
              </span>
              <span className={`font-semibold ${biasTextColors[source.bias]}`}>
                {source.bias}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-6 h-11 w-full rounded border border-[#7D828A] bg-white px-4 text-[13px] font-bold text-[#111114] transition hover:bg-[#F4F4F1]"
      >
        View All Sources
      </button>
    </Panel>
  );
}

function BiasScaleRow({
  label,
  percentage,
}: {
  label: SourceBiasLabel;
  percentage: number;
}) {
  return (
    <div className="grid grid-cols-[58px_44px_1fr] items-center gap-3 text-[13px] text-[#111114]">
      <span>{label}</span>
      <span className={`text-right font-bold ${biasTextColors[label]}`}>
        {percentage}%
      </span>
      <div className="h-2 overflow-hidden rounded-full bg-[#ECEDEB]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: biasColors[label],
          }}
        />
      </div>
    </div>
  );
}

function SourceRow({ row }: { row: SourceBreakdownRow }) {
  return (
    <div className="grid grid-cols-[58px_74px_1fr] items-center gap-3 text-[13px] text-[#111114]">
      <span>{row.label}</span>
      <span className="text-right font-semibold">
        {row.count} ({row.percentage}%)
      </span>
      <div className="h-2 overflow-hidden rounded-full bg-[#ECEDEB]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${row.percentage}%`,
            backgroundColor: biasColors[row.label],
          }}
        />
      </div>
    </div>
  );
}
