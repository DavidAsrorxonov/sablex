create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.sources (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  listing_url text not null unique,
  parser_strategy text,
  active boolean not null default true,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default extensions.gen_random_uuid(),
  source_id uuid not null references public.sources(id),
  original_url text not null unique,
  canonical_url text not null,
  slug text not null unique,
  title text not null,
  image_url text not null,
  published_at timestamptz not null,
  raw_text text not null,
  scraped_at timestamptz not null default now(),
  analyzed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_analyses (
  id uuid primary key default extensions.gen_random_uuid(),
  article_id uuid not null unique references public.articles(id) on delete cascade,
  summary text not null,
  sentiment_score numeric not null,
  sentiment_label text not null,
  bias_score numeric not null,
  bias_label text not null,
  left_percentage integer not null,
  center_percentage integer not null,
  right_percentage integer not null,
  confidence numeric not null,
  framing_notes text[] not null default '{}',
  loaded_terms text[] not null default '{}',
  disclaimer text not null,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint article_analyses_sentiment_label_check
    check (sentiment_label in ('positive', 'neutral', 'negative')),
  constraint article_analyses_bias_label_check
    check (bias_label in ('left', 'center', 'right', 'mixed', 'unclear')),
  constraint article_analyses_percentage_range_check
    check (
      left_percentage between 0 and 100
      and center_percentage between 0 and 100
      and right_percentage between 0 and 100
    ),
  constraint article_analyses_percentage_sum_check
    check ((left_percentage + center_percentage + right_percentage) = 100),
  constraint article_analyses_sentiment_score_check
    check (sentiment_score between -1 and 1),
  constraint article_analyses_bias_score_check
    check (bias_score between -1 and 1),
  constraint article_analyses_confidence_check
    check (confidence between 0 and 1)
);

create table if not exists public.logs (
  id uuid primary key default extensions.gen_random_uuid(),
  level text not null,
  scope text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint logs_level_check
    check (level in ('debug', 'info', 'warn', 'error'))
);

create table if not exists public.oxylabs_schedules (
  id uuid primary key default extensions.gen_random_uuid(),
  source_id uuid not null unique references public.sources(id) on delete cascade,
  schedule_id text not null unique,
  target_url text not null,
  active boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oxylabs_schedule_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  schedule_id uuid not null references public.oxylabs_schedules(id) on delete cascade,
  oxylabs_run_id text,
  oxylabs_job_id text,
  result_status text not null,
  processed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sources_set_updated_at on public.sources;
create trigger sources_set_updated_at
before update on public.sources
for each row execute function public.set_updated_at();

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists article_analyses_set_updated_at on public.article_analyses;
create trigger article_analyses_set_updated_at
before update on public.article_analyses
for each row execute function public.set_updated_at();

drop trigger if exists oxylabs_schedules_set_updated_at on public.oxylabs_schedules;
create trigger oxylabs_schedules_set_updated_at
before update on public.oxylabs_schedules
for each row execute function public.set_updated_at();

create index if not exists sources_active_idx
  on public.sources (active, name);

create index if not exists articles_source_id_idx
  on public.articles (source_id);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

create index if not exists articles_scraped_at_idx
  on public.articles (scraped_at desc);

create index if not exists articles_analyzed_at_idx
  on public.articles (analyzed_at desc);

create index if not exists article_analyses_article_id_idx
  on public.article_analyses (article_id);

create index if not exists article_analyses_bias_label_idx
  on public.article_analyses (bias_label);

create index if not exists article_analyses_sentiment_label_idx
  on public.article_analyses (sentiment_label);

create index if not exists logs_scope_created_at_idx
  on public.logs (scope, created_at desc);

create index if not exists oxylabs_schedules_source_id_idx
  on public.oxylabs_schedules (source_id);

create index if not exists oxylabs_schedules_schedule_id_idx
  on public.oxylabs_schedules (schedule_id);

create index if not exists oxylabs_schedule_runs_schedule_status_created_idx
  on public.oxylabs_schedule_runs (schedule_id, result_status, created_at desc);

alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.sources to anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant select on table public.article_analyses to anon, authenticated;

grant all on table public.sources to service_role;
grant all on table public.articles to service_role;
grant all on table public.article_analyses to service_role;
grant all on table public.logs to service_role;
grant all on table public.oxylabs_schedules to service_role;
grant all on table public.oxylabs_schedule_runs to service_role;

drop policy if exists "Public can read active sources" on public.sources;
create policy "Public can read active sources"
on public.sources
for select
to anon, authenticated
using (active);

drop policy if exists "Service role can manage sources" on public.sources;
create policy "Service role can manage sources"
on public.sources
for all
to service_role
using (true)
with check (true);

drop policy if exists "Public can read analyzed articles" on public.articles;
create policy "Public can read analyzed articles"
on public.articles
for select
to anon, authenticated
using (analyzed_at is not null);

drop policy if exists "Service role can manage articles" on public.articles;
create policy "Service role can manage articles"
on public.articles
for all
to service_role
using (true)
with check (true);

drop policy if exists "Public can read analyses for analyzed articles" on public.article_analyses;
create policy "Public can read analyses for analyzed articles"
on public.article_analyses
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.articles
    where articles.id = article_analyses.article_id
      and articles.analyzed_at is not null
  )
);

drop policy if exists "Service role can manage article analyses" on public.article_analyses;
create policy "Service role can manage article analyses"
on public.article_analyses
for all
to service_role
using (true)
with check (true);

drop policy if exists "Service role can manage logs" on public.logs;
create policy "Service role can manage logs"
on public.logs
for all
to service_role
using (true)
with check (true);

drop policy if exists "Service role can manage oxylabs schedules" on public.oxylabs_schedules;
create policy "Service role can manage oxylabs schedules"
on public.oxylabs_schedules
for all
to service_role
using (true)
with check (true);

drop policy if exists "Service role can manage oxylabs schedule runs" on public.oxylabs_schedule_runs;
create policy "Service role can manage oxylabs schedule runs"
on public.oxylabs_schedule_runs
for all
to service_role
using (true)
with check (true);
