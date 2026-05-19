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
