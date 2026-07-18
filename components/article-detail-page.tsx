import Link from "next/link";

import { ArticleActions } from "@/components/article-actions";
import { ArticleAnalysisPanels } from "@/components/article-analysis-panels";
import type { ArticleDetail, RelatedStory } from "@/components/article-detail-data";
import { BiasMeter } from "@/components/bias-meter";
import { InfoIcon, MailIcon } from "@/components/homepage-icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ArticleDetailPageProps = {
  article: ArticleDetail;
};

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#0D0D0F]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1460px] px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 xl:gap-12">
          <article className="min-w-0 lg:col-span-8 xl:col-span-8">
            <header>
              <p className="text-[13px] font-semibold leading-[1.45] text-[#111114]">
                {article.category}
                <span className="px-1.5 font-medium text-[#5C6169]">-</span>
                <span className="font-medium">{article.region}</span>
              </p>

              <h1 className="mt-4 max-w-4xl text-[34px] font-bold leading-[1.13] tracking-normal text-[#070709] sm:text-[42px] lg:text-[46px]">
                {article.title}
              </h1>

              <div className="mt-5 flex flex-col gap-4 border-b border-transparent sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] leading-[1.45] text-[#5C6169]">
                  <span className="font-semibold text-[#111114]">
                    By {article.byline}
                  </span>
                  <span>{article.publishedDate}</span>
                  <span>{article.readTime}</span>
                </div>
                <ArticleActions />
              </div>
            </header>

            <figure className="mt-7">
              <div
                role="img"
                aria-label={article.imageAlt}
                className="aspect-[1.82] w-full rounded-md bg-[#D8D8D2] bg-cover bg-center shadow-sablex-sm"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,0.14)), url(${article.imageUrl})`,
                }}
              />
              <figcaption className="mt-3 text-[11px] leading-[1.45] text-[#5C6169]">
                {article.caption}
                <br />
                {article.credit}
              </figcaption>
            </figure>

            <section
              aria-labelledby="bias-distribution-heading"
              className="mt-7 rounded-lg border border-[#D5D7DB] bg-white p-5 shadow-sablex-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <h2
                  id="bias-distribution-heading"
                  className="text-[14px] font-bold leading-[1.4]"
                >
                  Bias Distribution
                </h2>
                <InfoIcon className="size-4" />
              </div>
              <BiasMeter {...article.framing} />
              <p className="mt-4 text-[13px] font-bold leading-[1.4] text-[#111114]">
                {article.sourceCount} sources
              </p>
            </section>

            <div className="mt-8 space-y-6 text-[17px] leading-[1.68] text-[#111114] sm:text-[18px]">
              {article.bodyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <RelatedStories stories={article.relatedStories} />
          </article>

          <ArticleAnalysisPanels article={article} />
        </div>

        <NewsletterBand />
      </main>

      <SiteFooter />
    </div>
  );
}

function RelatedStories({ stories }: { stories: RelatedStory[] }) {
  return (
    <section
      aria-labelledby="related-stories-heading"
      className="mt-9 border-t border-[#C9CCD1] pt-6"
    >
      <h2
        id="related-stories-heading"
        className="text-[17px] font-bold leading-[1.4] text-[#111114]"
      >
        Related Stories
      </h2>
      <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
        {stories.map((story) => (
          <RelatedStoryCard key={story.title} story={story} />
        ))}
      </div>
    </section>
  );
}

function RelatedStoryCard({ story }: { story: RelatedStory }) {
  return (
    <Link
      href="#"
      className="group grid grid-cols-[96px_1fr] gap-4 rounded-md transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#174EA6]"
    >
      <div
        role="img"
        aria-label={story.imageAlt}
        className="aspect-[1.2] rounded bg-[#D8D8D2] bg-cover bg-center"
        style={{ backgroundImage: `url(${story.imageUrl})` }}
      />
      <div className="min-w-0 py-0.5">
        <p className="text-[11px] font-medium leading-[1.35] text-[#6B7280]">
          {story.category}
          <span className="px-1">-</span>
          {story.region}
        </p>
        <h3 className="mt-1 text-[14px] font-bold leading-[1.25] text-[#111114] transition group-hover:text-[#174EA6]">
          {story.title}
        </h3>
        <p className="mt-2 text-[11px] leading-[1.35] text-[#5C6169]">
          {story.publishedDate}
          <span className="px-1.5">-</span>
          {story.readTime}
        </p>
      </div>
    </Link>
  );
}

function NewsletterBand() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mt-12 rounded-lg border border-[#D5D7DB] bg-white px-5 py-6 shadow-sablex-sm sm:px-8 lg:mt-14"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(420px,0.68fr)] lg:items-center">
        <div>
          <h2
            id="newsletter-heading"
            className="flex items-center gap-2 text-[22px] font-bold leading-[1.25] text-[#111114]"
          >
            <MailIcon className="size-5" />
            Stay Informed. Stay Balanced.
          </h2>
          <p className="mt-2 text-[14px] leading-[1.5] text-[#5C6169]">
            Get the top stories and bias analysis delivered to your inbox.
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            className="h-12 min-w-0 rounded border border-[#8E939B] bg-white px-4 text-[14px] text-[#111114] outline-offset-3 placeholder:text-[#6B7280]"
          />
          <button
            type="button"
            className="h-12 rounded-md bg-[#171717] px-6 text-[14px] font-bold text-white shadow-sablex-sm transition hover:bg-black"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
