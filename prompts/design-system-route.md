# Dedicated Design System Route Prompt

## Goal

Move the current sablex design-system/reference board off the home page and onto a dedicated App Router route at `/design-system`.

The home page should stop being the design-system board. It should become a minimal app-facing sablex home placeholder that can later be replaced with real news cards when Supabase-backed data exists.

## Skills Read

- No project skills were explicitly mentioned by the user.
- Read `AGENTS.md`.
- Read local Next.js docs:
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`

## Existing Code Inspected

- `app/page.tsx`: currently contains the full sablex design-system board.
- `app/layout.tsx`: contains global Poppins font setup and sablex metadata.
- `app/globals.css`: contains shared sablex design tokens, font, focus states, and shadow helpers.
- `app/`: currently has no nested routes.

## Decisions Or Assumptions

- Keep shared design tokens and Poppins setup global because the rest of the app should use the same design system.
- Move the existing design-system UI exactly into `app/design-system/page.tsx`.
- Replace `app/page.tsx` with a restrained production-app placeholder for sablex News, not a marketing landing page.
- Do not add navigation, data fetching, auth, API routes, or database behavior in this change.
- Do not add dependencies.

## Files Likely To Change

- `app/design-system/page.tsx`
  - New route containing the current design-system board.
- `app/page.tsx`
  - Replace board with minimal home page placeholder.

No changes expected to `app/layout.tsx`, `app/globals.css`, package files, env files, API routes, Supabase files, or scheduler files.

## Implementation Requirements

- Create `app/design-system/page.tsx`.
- Move the design-system component code from `app/page.tsx` to the new route.
- Keep `/design-system` static and server-rendered.
- Update `app/page.tsx` to a minimal sablex home screen:
  - brand name `sablex News`
  - tagline `Balanced news coverage, powered by AI.`
  - short empty-state copy indicating analyzed articles will appear there
  - a simple link to `/design-system` for the reference board
- Ensure the home page does not scrape, analyze, mutate pipeline state, or call any external service.
- Ensure no visible `biasly` text exists in app routes.

## Security Requirements

- Do not expose or introduce secrets.
- Do not add browser calls to Oxylabs, OpenAI, Supabase service-role APIs, scraping, analysis, scheduler processing, or any pipeline mutation.
- Do not add env variables.
- Do not add API routes.

## Acceptance Criteria

- `/design-system` renders the full design-system board from the UI reference.
- `/` renders a minimal sablex home page instead of the design-system board.
- Global Poppins font and design tokens remain active.
- No visible `biasly` text appears in `app/`.
- TypeScript, lint, and production build pass.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Manual Test Steps Expected After Implementation

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open:
   ```text
   http://localhost:3000
   ```
3. Verify the home page is a minimal sablex News page and not the design-system board.
4. Open:
   ```text
   http://localhost:3000/design-system
   ```
5. Verify the full design-system board is present there.
6. At mobile width around 390px, verify both pages avoid horizontal overflow and text overlap.
