import { NewsCard } from "@/components/news-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopicRail } from "@/components/topic-rail";
import { getAnalyzedArticles } from "@/lib/supabase/queries/articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const newsArticles = await getAnalyzedArticles();

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

          {newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              {newsArticles.map((article) => (
                <NewsCard key={article.href ?? article.title} article={article} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#D5D7DB] bg-white p-8 shadow-sablex-sm">
              <h2 className="text-[20px] font-bold leading-[1.3] text-[#111114]">
                No analyzed articles yet
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-[1.6] text-[#5C6169]">
                Run the Supabase schema and seed SQL, then insert analyzed article
                data. The homepage only displays articles that have completed AI
                analysis.
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
