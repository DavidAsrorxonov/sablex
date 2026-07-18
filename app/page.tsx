import { newsArticles } from "@/components/homepage-data";
import { NewsCard } from "@/components/news-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopicRail } from "@/components/topic-rail";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#0D0D0F]">
      <SiteHeader />
      <TopicRail />

      <main className="mx-auto w-full max-w-365 px-4 py-8 sm:px-6 lg:px-12">
        <section aria-labelledby="top-news-heading">
          <h1
            id="top-news-heading"
            className="mb-6 text-[28px] font-bold leading-[1.2] sm:text-[32px]"
          >
            Top News
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {newsArticles.map((article) => (
              <NewsCard key={article.title} article={article} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
