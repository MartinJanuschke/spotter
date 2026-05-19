-- shared: extensions + helpers
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- players
create table public.players (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  year_of_birth smallint not null check (year_of_birth >= 1900 and year_of_birth <= 2100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.players disable row level security;

create trigger players_updated_at
  before update on public.players
  for each row execute procedure public.set_updated_at();

-- games
create table public.games (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  higher_is_better boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.games disable row level security;

create trigger games_updated_at
  before update on public.games
  for each row execute procedure public.set_updated_at();

-- scores
create table public.scores (
  id             uuid primary key default gen_random_uuid(),
  player_id      uuid not null references public.players(id) on delete cascade,
  game_id        uuid not null references public.games(id) on delete cascade,
  value          numeric(10, 3) not null,
  attempt_number integer not null default 1,
  created_at     timestamptz not null default now()
);

alter table public.scores disable row level security;

create unique index scores_player_game_attempt on public.scores (player_id, game_id, attempt_number);
create index scores_game_id_idx   on public.scores (game_id);
create index scores_player_id_idx on public.scores (player_id);
