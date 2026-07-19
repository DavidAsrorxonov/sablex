import "server-only";

const REJECT_PATH_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\/(category|categories|section|sections|topics?|tags?)($|\/)/i, reason: "non_article_section" },
  { pattern: /\/(authors?|contributors?|people|profile)($|\/)/i, reason: "non_article_author" },
  { pattern: /\/(search|find)($|\/|\?)/i, reason: "non_article_search" },
  { pattern: /\/(shows?|programs?|podcasts?|radio)($|\/)/i, reason: "non_article_program" },
  { pattern: /\/(live|live-news|live-updates)($|\/)/i, reason: "non_article_live" },
  { pattern: /\/(games?|sport|sports)($|\/)/i, reason: "non_article_game_or_sport" },
  { pattern: /\/(shopping|shop|reviews?|product|deals?)($|\/)/i, reason: "non_article_shopping" },
  { pattern: /\/(about|contact|careers?|company|corporate|support|help|privacy|terms)($|\/)/i, reason: "non_article_corporate" },
  { pattern: /\/(newsletter|subscribe|subscription|membership|account|login|signin|register)($|\/)/i, reason: "non_article_subscription" },
  { pattern: /\/(video|videos|watch|audio|gallery|photos)($|\/)/i, reason: "non_article_media_only" },
];

const FILE_EXTENSION_PATTERN = /\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|mp4|mp3|m3u8)$/i;

export function getGenericRejectReason(url: URL): string | null {
  const path = url.pathname.replace(/\/+$/, "");

  if (path.length === 0 || path === "/") {
    return "homepage";
  }

  if (FILE_EXTENSION_PATTERN.test(path)) {
    return "asset_url";
  }

  for (const { pattern, reason } of REJECT_PATH_PATTERNS) {
    if (pattern.test(path)) {
      return reason;
    }
  }

  return null;
}

export function isGenericUiText(text: string): boolean {
  const normalized = text.trim().toLowerCase();

  if (normalized.length < 8) {
    return true;
  }

  return [
    "home",
    "menu",
    "more",
    "latest",
    "subscribe",
    "sign in",
    "log in",
    "watch live",
    "listen live",
    "read more",
    "learn more",
    "view all",
    "skip to main content",
  ].includes(normalized);
}

export function isGenericTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase();

  if (normalized.length < 18) {
    return true;
  }

  return [
    "home",
    "news",
    "world",
    "politics",
    "business",
    "sports",
    "live",
    "podcasts",
    "shows",
    "video",
    "weather",
    "latest news",
  ].includes(normalized);
}
