import Link from "next/link";

import { BiasMeter, type BiasMeterValues } from "@/components/bias-meter";
import { InfoIcon } from "@/components/homepage-icons";

export type NewsArticle = {
  category: string;
  region: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  framing: BiasMeterValues;
  sources: number;
  href?: string;
  publishedDate?: string;
  sentimentLabel?: string;
  framingLabel?: string;
  confidence?: number;
};

type NewsCardProps = {
  article: NewsArticle;
};

export function NewsCard({ article }: NewsCardProps) {
  const card = (
    <article className="group overflow-hidden rounded-lg border border-[#C9CCD1] bg-white shadow-sablex-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-sablex-md">
      <div
        role="img"
        aria-label={article.imageAlt}
        className="relative aspect-[1.78] bg-[#E7E5DF] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.12)), url(${article.imageUrl})`,
        }}
      >
        <span
          aria-label={`More context for ${article.title}`}
          className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full border border-white/70 bg-black/60 text-white shadow-sablex-sm"
        >
          <InfoIcon className="size-4" />
        </span>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-[12px] font-semibold leading-[1.35] text-[#171717]">
          {article.category}
          <span className="px-1 font-medium text-[#5C6169]">-</span>
          <span className="font-medium text-[#2F343D]">{article.region}</span>
        </p>

        <h2 className="min-h-[3.25rem] text-[18px] font-bold leading-[1.22] tracking-normal text-[#09090B] sm:text-[19px]">
          {article.title}
        </h2>

        <BiasMeter {...article.framing} />

        {(article.sentimentLabel || article.framingLabel || article.publishedDate) && (
          <div className="space-y-1 pt-1 text-[12px] leading-[1.4] text-[#4B5563]">
            {article.publishedDate && <p>{article.publishedDate}</p>}
            {(article.sentimentLabel || article.framingLabel) && (
              <p>
                {article.sentimentLabel}
                {article.sentimentLabel && article.framingLabel ? " - " : ""}
                {article.framingLabel}
              </p>
            )}
            {article.confidence !== undefined && (
              <p>{Math.round(article.confidence * 100)}% confidence</p>
            )}
          </div>
        )}

        <p className="pt-1 text-[13px] font-medium leading-[1.4] text-[#111114]">
          {article.sources} sources
        </p>
      </div>
    </article>
  );

  if (!article.href) {
    return card;
  }

  return (
    <Link href={article.href} className="block focus-visible:outline-2 focus-visible:outline-[#174EA6]">
      {card}
    </Link>
  );
}
