insert into public.sources (name, listing_url, parser_strategy, active)
values
  ('Reuters', 'https://www.reuters.com/', 'reuters', true),
  ('NPR', 'https://www.npr.org/', 'npr', true),
  ('Fox News', 'https://www.foxnews.com/', 'fox_news', true),
  ('BBC', 'https://www.bbc.com/news', 'bbc', true),
  ('The Guardian', 'https://www.theguardian.com/us', 'guardian', true)
on conflict (listing_url) do update
set
  name = excluded.name,
  parser_strategy = excluded.parser_strategy,
  active = true,
  updated_at = now();
