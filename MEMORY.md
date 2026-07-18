# Project Memory

## Supabase Data Layer

- Future pipeline tasks should use server-only Supabase access through the service-role client. Do not put pipeline reads or writes in browser/client code.
- Keep pipeline tables locked down with RLS enabled and no public anon/authenticated policies unless a later approved UI requirement explicitly needs public reads.
- Store external provider IDs as text, not JavaScript numbers. This is required for Oxylabs `schedule_id`, run IDs, and job IDs because they can exceed `Number.MAX_SAFE_INTEGER`.
- Preserve server/client boundaries: scraping, scheduling, AI analysis, logs, dedupe checks, and article/analysis writes belong in server-only modules or route handlers.
