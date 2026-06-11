-- Spotter Cup redesign: single player name + badge codes, game unit/tries,
-- categories, realtime publication.

-- players: merge first/last into a single name, add unique badge_code
alter table public.players add column name text;
update public.players set name = trim(first_name || ' ' || last_name);
alter table public.players alter column name set not null;
alter table public.players drop column first_name;
alter table public.players drop column last_name;

alter table public.players add column badge_code text;
with numbered as (
  select id, 1000 + row_number() over (order by created_at) as n
  from public.players
)
update public.players p
set badge_code = 'SP-' || numbered.n
from numbered
where p.id = numbered.id;
alter table public.players alter column badge_code set not null;
alter table public.players add constraint players_badge_code_key unique (badge_code);

-- games: measurement unit + required attempts per player
alter table public.games add column unit text not null default '';
alter table public.games add column tries smallint not null default 3
  check (tries between 1 and 10);

-- categories: age classes defined as a set of birth years
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  years      smallint[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories disable row level security;

create trigger categories_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

-- realtime: postgres_changes only fires for tables in the publication
alter publication supabase_realtime add table public.scores;
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.categories;
