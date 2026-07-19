# sablex Oxylabs Scraping Pipeline Implementation Prompt

## Goal

Implement the manual Oxylabs scrape-to-insert pipeline for sablex.

This pass should add a protected `POST /api/scrape` route that loads active sources from Supabase, fetches each selected source homepage through Oxylabs Web Scraper API, extracts likely homepage story links, rejects non-article URLs before detail scraping, scrapes valid detail pages through Oxylabs, validates and cleans article content, dedupes against Supabase, inserts only valid new articles append-only, writes logs, and returns a final run summary.

Do not implement Oxylabs Scheduler, Vercel Cron, AI analysis, pgvector embeddings, related articles, Clerk UI changes, or website UI changes in this pass.

## Skills Read

- Read `AGENTS.md`.
- Read `.agents/skills/oxylabs-web-scraper/SKILL.md` because the user explicitly requested Oxylabs scraping.
- Read `.agents/skills/oxylabs-web-scraper/examples.md` for the Realtime API request and response shape.
- Read `.agents/skills/supabase/SKILL.md` because the user explicitly requested Supabase.
- Checked current Supabase official docs:
  - `https://supabase.com/docs/guides/api/securing-your-api`
  - `https://supabase.com/docs/reference/javascript/installing`
  - `https://supabase.com/docs/reference/javascript/typescript-support`
  - `https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically`
- Read local Next.js docs required by `AGENTS.md` for the installed Next version:
  - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/next-response.md`

## Existing Code Inspected

- `package.json`: Next `16.2.10`, React `19.2.4`, Supabase client is installed, but `cheerio` and `zod` are not installed.
- `.env.example`: already contains `OXY_WSA_USERNAME`, `OXY_WSA_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, and `sablex_ADMIN_SECRET`.
- `supabase/schema.sql`: core tables exist for `sources`, `articles`, `article_analyses`, `logs`, `oxylabs_schedules`, and `oxylabs_schedule_runs`; RLS and explicit grants are already present.
- `supabase/seed.sql`: active seeded sources are Reuters, NPR, Fox News, BBC, and The Guardian, each using homepage entry URLs and parser strategies.
- `lib/supabase/server.ts`: service-role client exists and is server-only.
- `lib/supabase/types.ts`: database table types already match the current schema.
- `lib/supabase/queries/sources.ts`: helpers exist for active source selection by all active, name, or id.
- `lib/supabase/queries/articles.ts`: helpers exist for URL existence checks in chunks of 15, article inserts, analyzed reads, and analysis writes.
- `lib/supabase/queries/logs.ts`: helpers exist for log insert/read.
- `lib/supabase/queries/oxylabs-schedules.ts`: schedule helpers exist, but scheduler routes are out of scope for this pass.
- `lib/supabase/normalizers/articles.ts`: UI mapping exists and should not be changed for scraping.
- `app/page.tsx` and `app/news/[slug]/page.tsx`: UI reads analyzed articles only; scraping must not be called from UI.
- There are no existing `app/api/*` routes or scraping modules.

## Decisions Or Assumptions

- Scope is the manual scraping pipeline only: `POST /api/scrape`.
- Use the seeded active source set as the expected local baseline: Reuters, NPR, Fox News, BBC, and The Guardian. The implementation must still load sources from Supabase at runtime and must not hardcode listing URLs.
- Request body should support optional source selection and limits:
  - `sourceIds?: string[]`
  - `sourceNames?: string[]`
  - `limitPerSource?: number`
- If both `sourceIds` and `sourceNames` are absent, default to all active sources.
- If `limitPerSource` is absent, default to `5`.
- If both ids and names are provided, use the union of active matching sources without duplicates.
- Clamp `limitPerSource` to a conservative maximum, such as `10`, to avoid long route executions and unnecessary Oxylabs spend.
- Install `cheerio` for HTML parsing and `zod` for request body validation.
- Use Oxylabs Realtime API with `source: "universal"` and the source/detail URL.
- Start without `parse: true` because news article parsing is custom and source-specific. Use raw HTML from `results[0].content`.
- Use `render: "html"` for homepage and detail requests to improve reliability on dynamic news homepages.
- Keep the route handler thin. Put reusable behavior under `lib/oxylabs/*`, `lib/scraping/*`, and existing `lib/supabase/queries/*`.
- Generate article slugs from the title plus a short stable hash from the canonical or original URL to avoid collisions.
- Insert fewer good articles rather than accepting weak pages.
- Do not save homepage, listing, category, topic, show, podcast, live, game, product, shopping, corporate, support, newsletter, video-only, or low-quality pages.
- Do not add browser-facing code.
- Do not mutate schema unless TypeScript proves a small type addition is necessary. The current schema already has required article fields and logs.

## Files Likely To Change

- `package.json`
  - Add `cheerio` and `zod`.
- `package-lock.json`
  - Updated by npm install.
- `app/api/scrape/route.ts`
  - New protected POST route.
- `lib/admin/secret.ts` or `lib/security/admin-secret.ts`
  - Small server-only helper to validate `x-sablex-admin-secret` against `process.env.sablex_ADMIN_SECRET`.
- `lib/oxylabs/client.ts`
  - New server-only Oxylabs Realtime client using Basic Auth.
- `lib/oxylabs/types.ts`
  - Typed Oxylabs request/response helpers, without `any`.
- `lib/scraping/types.ts`
  - Shared pipeline, source, candidate, validation, and summary types.
- `lib/scraping/url.ts`
  - URL normalization, same-origin/source checks, candidate URL classification, slug generation.
- `lib/scraping/extract-homepage-links.ts`
  - Homepage visible story link extraction with source strategy support.
- `lib/scraping/extract-article.ts`
  - Article detail extraction, metadata extraction, body cleanup, validation gates.
- `lib/scraping/rejection-rules.ts`
  - Central non-article reject rules and rejection reason constants.
- `lib/scraping/pipeline.ts`
  - Main scrape-to-insert orchestration and run summary logging.
- `lib/supabase/queries/articles.ts`
  - Reuse existing `findExistingArticleUrls` and `insertArticle`; only add narrowly scoped helpers if needed.
- `lib/supabase/queries/logs.ts`
  - Reuse `insertLog`; only add a typed convenience wrapper if useful.

No expected changes to:

- `supabase/schema.sql`
- `supabase/seed.sql`
- `lib/supabase/types.ts`
- UI components or pages
- Clerk files
- Scheduler routes
- AI analysis routes
- `vercel.json`

## Implementation Requirements

- Install:
  ```bash
  npm install cheerio zod
  ```
- Add `POST /api/scrape`.
- Export route segment config for server runtime:
  - `export const runtime = "nodejs";`
  - `export const dynamic = "force-dynamic";`
- Reject missing or invalid admin secret with `401`.
- Read the shared admin secret only from `process.env.sablex_ADMIN_SECRET`.
- Require the secret in the `x-sablex-admin-secret` header.
- Do not accept secrets in query strings or browser code.
- Validate request JSON with Zod:
  - Unknown or malformed body should return `400`.
  - Empty body should be valid and use defaults.
- Source selection:
  - Load selected sources with `getSourcesByIds` and/or `getSourcesByNames` when provided.
  - Otherwise use `getActiveSources`.
  - Return selected source names in the response summary.
  - If no active matching sources are found, return `400` with a clear message.
- Manual scrape pipeline:
  1. Log scrape started.
  2. Log selected source names.
  3. For each source, fetch only the stored `listing_url` homepage via Oxylabs.
  4. Extract candidate article links only from visible story/article card areas.
  5. Normalize URLs and dedupe within the source.
  6. Reject non-article URL patterns before detail scraping.
  7. Apply source-specific URL checks using `parser_strategy`.
  8. Check Supabase for existing original/canonical candidate URLs using chunks of at most 15 URLs.
  9. Scrape only non-duplicate candidate detail pages via Oxylabs.
  10. Extract and validate article title, canonical URL, image URL, published date, and cleaned body text.
  11. Reject pages that fail the article content gate.
  12. Insert only valid articles until `limitPerSource` is reached for that source.
  13. Continue processing other sources if one source fails.
  14. Log source-level and final summary details.
- Oxylabs client:
  - POST to `https://realtime.oxylabs.io/v1/queries`.
  - Use HTTP Basic Auth from `OXY_WSA_USERNAME` and `OXY_WSA_PASSWORD`.
  - Send `Content-Type: application/json`.
  - Use payload `{ source: "universal", url, render: "html", user_agent_type: "desktop_chrome" }`.
  - Validate that `results[0].status_code` is in the 200 range and `results[0].content` is a non-empty string.
  - Surface Oxylabs errors without leaking credentials.
  - Use an `AbortController` timeout so one slow page does not hang the whole route indefinitely.
- Homepage extraction:
  - Use Cheerio.
  - Remove `script`, `style`, `noscript`, hidden/template nodes before extraction.
  - Prefer links inside `main`, `article`, story/card-like containers, and headline-like anchors.
  - Ignore nav/header/footer/menu links.
  - Ignore source homepage URL itself.
  - Ignore anchors with empty text, short generic labels, or obvious UI labels.
  - Reject links matching the non-article reject list before detail scraping.
  - Cap candidate detail scraping per source to a reasonable multiple of `limitPerSource`, such as `limitPerSource * 4`, after filtering and dedupe.
- Source-specific candidate URL checks:
  - `reuters`: prefer URLs containing date paths and IDs such as `/world/.../2026/...` or Reuters article-style paths; reject section roots.
  - `npr`: reject `/sections/`, `/podcasts/`, `/programs/`, `/people/`, `/series/`; prefer story URLs with numeric IDs or date/story structure.
  - `fox_news`: reject `/shows/`, `/live-news/`, `/video/`, `/sports/`, `/lifestyle/food-drink/product`, and similar non-article patterns; prefer long slug paths in news/politics/world/us/opinion/business/health categories when article-like.
  - `bbc`: reject `/sport`, `/weather`, `/news/live`, `/news/topics`, `/news/articles` only when article-like; prefer `/news/articles/...` and other clear article detail patterns.
  - `guardian`: reject section roots like `/us/environment`, `/thefilter-us`, `/tone/`, `/profile/`; prefer date-based article paths such as `/YYYY/mon/DD/...`.
  - Generic fallback should require same host, a meaningful multi-segment path or article ID/date pattern, and no reject pattern.
- Detail extraction:
  - Prefer `link[rel=canonical]` for canonical URL, then Open Graph URL, then final fetched URL.
  - Prefer title from `meta[property="og:title"]`, then `h1`, then `title`, cleaned of site suffixes.
  - Prefer image from `meta[property="og:image"]`, then `twitter:image`, then article image selectors.
  - Prefer published date from `article:published_time`, `datePublished` JSON-LD, `time[datetime]`, and source-specific selectors.
  - Extract body from `article`, `main article`, `[data-testid]` article body containers, or source-specific content containers before falling back.
  - Remove scripts, styles, ad placeholders, newsletter blocks, subscription blocks, related content, most viewed blocks, load more text, social share text, repeated navigation labels, inline JavaScript errors, and CSS class dumps.
  - Split one large paragraph on sentence boundaries or block boundaries when needed.
  - Save body text with double-newline paragraph separation.
- Article content gate:
  - Must have article-specific original URL.
  - Must have article-specific canonical URL.
  - Must have non-generic title.
  - Must have image URL.
  - Must have published date.
  - Must have meaningful body content.
  - Body quality passes with either 3 or more meaningful paragraphs, or at least 900 meaningful characters after cleanup.
  - Reject mostly unrelated headlines, captions, links, sponsor text, bios, navigation, CSS, scripts, or ads.
- Supabase insertion:
  - Insert via service role only.
  - Use append-only behavior.
  - Never delete, reset, or replace articles.
  - Use original URL and canonical URL for dedupe.
  - Do not insert duplicates.
  - Set `analyzed_at` to null on inserted articles.
  - Set `scraped_at` to the current timestamp.
- Logging:
  - Use `console.info`, `console.warn`, and `console.error` for neat server-side progress.
  - Also insert concise rows into `logs` using scope such as `scrape`.
  - Log: scrape started, selected sources, per-source start, homepage fetched, candidate links found, candidates rejected before detail scrape, duplicates skipped, detail pages scraped, articles inserted, articles rejected after validation, source-level errors, scrape completed or failed.
  - Include structured metadata where useful, without storing raw page HTML.
- Summary response:
  - Return JSON with:
    - `status`
    - `sourcesChecked`
    - `selectedSources`
    - `candidatesFound`
    - `candidatesRejected`
    - `duplicatesSkipped`
    - `detailPagesScraped`
    - `articlesInserted`
    - `articlesRejected`
    - `articlesFailed`
    - `totalDurationMs`
    - `rejectionReasons`
    - `sourceSummaries`
  - Use `207` only if the implementation has a clear partial-success convention; otherwise return `200` for completed runs with per-source failures recorded in the summary and `500` for route-level failure.

## Security Requirements

- Never expose `SUPABASE_SERVICE_ROLE_KEY`, Oxylabs credentials, or `sablex_ADMIN_SECRET` to browser code.
- Keep all Oxylabs calls, scraping, parsing, and Supabase inserts in server-only modules.
- Do not accept action secrets in query strings.
- Do not log secrets, auth headers, raw HTML pages, or full article text.
- Do not add public write policies or anon/authenticated access to logs or pipeline tables.
- Preserve existing RLS and grants.
- Avoid importing service-role helpers into client components.
- Do not use Supabase joined-table filters such as `.eq("foreignTable.column", value)`.

## Acceptance Criteria

- `POST /api/scrape` exists and is the only new public API route for this pass.
- `GET /api/scrape` is not implemented.
- Missing or invalid `x-sablex-admin-secret` returns `401`.
- Empty POST body runs all active sources with `limitPerSource = 5`.
- Request body can select sources by ids and/or names and can set `limitPerSource`.
- The route fetches homepage HTML from Oxylabs using each source's stored `listing_url`.
- The route does not invent or hardcode source homepage URLs.
- The route extracts article candidates from homepage story/card content, not every link on the page.
- The route rejects non-article candidates before detail scraping.
- URL existence checks never pass more than 15 URLs to one `.in()` filter.
- The route detail-scrapes only non-duplicate candidate article URLs.
- The route inserts only articles with title, image URL, published date, canonical URL, original URL, and meaningful cleaned body text.
- Invalid pages are rejected with reason counts.
- Scraping is append-only and never deletes or resets articles.
- Duplicate article URLs are skipped, not inserted.
- The final API response includes the required summary object.
- Server terminal logs show meaningful progress through the scrape.
- New code is TypeScript without `any`.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run `npm run build` because this pass adds App Router API route code and server modules.

## Manual Test Steps Expected After Implementation

1. Confirm `.env.local` has:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   OXY_WSA_USERNAME=...
   OXY_WSA_PASSWORD=...
   sablex_ADMIN_SECRET=...
   ```
2. Ensure `supabase/schema.sql` and `supabase/seed.sql` have been run in Supabase SQL Editor.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Watch the terminal running the Next.js dev server for scrape progress logs.
5. Test missing secret returns `401`:
   ```bash
   curl -i -X POST http://localhost:3000/api/scrape \
     -H 'Content-Type: application/json' \
     -d '{}'
   ```
6. Test one selected source with a low limit:
   ```bash
   curl -s -X POST http://localhost:3000/api/scrape \
     -H 'Content-Type: application/json' \
     -H "x-sablex-admin-secret: $sablex_ADMIN_SECRET" \
     -d '{"sourceNames":["Reuters"],"limitPerSource":1}'
   ```
7. Verify the JSON response includes selected source names, candidates found/rejected, duplicates skipped, detail pages scraped, articles inserted/rejected/failed, duration, and rejection reason counts.
8. Run the same command again and verify existing URLs are skipped rather than duplicated.
9. Test default all-active-source behavior with the default limit:
   ```bash
   curl -s -X POST http://localhost:3000/api/scrape \
     -H 'Content-Type: application/json' \
     -H "x-sablex-admin-secret: $sablex_ADMIN_SECRET" \
     -d '{}'
   ```
10. In Supabase Table Editor or SQL Editor, verify new rows in `articles` have:
    - source reference
    - original URL
    - canonical URL
    - slug
    - title
    - image URL
    - published date
    - cleaned raw text
    - scraped timestamp
    - `analyzed_at` as null
11. Verify no homepage, category, topic, podcast, live, game, shopping, corporate, support, or low-quality pages were saved as articles.
12. Verify new `logs` rows exist with scope `scrape`.
13. Run:
    ```bash
    npm run typecheck
    npm run lint
    npm run build
    ```
