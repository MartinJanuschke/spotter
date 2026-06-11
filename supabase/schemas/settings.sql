create table public.app_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- RLS enabled with no policies: the hashed PIN is never readable through the
-- API. Clients verify via the verify_operator_pin() RPC below.
alter table public.app_settings enable row level security;

create trigger app_settings_updated_at
  before update on public.app_settings
  for each row execute procedure public.set_updated_at();

create or replace function public.verify_operator_pin(pin text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_settings s
    where s.key = 'operator_pin'
      and s.value = extensions.crypt(pin, s.value)
  );
$$;
