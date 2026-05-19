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
