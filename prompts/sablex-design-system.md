# sablex Design System Implementation Prompt

## Goal

Implement the app design system from the attached UI reference, replacing the reference brand name `biasly` with `sablex`.

The first implementation should turn the current starter home page into a polished design-system/reference screen for sablex that establishes reusable visual tokens and component patterns for the production news app: brand, typography, colors, buttons, chips, bias meter, article card, icons, spacing, grid, shadows, border radius, and footer.

## Skills Read

- No project skills were explicitly mentioned by the user.
- Read `AGENTS.md`.
- Read local Next.js docs because `AGENTS.md` requires it for this Next version:
  - `node_modules/next/dist/docs/index.md`
  - `node_modules/next/dist/docs/01-app/index.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`

## Existing Code Inspected

- `app/page.tsx`: currently returns only `<div>Home</div>`.
- `app/layout.tsx`: root App Router layout using `Geist` and `Geist_Mono`, default generated metadata.
- `app/globals.css`: imports Tailwind 4 and defines basic background/foreground CSS variables.
- `package.json`: Next `16.2.10`, React `19.2.4`, Tailwind `4`, no shadcn/ui or icon package currently installed.
- `tsconfig.json`: strict TypeScript, `@/*` path alias.

## Decisions And Assumptions

- Use `Poppins` through `next/font/google` to match the reference typography.
- Keep implementation dependency-free for the first pass because no icon package is installed. Use simple CSS/inline text glyphs or minimal inline SVG only where necessary for the reference screen. Do not add shadcn/ui or lucide unless the user approves dependency installation separately.
- Implement this as a static design-system/reference page for now, because the project has no data, Supabase queries, card components, or article routes yet.
- Use the product name `sablex` everywhere visible. Do not leave any visible `biasly` text.
- Keep UI-only work inside the Website layer. Do not add scraping, analysis, database, auth, scheduler, or API behavior.
- Keep the design neutral and news-oriented: white/off-white surfaces, black text, cool gray secondary text, red/blue political framing accents, compact cards, and operational density.

## Files Likely To Change

- `app/layout.tsx`
  - Replace Geist with Poppins.
  - Update metadata title and description for sablex.
- `app/globals.css`
  - Add design tokens for colors, typography, shadows, radii, base body styles, selection/focus states, and reusable low-level utilities if needed.
- `app/page.tsx`
  - Replace starter home page with the design-system UI reference translated to sablex.

No database, API, env, package, or config changes are expected.

## Visual Interpretation

Reference values to translate:

- Brand:
  - Name: `sablex`
  - Supporting label: `News`
  - Tagline: `Balanced news coverage, powered by AI.`
  - Typography: large bold lowercase wordmark, compact `News` under or near the final letters.
- Font:
  - Family: Poppins.
  - H1: 32px, bold, line-height 1.2.
  - H2: 24px, semibold, line-height 1.3.
  - H3: 20px, semibold, line-height 1.3.
  - H4: 16px, medium, line-height 1.4.
  - Body large: 16px regular, line-height 1.6.
  - Body medium: 14px regular, line-height 1.6.
  - Body small: 13px regular, line-height 1.6.
  - Caption: 11px regular, line-height 1.4.
- Colors:
  - Text primary: `#0D0D0F`
  - Text secondary: `#6B7280`
  - Surface: `#F6F6F6`
  - Left bias: `#B42318`
  - Center: `#E5E7EB`
  - Right bias: `#1D4ED8`
  - Background primary: `#FFFFFF`
  - Background secondary: `#F0F0F0`
  - Border/divider: `#E5E7EB`
- Spacing:
  - 4px base unit with visible scale: 4, 8, 16, 24, 32, 40, 64.
- Radius:
  - Small 4px, medium 8px, large 12px, full 9999px.
- Shadows:
  - Small: `0px 1px 2px rgba(0,0,0,0.05)`
  - Medium: `0px 4px 12px rgba(0,0,0,0.08)`
  - Large: `0px 12px 24px rgba(0,0,0,0.12)`
- Layout:
  - Dense, responsive dashboard/reference layout.
  - Cards should use thin gray borders, 8px to 12px radius depending on scale, white/off-white backgrounds, and subtle shadows.
  - Avoid decorative gradients, marketing hero layout, nested cards, and oversized visual padding.
  - On desktop, use a multi-column grid similar to the reference. On mobile, stack sections cleanly with no text overlap.

## Implementation Requirements

- Build a polished design-system page in `app/page.tsx`.
- Use semantic HTML sections and headings.
- Represent the following panels:
  - Brand
  - Colors
  - Typography
  - UI Elements
  - Icons
  - Article card example
  - Spacing system
  - Grid system
  - Shadows
  - Border radius
  - Footer
- Include a reusable-looking `BiasMeter` component/function inside `app/page.tsx` or a small local component if useful.
- Include a reusable-looking news card example containing:
  - category/source metadata
  - title
  - short summary
  - image placeholder or CSS-framed image area
  - bias meter percentages
  - time/read metadata
- Ensure every visible brand instance says `sablex`, not `biasly`.
- Use Tailwind 4 utilities and/or CSS variables from `app/globals.css`.
- Preserve server-rendered static page behavior; do not add client-only interactivity unless necessary.
- Update page metadata to sablex.
- Do not use external runtime image URLs or network-only assets. If an image is needed, use a CSS placeholder or existing local assets.
- Keep text readable and restrained. Do not add explanatory onboarding copy beyond labels visible in the reference.

## Security Requirements

- Do not expose or introduce any secrets.
- Do not add browser code that calls Oxylabs, OpenAI, Supabase service-role APIs, scraping, analysis, scheduler processing, or other pipeline mutations.
- Do not add environment variables.
- Do not add API routes.

## Acceptance Criteria

- `/` renders a responsive sablex design-system/reference page matching the attached visual direction.
- Poppins is the active app font.
- Brand panel and footer use `sablex News` and the provided tagline.
- Colors, typography, buttons, chips, bias meter, article card, icons, spacing, grid, shadows, and border-radius panels are present.
- The design uses the specified color palette, spacing scale, shadows, and radius scale.
- Desktop layout resembles the reference’s dense design-system board.
- Mobile layout stacks without overflow or overlapping text.
- No visible `biasly` text remains.
- TypeScript and ESLint checks pass.

## Checks To Run

- `npm run typecheck`
  - Note: if this script is missing, report that `package.json` does not currently define it.
- `npm run lint`
- `npm run build`
  - Run because this changes root layout, font loading, global CSS, and the main page.

## Manual Test Steps Expected After Implementation

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open:
   ```text
   http://localhost:3000
   ```
3. Verify the page title/metadata is sablex-oriented.
4. Verify the first viewport clearly shows `sablex News`, not `biasly`.
5. Inspect desktop width around 1440px:
   - multi-column design board is balanced
   - card borders and shadows are subtle
   - bias meter labels and percentages align correctly
6. Inspect mobile width around 390px:
   - panels stack cleanly
   - no horizontal overflow
   - no overlapping labels, buttons, meters, or footer text
7. Search rendered source or DOM text for `biasly`; it should not appear.
