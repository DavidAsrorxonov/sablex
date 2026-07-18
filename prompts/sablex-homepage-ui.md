# sablex Homepage UI Implementation Prompt

## Goal

Implement the sablex homepage from the attached news-feed UI reference.

The reference brand must be translated to `sablex` everywhere. Do not use `biasly` or `skew` in visible UI. The page should look like a production news homepage: top utility bar, main navigation, topic chip rail, `Top News` heading, responsive article-card grid, and dark footer.

## Skills Read

- No project skills were explicitly mentioned by the user.
- Read `AGENTS.md`.
- Read `.agents/skills/supabase/SKILL.md` because homepage cards ultimately represent Supabase-backed article and analysis data, and the UI must not expose service credentials or mutate data.
- Read local Next.js docs required by `AGENTS.md`:
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`

## Existing Code Inspected

- `app/page.tsx`: currently a minimal sablex home placeholder linking to `/design-system`.
- `app/design-system/page.tsx`: existing static design-system/reference page with local component patterns including a bias meter.
- `app/layout.tsx`: root App Router layout with Poppins, sablex metadata, and global body setup.
- `app/globals.css`: Tailwind 4 import, sablex color tokens, focus states, and shadow utilities.
- `package.json`: Next `16.2.10`, React `19.2.4`, Tailwind `4`; no Supabase, Clerk, shadcn/ui, or icon package installed yet.
- `tsconfig.json`: strict TypeScript with `@/*` path alias.
- Existing prompt files:
  - `prompts/sablex-design-system.md`
  - `prompts/design-system-route.md`

## Decisions Or Assumptions

- This is a UI-only implementation because the repository does not yet contain Supabase packages, schema files, article query functions, image allow-list config, or article detail routes.
- Use in-component sample article data to reproduce the attached visual state. This is not app storage and must remain isolated to the homepage UI until the real Supabase read layer exists.
- Do not add dependencies for icons. Use small inline SVG components for menu, globe, chevron, plus, info, and footer social marks.
- Use plain `<img>` for the visual sample card images with stable aspect ratios, because `next/image` remote image usage would require image host configuration that does not exist yet. Use remote image URLs only as non-secret presentational assets; if any remote image fails, preserve layout with a neutral fallback background.
- Keep `/design-system` intact.
- Keep the page as a Server Component. Do not add client-only interactivity.
- Navigation actions such as subscribe, login, edition selector, chip buttons, and info icons can be non-mutating visual controls for this pass.
- Article cards should link to `#` or remain non-navigation cards because article detail routes are not present yet.

## Files Likely To Change

- `app/page.tsx`
  - Replace the placeholder with the homepage UI from the attached reference.
- `components/`
  - Add dedicated homepage UI components instead of keeping all helper components inline in `app/page.tsx`.
  - Use dash-case file names for component files, for example `components/site-header.tsx`, `components/topic-rail.tsx`, `components/news-card.tsx`, `components/bias-meter.tsx`, and `components/site-footer.tsx`.
- `app/globals.css`
  - Add small global tweaks only if needed for the homepage background, scrollbar behavior, or reusable utility classes.

No changes expected to `app/layout.tsx`, `app/design-system/page.tsx`, package files, env files, API routes, Supabase files, Clerk files, scheduler files, or scraping/analysis code.

## Visual Interpretation

- Overall:
  - Dense, editorial news-app layout.
  - Off-white page background with subtle texture-like warmth using existing `#F6F6F6`/white tokens.
  - Poppins typography, compact spacing, no marketing hero.
  - Max-width content around the screenshot proportions, with 3-column cards on desktop.
- Top utility bar:
  - Black/dark bar, 34-36px tall on desktop.
  - Left side: `Browser Extension`, divider, `Theme: Light Dark Auto`.
  - Right side: date text, `Set Location`, globe icon, `International Edition`, chevron.
  - Mobile may hide or compress secondary items to avoid overflow.
- Main nav:
  - White/off-white bar about 72px tall.
  - Menu icon at left.
  - sablex wordmark with small `News` label beneath/near it.
  - Tabs: `Home`, `For You` with red dot, `Local`, `Blindspot`.
  - `Home` active underline.
  - Right actions: black `Subscribe` button, bordered `Login` button.
  - On mobile, keep the brand and primary actions usable; tabs may horizontally scroll or wrap cleanly.
- Topic rail:
  - Horizontal row of pill chips beneath nav with labels like `World Cup`, `IPL`, `Social Media`, `Business & Markets`, `Health & Medicine`, `Soccer`, `Artificial Intelligence`, `Arsenal FC`, `Extreme Weather and Disasters`.
  - Each chip has a plus symbol. The rail should scroll horizontally without page overflow.
- Main content:
  - Section heading `Top News`.
  - Responsive card grid:
    - 3 columns on wide desktop.
    - 2 columns on tablet if room allows.
    - 1 column on mobile.
  - Cards should match the reference: 8px or less radius, thin border, white background, image area on top, info icon over image, compact metadata, bold title, bias meter, and source count.
- Article cards:
  - Include category and region/source metadata.
  - Include title.
  - Include image.
  - Include bias meter percentages using left red `#B42318`, center light gray, right blue `#1D4ED8`.
  - Include source count text.
  - Do not include sentiment/framing explanatory copy beyond the compact meter labels.
- Footer:
  - Dark footer similar to screenshot.
  - sablex News wordmark, tagline, link columns for Company and Help, simple Connect social marks, and copyright.

## Implementation Requirements

- Replace `app/page.tsx` with the homepage UI.
- Create reusable presentational components in a dedicated `components/` folder.
- Follow dash-case file naming for all new component files.
- Keep component logic typed with TypeScript.
- Use semantic landmarks: utility/header/nav/main/section/footer.
- Ensure every visible brand instance says `sablex`.
- Keep all UI work inside the Website layer.
- Do not call Supabase, Oxylabs, OpenAI, Clerk, scheduler, scraping, analysis, or any API route.
- Use the existing design tokens from `app/globals.css` where practical.
- Maintain stable card image dimensions with `aspect-[...]` or equivalent so cards do not jump.
- Ensure bias meter segment labels fit on narrow cards. If needed, shorten `Center` to `C` at the smallest breakpoint or use smaller text.
- Ensure horizontal chip overflow is contained to the rail, not the page.
- Avoid nested cards, decorative orbs, gradients, and marketing landing-page composition.
- Preserve `/design-system`.

## Security Requirements

- Do not expose or introduce secrets.
- Do not add environment variables.
- Do not add browser calls to Supabase service-role APIs, Oxylabs, OpenAI, scraping, analysis, scheduler processing, or any pipeline mutation.
- Do not add API routes.
- Do not add packages.

## Acceptance Criteria

- `/` visually matches the attached homepage direction while using `sablex` branding.
- No visible `biasly` or `skew` text appears on the homepage.
- The first viewport shows the dark utility bar, main nav, chip rail, `Top News`, and top row of article cards on desktop.
- Desktop layout renders a 3-column card grid comparable to the screenshot.
- Tablet layout renders without overlap, preferably 2 columns.
- Mobile layout renders cleanly in 1 column, with nav/chips usable and no page-level horizontal overflow.
- Cards have image areas, metadata, titles, left/center/right meters, info icons, and source counts.
- Footer resembles the attached dark footer and uses sablex branding.
- `/design-system` still renders.
- TypeScript, lint, and production build pass.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run `npm run build` because this changes the primary App Router page and can surface rendering/CSS/font issues.

## Manual Test Steps Expected After Implementation

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open:
   ```text
   http://localhost:3000
   ```
3. Verify the homepage shows `sablex News`, not `biasly` or `skew`.
4. Verify the desktop layout around 1440px has:
   - dark utility bar
   - main nav with active Home tab
   - horizontal topic chip rail
   - `Top News`
   - 3-column article-card grid
   - dark footer
5. Resize to about 768px and verify the grid and nav do not overlap.
6. Resize to about 390px and verify:
   - no page-level horizontal overflow
   - topic chips scroll inside their rail
   - cards are single-column
   - bias labels stay inside the meter
7. Open:
   ```text
   http://localhost:3000/design-system
   ```
8. Verify the design-system route still works.
