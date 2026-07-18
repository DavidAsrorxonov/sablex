# Clerk Authentication

## Goal

Add Clerk authentication to the existing sablex Next.js App Router application with minimal, production-style integration:

- install and configure `@clerk/nextjs`
- add `ClerkProvider` globally in the root layout
- add Clerk request proxy support for Next.js 16 using `proxy.ts`
- replace placeholder header auth links with Clerk sign-in, sign-up, and user account UI
- document required Clerk environment variables in `.env.example`

Reading news should remain public. This task should not add Supabase Auth, database user tables, paid subscriptions, organizations, or protected dashboards.

## Skills Read

- `AGENTS.md`
- `.agents/skills/clerk/SKILL.md`
- `.agents/skills/clerk-setup/SKILL.md`
- `.agents/skills/clerk-nextjs-patterns/SKILL.md`
- `.agents/skills/clerk-nextjs-patterns/references/middleware-strategies.md`
- `.agents/skills/clerk-nextjs-patterns/references/server-vs-client.md`

## Supporting Docs Read

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
- Clerk official Next.js quickstart, current as of July 16, 2026
- Clerk official `clerkMiddleware()` reference

## Existing Code Inspected

- `package.json`
- `tsconfig.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `app/globals.css`
- `components/site-header.tsx`
- project search for existing Clerk/auth/proxy/middleware/env usage

## Decisions And Assumptions

- Use the current Clerk SDK pattern because the project has no existing Clerk SDK installed.
- Use `proxy.ts`, not `middleware.ts`, because this project uses Next.js `16.2.10`.
- Keep a public-first auth model. The home page, news detail pages, static assets, and reading experience remain public.
- Add Clerk middleware/proxy so auth state is available and API routes can later perform resource-level auth checks.
- Do not protect pipeline/admin API routes with Clerk in this task because project rules require `x-sablex-admin-secret` for action routes and `CRON_SECRET` for cron routes.
- Keep the existing sablex header design and replace placeholder buttons with Clerk components rather than redesigning the page.
- Create `.env.example` because it is referenced as the canonical environment list but is currently missing.

## Files Likely To Change

- `package.json`
- `package-lock.json`
- `app/layout.tsx`
- `components/site-header.tsx`
- `proxy.ts`
- `.env.example`

## Implementation Requirements

- Install `@clerk/nextjs` with npm.
- Import `ClerkProvider` from `@clerk/nextjs` in `app/layout.tsx`.
- Place `ClerkProvider` inside `<body>`, wrapping the app children.
- Add a root-level `proxy.ts` that exports `clerkMiddleware()` from `@clerk/nextjs/server`.
- Use the Clerk/Next matcher for Next.js 16:
  - skip Next.js internals and static files
  - include API routes
  - include Clerk frontend API routes under `/__clerk/(.*)`
- Update `components/site-header.tsx` to use Clerk auth UI:
  - signed-out users see sign-in and sign-up actions
  - signed-in users see `UserButton`
  - keep sizing, typography, and visual style aligned to current header buttons
- Prefer Clerk prebuilt components over custom auth forms.
- Do not add new pages unless Clerk requires them. Account Portal sign-in/sign-up is acceptable through `SignInButton` and `SignUpButton`.
- Keep server/client boundaries clean. Only import Clerk client components from `@clerk/nextjs` in UI components that render them.

## Security Requirements

- `CLERK_SECRET_KEY` must remain server-only and must never be imported into client code.
- Only `NEXT_PUBLIC_CLERK_*` values may be exposed to browser code.
- Do not add actual secret values to `.env.example`.
- Do not add `CRON_SECRET` to `.env.local`.
- Do not change existing admin-secret rules for future scraping, analysis, scheduler, or cron endpoints.
- Do not introduce Supabase Auth.

## Visual Requirements

- Preserve the existing two-row header structure.
- Keep the black primary action style for sign-up.
- Keep the secondary bordered style for sign-in.
- Signed-in account UI should fit in the existing right-side action area without shifting the layout.
- Mobile header controls must remain within the available width and not overlap the logo or nav.
- Do not add marketing copy or instructional text to the UI.

## Acceptance Criteria

- Project has `@clerk/nextjs` installed.
- App renders with `ClerkProvider` wrapping all pages.
- `proxy.ts` compiles and uses the Next.js 16 file convention.
- Header shows sign-in/sign-up controls when signed out.
- Header shows the Clerk user menu when signed in.
- Public news pages remain reachable when signed out.
- `.env.example` documents Clerk variables and remains aligned with `AGENTS.md`.
- TypeScript, lint, and production build checks pass or any failures are reported exactly.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Manual Test Steps

1. Add Clerk development keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `CLERK_SECRET_KEY=sk_test_...`
2. Optionally add:
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`
3. Run `npm run dev`.
4. Open `http://localhost:3000`.
5. Confirm the home page loads while signed out.
6. Click the sign-in action and complete Clerk sign-in.
7. Confirm the header switches to the Clerk user menu.
8. Open a news detail route and confirm it remains readable.
9. Sign out from the user menu and confirm the signed-out actions return.
