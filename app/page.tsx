import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F6F6] px-4 py-6 text-[#0D0D0F] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl flex-col justify-between rounded-xl border border-[#D6D8DC] bg-white p-6 shadow-sablex-sm sm:p-8">
        <header className="flex flex-col gap-4 border-b border-[#E5E7EB] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="leading-none">
            <p className="text-4xl font-bold tracking-normal">sablex</p>
            <p className="-mt-1 text-center text-sm font-semibold text-[#6B7280]">
              News
            </p>
          </div>
          <Link
            href="/design-system"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#CBD0D7] bg-white px-4 text-sm font-semibold shadow-sablex-sm transition hover:bg-[#F6F6F6]"
          >
            Design System
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1fr_420px]">
          <div className="max-w-2xl">
            <h1 className="text-[32px] font-bold leading-[1.2] text-[#0D0D0F] sm:text-5xl">
              Balanced news coverage, powered by AI.
            </h1>
            <p className="mt-5 text-base leading-[1.6] text-[#4B5563]">
              Analyzed articles will appear here once sources, scraping,
              persistence, and AI analysis are connected.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-[#F6F6F6] p-5">
            <div className="mb-5 border-b border-[#D6D8DC] pb-3">
              <h2 className="text-base font-bold uppercase leading-[1.4]">
                Article Feed
              </h2>
            </div>
            <div className="space-y-3">
              {["Sources pending", "Analysis pending", "Cards pending"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm shadow-sablex-sm"
                  >
                    <span className="font-medium">{item}</span>
                    <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                      Empty
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <footer className="border-t border-[#E5E7EB] pt-6 text-sm leading-[1.6] text-[#6B7280]">
          Stay consistent. Stay unbiased.
        </footer>
      </section>
    </main>
  );
}
