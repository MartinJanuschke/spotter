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
