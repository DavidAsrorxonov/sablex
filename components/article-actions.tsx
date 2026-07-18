import {
  BookmarkIcon,
  MoreIcon,
  ShareIcon,
} from "@/components/homepage-icons";

export function ArticleActions() {
  return (
    <div className="flex shrink-0 items-center gap-2 text-[#111114] sm:gap-3">
      <ArticleActionButton label="Save article">
        <span className="hidden text-[12px] font-medium sm:inline">Save</span>
        <BookmarkIcon className="size-5" />
      </ArticleActionButton>
      <ArticleActionButton label="Share article">
        <span className="hidden text-[12px] font-medium sm:inline">Share</span>
        <ShareIcon className="size-5" />
      </ArticleActionButton>
      <ArticleActionButton label="More article actions">
        <MoreIcon className="size-5" />
      </ArticleActionButton>
    </div>
  );
}

function ArticleActionButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-md px-1 text-[#111114] transition hover:bg-black/5 sm:px-2"
    >
      {children}
    </button>
  );
}
