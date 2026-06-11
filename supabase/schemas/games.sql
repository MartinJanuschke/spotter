create table public.games (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  higher_is_better boolean not null default true,
  unit             text not null default '',
  tries            smallint not null default 3 check (tries between 1 and 10),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.games disable row level security;

create trigger games_updated_at
  before update on public.games
  for each row execute procedure public.set_updated_at();
