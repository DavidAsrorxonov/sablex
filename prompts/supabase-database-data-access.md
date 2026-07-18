# sablex Supabase Database And Data Access Implementation Prompt

## Goal

Implement the initial Supabase database contract and TypeScript data-access layer for sablex.

This pass should create the schema source of truth, a separate seed file for the initial active sources, typed Supabase clients, typed query helpers, and focused access utilities needed by later scraping, scheduler, AI analysis, logs, and website display work.

Also wire the homepage and article detail page to read analyzed article data from Supabase instead of static article fixtures.

Do not implement scraping, Oxylabs Scheduler, AI analysis calls, Clerk auth flows, pgvector embeddings, related-article vector search, or API routes in this pass.

## Skills Read

- Read `AGENTS.md`.
- Read `.agents/skills/supabase/SKILL.md` because the user explicitly requested Supabase.
- Checked current official Supabase documentation requirements from the skill:
  - Supabase changelog / breaking-change search, including the 2026 Data API exposure change.
  - Supabase “Securing your API” guidance: grants and RLS are separate layers; newly created public tables should have explicit grants and RLS.
  - Supabase JavaScript installing/initializing/type support guidance: use `@supabase/supabase-js` v2 and typed `createClient<Database>()`.
- Read local Next.js docs required by `AGENTS.md` for the current App Router:
  - `node_modules/next/dist/docs/01-app/index.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`

## Existing Code Inspected

- `package.json`: Next `16.2.10`, React `19.2.4`; no Supabase dependency exists yet.
- `.env.example`: already contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- `app/page.tsx`: homepage currently renders static fixture articles.
- `app/news/[slug]/page.tsx`: details page currently uses static fixture lookup.
- `components/homepage-data.ts`: static homepage article fixture.
- `components/news-card.tsx`: current card display shape.
- `components/article-detail-data.ts`: static article-detail fixture shape.
- `components/article-detail-page.tsx`: current details display shape.
- `components/article-analysis-panels.tsx`: current analysis panel display shape.
- `prompts/news-details-page-ui.md`: previous UI prompt establishes that static fixtures are temporary until Supabase-backed data exists.

No existing `supabase/` directory, `lib/supabase/` directory, migrations, schema file, generated database types, or Supabase query helpers are present.

## Decisions Or Assumptions

- Use an imperative schema file because the project does not currently have `supabase/schemas/`, `supabase/config.toml`, or a migration history.
- Add `supabase/schema.sql` as the canonical SQL users can run in the Supabase Dashboard SQL Editor for the initial schema.
- Add `supabase/seed.sql` as a separate seed file, kept out of `schema.sql`, inserting the 5 active source examples called out in `AGENTS.md` section 11:
  - Reuters
  - NPR
  - Fox News
  - BBC
  - The Guardian
- Do not add `article_analyses.embedding` yet. `AGENTS.md` says pgvector is section 20 and comes after AI analysis is working.
- Include a practical `articles.slug` column for existing `/news/[slug]` routing and future reader-friendly URLs. This is additive to the required article storage fields.
- Keep source seed data in `supabase/seed.sql`, not application code and not `schema.sql`.
- Use homepage entry pages only for seed `listing_url` values. Do not seed section/category/article URLs:
  - Reuters: `https://www.reuters.com/`
  - NPR: `https://www.npr.org/`
  - Fox News: `https://www.foxnews.com/`
  - BBC: `https://www.bbc.com/news`
  - The Guardian: `https://www.theguardian.com/us`
- Enable RLS on all public tables as defense in depth.
- Grant read-only access to `anon` and `authenticated` for website-display tables where appropriate, while keeping writes server-only through `service_role`.
- Use the service-role client only from server-only modules. Do not expose the service-role key to browser code.
- Provide query helpers that can be used by later UI and pipeline work:
  - public website reads for analyzed articles can use the anon client.
  - pipeline writes, dedupe checks, logs, schedule state, and analysis writes use the service-role client.
- Avoid Supabase joined-table filters like `.eq('foreignTable.column', value)`. Where joined data needs filtering, fetch and filter in JavaScript or query base tables directly.
- Add `@supabase/supabase-js` as the only new dependency.
- Keep the pages as Server Components. Fetch Supabase data in the page layer or server-only query helpers, then pass normalized presentation data into existing components.
- If Supabase environment variables are missing during local development or build, page reads should fail gracefully to an empty news state on the homepage and `notFound()` on article detail pages, rather than leaking secrets or crashing with raw configuration details.

## Files Likely To Change

- `package.json`
  - Add `@supabase/supabase-js`.
- `package-lock.json`
  - Updated by `npm install @supabase/supabase-js`.
- `supabase/schema.sql`
  - New initial schema for:
    - `sources`
    - `articles`
    - `article_analyses`
    - `logs`
    - `oxylabs_schedules`
    - `oxylabs_schedule_runs`
  - Include constraints, indexes, RLS, grants, and timestamp update triggers.
- `supabase/seed.sql`
  - New seed file inserting the 5 active `AGENTS.md` section 11 example sources with homepage `listing_url` values.
- `lib/supabase/types.ts`
  - New hand-maintained database types matching `supabase/schema.sql`.
- `lib/supabase/client.ts`
  - New browser-safe anon client factory using only `NEXT_PUBLIC_*` variables.
- `lib/supabase/server.ts`
  - New server-side anon client and service-role client helpers.
- `lib/supabase/errors.ts`
  - New small helper for converting Supabase errors into thrown `Error` instances with context.
- `lib/supabase/queries/articles.ts`
  - New typed reads and pipeline helpers for articles and analyses.
- `lib/supabase/queries/sources.ts`
  - New typed reads for active sources and optional source selection by id/name.
- `lib/supabase/queries/logs.ts`
  - New typed insert/read helpers for logs.
- `lib/supabase/queries/oxylabs-schedules.ts`
  - New typed helpers for storing and reading Oxylabs schedule rows and run/job status.
- `lib/supabase/normalizers/articles.ts`
  - Optional focused mapping helpers from Supabase joined rows to existing `NewsArticle` and `ArticleDetail` component shapes.
- `lib/supabase/index.ts`
  - Optional barrel export if it stays small and useful.
- `app/page.tsx`
  - Replace static `newsArticles` usage with `getAnalyzedArticles()` and render an empty state when no analyzed articles exist.
- `app/news/[slug]/page.tsx`
  - Replace static fixture lookup and `generateStaticParams()` with Supabase `getArticleBySlug(slug)` runtime lookup.
- `components/homepage-data.ts`
  - Remove article fixtures if no longer used; keep `topicLabels` if the topic rail still needs it.
- `components/article-detail-data.ts`
  - Convert from static fixture storage to shared presentation types only, or remove only if all imports are safely replaced.

No expected changes to API routes, Clerk files, Oxylabs implementation, AI implementation, `vercel.json`, or `.env.example`.

## Implementation Requirements

- Install `@supabase/supabase-js` with npm.
- Create `supabase/schema.sql` with:
  - `public.sources`
    - `id uuid primary key default gen_random_uuid()`
    - `name text not null`
    - `listing_url text not null unique`
    - `parser_strategy text`
    - `active boolean not null default true`
    - `logo_url text`
    - `created_at timestamptz not null default now()`
    - `updated_at timestamptz not null default now()`
  - `public.articles`
    - `id uuid primary key default gen_random_uuid()`
    - `source_id uuid not null references public.sources(id)`
    - `original_url text not null unique`
    - `canonical_url text not null`
    - `slug text not null unique`
    - `title text not null`
    - `image_url text not null`
    - `published_at timestamptz not null`
    - `raw_text text not null`
    - `scraped_at timestamptz not null default now()`
    - `analyzed_at timestamptz`
    - `created_at timestamptz not null default now()`
    - `updated_at timestamptz not null default now()`
  - `public.article_analyses`
    - `id uuid primary key default gen_random_uuid()`
    - `article_id uuid not null unique references public.articles(id) on delete cascade`
    - `summary text not null`
    - `sentiment_score numeric not null`
    - `sentiment_label text not null`
    - `bias_score numeric not null`
    - `bias_label text not null`
    - `left_percentage integer not null`
    - `center_percentage integer not null`
    - `right_percentage integer not null`
    - `confidence numeric not null`
    - `framing_notes text[] not null default '{}'`
    - `loaded_terms text[] not null default '{}'`
    - `disclaimer text not null`
    - `model text not null`
    - `created_at timestamptz not null default now()`
    - `updated_at timestamptz not null default now()`
  - `public.logs`
    - `id uuid primary key default gen_random_uuid()`
    - `level text not null`
    - `scope text not null`
    - `message text not null`
    - `metadata jsonb not null default '{}'::jsonb`
    - `created_at timestamptz not null default now()`
  - `public.oxylabs_schedules`
    - `id uuid primary key default gen_random_uuid()`
    - `source_id uuid not null unique references public.sources(id) on delete cascade`
    - `schedule_id text not null unique`
    - `target_url text not null`
    - `active boolean not null default true`
    - `last_synced_at timestamptz`
    - `created_at timestamptz not null default now()`
    - `updated_at timestamptz not null default now()`
  - `public.oxylabs_schedule_runs`
    - `id uuid primary key default gen_random_uuid()`
    - `schedule_id uuid not null references public.oxylabs_schedules(id) on delete cascade`
    - `oxylabs_run_id text`
    - `oxylabs_job_id text`
    - `result_status text not null`
    - `processed_at timestamptz`
    - `metadata jsonb not null default '{}'::jsonb`
    - `created_at timestamptz not null default now()`
- Add check constraints:
  - sentiment label in `positive`, `neutral`, `negative`
  - bias label in `left`, `center`, `right`, `mixed`, `unclear`
  - percentage values between 0 and 100 and sum to 100
  - sentiment/bias score between -1 and 1
  - confidence between 0 and 1
  - log levels limited to practical values such as `debug`, `info`, `warn`, `error`
- Add useful indexes:
  - active sources
  - articles by source, published date, scraped date, analyzed date
  - article analyses by article and framing/sentiment labels
  - logs by scope/date
  - schedules by source and exact Oxylabs `schedule_id`
  - schedule runs by schedule/status/date
- Use text for Oxylabs external IDs to preserve large 64-bit integer precision.
- Add an `updated_at` trigger function and attach it to mutable tables.
- Enable RLS on every public table.
- Explicitly grant:
  - `select` on `sources`, analyzed `articles`, and `article_analyses` to `anon` and `authenticated` as needed for website display.
  - no public writes.
  - full table access to `service_role`.
- Add RLS policies:
  - public read active sources.
  - public read articles only when `analyzed_at is not null`.
  - public read analyses only when the related article is analyzed.
  - service-role policies for all reads/writes needed by backend pipeline code.
  - logs and Oxylabs schedule tables should not be publicly readable unless there is a specific website/admin UI requirement in a later prompt.
- Create `supabase/seed.sql` that:
  - inserts the 5 active source rows from `AGENTS.md` section 11 examples.
  - uses `on conflict (listing_url) do update` so re-running the seed is idempotent.
  - sets `active = true`.
  - stores parser strategies such as `reuters`, `npr`, `fox_news`, `bbc`, and `guardian` so later scraping can use source-specific behavior.
  - does not insert articles, analyses, logs, schedules, or scheduler runs.
- Implement TypeScript types in `lib/supabase/types.ts` without `any`.
- Implement client helpers:
  - browser/client anon client using public env vars.
  - server anon client using public env vars and auth persistence disabled.
  - service-role client using `SUPABASE_SERVICE_ROLE_KEY`, with auth persistence disabled, in server-only code.
  - clear runtime errors for missing env vars.
- Implement article query helpers:
  - `getAnalyzedArticles()` for homepage cards, joined with source and analysis data.
  - `getArticleBySlug(slug)` for details pages, joined with source and analysis data.
  - `findExistingArticleUrls(urls)` chunking `.in()` calls to at most 15 URLs.
  - `insertArticle(input)` for validated scraper output.
  - `getPendingAnalysisArticles(limit?)` using a LEFT JOIN style relationship to detect articles with no `article_analyses` row, not `analyzed_at` alone.
  - `saveArticleAnalysis(input)` that inserts a valid analysis and marks `articles.analyzed_at` only after the analysis insert succeeds.
  - normalized return types for website reads so UI components do not need to understand Supabase join shapes.
- Implement source query helpers:
  - `getActiveSources()`
  - `getSourcesByNames(names)`
  - `getSourcesByIds(ids)`
- Implement log helpers:
  - `insertLog(input)`
  - `getRecentLogs(limit?)`
- Implement Oxylabs schedule helpers:
  - `listOxylabsSchedules()`
  - `upsertOxylabsSchedule(input)`
  - `recordOxylabsScheduleRun(input)`
  - `markOxylabsScheduleRunProcessed(id)`
- Keep route handlers thin in future by placing Supabase behavior in `lib/supabase/queries/*`.
- Wire the homepage:
  - make `app/page.tsx` an async Server Component.
  - call `getAnalyzedArticles()`.
  - render `NewsCard` for returned rows.
  - show a minimal empty state when there are no analyzed articles yet.
  - keep `TopicRail`, `SiteHeader`, and `SiteFooter`.
- Wire the news details route:
  - keep `params` as a promise per Next.js 16 docs.
  - call `getArticleBySlug(slug)`.
  - call `notFound()` when no analyzed article is returned.
  - remove static `generateStaticParams()` because the available slugs are now database-driven.
  - preserve the existing article detail visual layout as much as possible.
- For fields not yet present in the database:
  - use source name as the byline/source display where needed.
  - derive read time from `raw_text` length.
  - split `raw_text` into paragraphs for the details body.
  - map analysis `summary` to the summary panel as one or more display bullets without inventing facts.
  - map `left_percentage`, `center_percentage`, and `right_percentage` to the existing bias meter.
  - display AI framing labels as AI-estimated framing, not objective truth.
- Do not run live SQL against Supabase from this environment unless credentials and an approved connector/CLI flow are explicitly available. Provide SQL Editor instructions instead.

## Security Requirements

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may be used in browser-safe code.
- Use RLS on all public tables.
- Use explicit grants because Supabase Data API exposure defaults have changed and can vary by project.
- No public insert/update/delete policies.
- No `SECURITY DEFINER` functions unless absolutely necessary. The initial schema should not need any.
- Do not use Supabase Auth. sablex uses Clerk for authentication.
- Do not store Oxylabs, OpenAI, admin, or cron secrets in the database schema or browser code.
- Do not use joined-table `.eq('foreignTable.column', value)` filters in supabase-js.
- Do not expose raw service-role errors or missing secret values in rendered browser UI.

## Acceptance Criteria

- `@supabase/supabase-js` is installed and locked.
- `supabase/schema.sql` defines all initial core tables required by `AGENTS.md`, without the pgvector embedding column.
- `supabase/seed.sql` inserts the 5 active section 11 example sources with idempotent upserts and homepage `listing_url` values.
- `supabase/schema.sql` includes constraints, indexes, RLS enablement, public read policies where appropriate, no public write policies, and service-role access.
- `lib/supabase/types.ts` matches the schema and exports useful table/insert/update aliases.
- Supabase clients are separated into browser-safe and server-only helpers.
- Service-role access is only reachable from server-only modules.
- Query helpers exist for articles, sources, logs, and Oxylabs schedule persistence.
- URL dedupe helper chunks `.in()` filters at 15 URLs or fewer.
- Pending-analysis helper detects missing `article_analyses` rows and does not rely on `articles.analyzed_at is null` alone.
- `saveArticleAnalysis` only marks `analyzed_at` after a valid analysis row is saved.
- Homepage reads analyzed articles from Supabase and renders existing `NewsCard` UI.
- Article detail route reads the requested analyzed article from Supabase and renders existing detail UI, or `notFound()` for missing slugs.
- Static article fixtures are no longer the source of truth for homepage/details article content.
- No scraping, analysis API, scheduler API, cron route, Clerk work, or pgvector work is included in this pass.
- TypeScript, lint, and build pass.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run `npm run build` because this changes App Router pages and server-rendered data access.

## Manual Test Steps Expected After Implementation

1. In Supabase Dashboard, open SQL Editor and run the full contents of `supabase/schema.sql`.
2. In Supabase Dashboard, run the full contents of `supabase/seed.sql`.
3. Confirm the tables exist:
   - `sources`
   - `articles`
   - `article_analyses`
   - `logs`
   - `oxylabs_schedules`
   - `oxylabs_schedule_runs`
4. Confirm RLS is enabled for each table in Database > Policies.
5. Confirm these seeded active sources exist in `sources`:
   - Reuters
   - NPR
   - Fox News
   - BBC
   - The Guardian
6. Insert test data through SQL Editor using one seeded source, one analyzed article, and one article analysis row.
7. Start the dev server:
   ```bash
   npm run dev
   ```
8. Visit `/` and confirm the analyzed test article appears as a news card.
9. Visit `/news/<test-slug>` and confirm the article detail page renders Supabase-backed content.
10. In a temporary server-side script or future route, call:
   - `getActiveSources()`
   - `getAnalyzedArticles()`
   - `getArticleBySlug("<test-slug>")`
   - `findExistingArticleUrls(["<test-original-url>"])`
11. Watch for clean results and no missing environment variable errors after `.env.local` has the Supabase URL, anon key, and service-role key configured.
