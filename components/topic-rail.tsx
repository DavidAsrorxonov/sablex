import { PlusIcon } from "@/components/homepage-icons";
import { topicLabels } from "@/components/homepage-data";

export function TopicRail() {
  return (
    <section
      aria-label="Topics"
      className="border-b border-[#D5D7DB] bg-[#F7F7F4]"
    >
      <div className="mx-auto flex h-14 max-w-[1460px] items-center px-4 sm:px-6 lg:px-12">
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
          <button
            type="button"
            aria-label="Add topic"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ECECEA] text-[#111114] shadow-sablex-sm"
          >
            <PlusIcon />
          </button>

          {topicLabels.map((topic) => (
            <button
              key={topic}
              type="button"
              className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-[#E9E9E6] px-4 text-[12px] font-bold text-[#111114] shadow-sablex-sm transition hover:bg-[#DEDEDA]"
            >
              <span>{topic}</span>
              <PlusIcon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
