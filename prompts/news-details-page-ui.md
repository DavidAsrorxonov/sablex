# sablex News Details Page UI Implementation Prompt

## Goal

Implement a news details page matching the attached UI reference, translated to the existing `sablex News` brand.

The page should render a polished article-detail experience with the full article body, AI-estimated bias/framing analysis, AI summary, source breakdown, related stories, newsletter signup band, shared header, and shared footer.

## Skills Read

- No project skills were explicitly mentioned by the user.
- Read `AGENTS.md`.
- Read `.agents/skills/supabase/SKILL.md` because the details page ultimately represents Supabase-backed article and analysis data, and the Website layer must not expose service credentials or mutate pipeline state.
- Read local Next.js docs required by `AGENTS.md`:
  - `node_modules/next/dist/docs/01-app/index.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md`

## Existing Code Inspected

- `app/page.tsx`: current homepage renders static news cards through shared header, topic rail, and footer components.
- `app/layout.tsx`: root App Router layout with Poppins and global metadata.
- `app/globals.css`: Tailwind 4 import, sablex colors, focus states, shadow helpers, scrollbar helper.
- `app/design-system/page.tsx`: design-system/reference route with local bias meter, tokens, icons, and UI examples.
- `components/homepage-data.ts`: static homepage article fixtures.
- `components/news-card.tsx`: card component with image, metadata, title, bias meter, and source count.
- `components/bias-meter.tsx`: compact red/gray/blue bias distribution meter.
- `components/homepage-icons.tsx`: inline SVG icon helpers.
- `components/site-header.tsx`: shared top utility bar and main nav.
- `components/topic-rail.tsx`: homepage-only topic chip rail.
- `components/site-footer.tsx`: shared dark footer.
- `package.json`: Next `16.2.10`, React `19.2.4`, Tailwind `4`; no Supabase, Clerk, shadcn/ui, lucide, or image packages installed yet.
- `next.config.ts`: no remote image configuration.
- Existing prompt files:
  - `prompts/design-system-route.md`
  - `prompts/sablex-design-system.md`
  - `prompts/sablex-homepage-ui.md`

## Decisions Or Assumptions

- Implement this as a UI route first because the repo does not yet contain Supabase dependencies, schema files, generated types, query functions, article analysis API, or related-article vector queries.
- Use a static article-detail fixture shaped like the future Supabase data model. This is temporary UI sample data, not local app storage for the production data layer.
- Add a dynamic App Router route at `app/news/[slug]/page.tsx` so the route shape can later be backed by Supabase article IDs or slugs.
- Provide one supported slug for this pass: `trump-sends-iran-revised-peace-proposal`.
- Use `notFound()` for unsupported slugs.
- Update the homepage card for the matching article so it links to the details route with `next/link`.
- Keep the page as a Server Component. Do not add client-only state or interactive mutation.
- Reuse shared `SiteHeader` and `SiteFooter`; do not show `TopicRail` on the details page because the attached details UI uses only the top utility and main nav before the article.
- Do not install lucide or shadcn/ui for this pass. Extend existing inline SVG icons only as needed.
- Use CSS background images or plain HTML image-like blocks consistent with the current homepage pattern; avoid `next/image` because remote image configuration is not currently set up.
- Use `sablex` branding everywhere. Do not render `biasly`.

## Files Likely To Change

- `app/news/[slug]/page.tsx`
  - New dynamic route for the article details page.
- `components/article-detail-data.ts`
  - New typed static fixture for the article detail, sidebar analysis, source breakdown, and related stories.
- `components/article-detail-page.tsx`
  - New presentational layout component for the details page.
- `components/article-analysis-panels.tsx`
  - New presentational sidebar panels for bias analysis, AI summary, and source breakdown.
- `components/article-actions.tsx`
  - New small presentational action row for Save, Share, and more controls if useful.
- `components/homepage-icons.tsx`
  - Add small inline SVG icons needed by the article page, such as bookmark, share, more, mail, and external/source icons.
- `components/news-card.tsx`
  - Add optional `href` support and wrap cards in `next/link` when present.
- `components/homepage-data.ts`
  - Add a slug or `href` to the first article fixture.

No changes expected to Supabase files, API routes, Clerk files, Oxylabs files, scheduler files, `.env*`, package files, or `next.config.ts`.

## Visual Interpretation

- Overall:
  - Editorial, information-dense article page.
  - Off-white `#F7F7F4` background, white panels, thin `#D5D7DB`/`#C9CCD1` borders, compact radius no larger than 8px.
  - Poppins typography, black primary text, muted gray metadata, red left bias, gray center, blue right bias.
  - The page should feel like an operational news reading tool, not a marketing page.
- Header:
  - Reuse the existing top utility bar and main navigation.
  - Keep `Home`, `For You`, `Local`, `Blindspot`, `Subscribe`, and `Login` visually consistent with the homepage.
- Main article layout:
  - Desktop: centered max-width around the existing `1460px`, two-column grid.
  - Main column should be wider, roughly two thirds of the content width.
  - Sidebar should be narrower and sticky-like in visual weight, but does not need CSS sticky behavior.
  - Mobile/tablet: stack article content before analysis panels with no overlap or horizontal overflow.
- Article header:
  - Metadata line: category and region, e.g. `Politics - United States`.
  - Large H1 matching the attached scale, around 38-44px desktop and 30-34px mobile.
  - Byline/date/read-time row plus compact icon actions.
- Lead image:
  - Large stable image block with about 16:8 to 16:9 aspect ratio, 6-8px radius, and object-cover behavior.
  - Caption and photo credit beneath in small muted type.
- Inline bias distribution:
  - Bordered white panel below the image.
  - Label row with info icon.
  - Horizontal segmented meter: `Left 20%`, `Center 31%`, `Right 49%`.
  - `12 sources` beneath.
- Article body:
  - Comfortable reading measure with 17-18px body text, approximately 1.65 line height.
  - Paragraphs should match the attached sample story content closely enough to test layout.
- Sidebar panels:
  - `Bias Analysis` panel:
    - Title and info icon.
    - `Overall Bias`, prominent `Right 49%`, and supporting line `Based on 12 balanced sources`.
    - Three rows for Left, Center, Right with percentages and small horizontal bars.
    - Brief methodology copy and an outlined `How We Analyze Bias` button.
  - `AI Summary` panel:
    - Title and info icon.
    - Generated date/read-time metadata.
    - Bullet list summary.
    - AI disclaimer and `Provide Feedback` outlined button.
  - `Source Breakdown` panel:
    - Total source count.
    - Left/Center/Right counts and percentages with bars.
    - Top source list and bias labels.
    - `View All Sources` outlined button.
- Related stories:
  - Section after article body, separated by a divider.
  - Two-column grid on desktop, one-column on mobile.
  - Small thumbnails, category/region metadata, bold compact titles, and date/read-time metadata.
- Newsletter band:
  - Full-width bordered white band above footer.
  - Text on the left: `Stay Informed. Stay Balanced.`
  - Email input and black Subscribe button on the right.
  - Stack cleanly on mobile.
- Footer:
  - Reuse existing dark `SiteFooter`.

## Layout, Typography, Spacing, Colors, Responsiveness

- Use existing tokens where possible:
  - Background: `#F7F7F4`
  - Text: `#0D0D0F`
  - Muted text: `#5C6169`, `#6B7280`
  - Borders: `#D5D7DB`, `#C9CCD1`
  - Left: `#B42318`
  - Right: `#174EA6` or existing `#1D4ED8`
  - Center: `#F1F1EF`/`#E5E7EB`
- Keep cards/panels at 8px radius or less.
- Do not put cards inside cards. Sidebar panels are individual panels; inner rows and meters are unframed.
- Ensure buttons have fixed, stable heights.
- Ensure all text fits on mobile; no negative letter spacing and no viewport-width font scaling.
- Ensure tables/source rows do not overflow at 390px viewport width.
- Avoid decorative gradient orbs, bokeh, and marketing hero layout.

## Implementation Requirements

- Create `app/news/[slug]/page.tsx` with an async Server Component page that awaits `params` per Next.js 16 App Router docs.
- Use `notFound()` for unknown slugs.
- Keep all UI work in the Website layer.
- Do not add scraping, analysis, scheduler, API routes, or data mutation behavior.
- Keep future Supabase mapping clear through typed fixture fields:
  - article title
  - category
  - region
  - source/byline
  - image URL
  - published date
  - read time
  - body paragraphs
  - summary
  - sentiment/framing fields where visible
  - left/center/right percentages
  - confidence if shown
  - source breakdown
  - related stories
- Show political framing as analysis/framing, not objective truth.
- Use semantic HTML:
  - `article` for the main article
  - `aside` for analysis panels
  - `section` for related stories and newsletter
  - real headings in order
- Use accessible labels for icon-only buttons.
- Add optional `href` to `NewsArticle`/`NewsCard` and use `next/link` so the homepage can navigate to the details route.
- Preserve existing homepage and design-system routes.

## Security Requirements

- Do not expose or introduce secrets.
- Do not add environment variables.
- Do not add browser calls to Supabase service-role APIs, Oxylabs, OpenAI, scraping, analysis, scheduler processing, or any pipeline mutation.
- Do not add API routes.
- Do not add packages.
- Do not put admin or cron secrets in browser code, query strings, or static fixture data.

## Acceptance Criteria

- `/news/trump-sends-iran-revised-peace-proposal` renders a news details page matching the attached UI structure.
- The page uses `sablex News` branding and does not render `biasly`.
- The page includes:
  - shared header
  - article metadata
  - H1 headline
  - byline/date/read-time/action row
  - lead image with caption
  - bias distribution panel
  - full article body
  - related stories
  - newsletter band
  - right-side `Bias Analysis`, `AI Summary`, and `Source Breakdown` panels on desktop
  - shared footer
- The first homepage article links to the new details route.
- Desktop layout is two-column and visually close to the reference.
- Mobile layout stacks cleanly without text overlap or page-level horizontal overflow.
- `/` still renders the homepage.
- `/design-system` still renders.
- TypeScript, lint, and production build pass.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run `npm run build` because this adds an App Router route and changes shared components.

## Manual Test Steps Expected After Implementation

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open:
   ```text
   http://localhost:3000/news/trump-sends-iran-revised-peace-proposal
   ```
3. Verify the article page visually matches the attached reference:
   - article content is on the left
   - analysis panels are on the right on desktop
   - bias distribution colors and percentages are visible
   - related stories and newsletter band appear before the footer
4. Open:
   ```text
   http://localhost:3000
   ```
5. Click the first article card and verify it navigates to:
   ```text
   /news/trump-sends-iran-revised-peace-proposal
   ```
6. Resize to about 768px and verify the layout stacks or compresses without overlap.
7. Resize to about 390px and verify:
   - no page-level horizontal overflow
   - sidebar panels stack below article content
   - all buttons, source rows, and meter labels fit inside their containers
8. Open:
   ```text
   http://localhost:3000/design-system
   ```
9. Verify the design-system route still works.
