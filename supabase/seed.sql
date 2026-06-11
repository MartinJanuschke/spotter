-- Local development seed (applied by `supabase db reset` only).
-- Mirrors the design prototype's demo data.

insert into public.players (name, badge_code, year_of_birth) values
  ('Lena Brandt',  'SP-1042', 2016),
  ('Diego Fuentes','SP-1088', 2017),
  ('Yuki Tanaka',  'SP-1130', 2016),
  ('Sam Okafor',   'SP-1175', 2015),
  ('Mara Keller',  'SP-1206', 2017),
  ('Tomas Vidal',  'SP-1241', 2014),
  ('Priya Nair',   'SP-1299', 2015),
  ('Noah Berger',  'SP-1310', 2016),
  ('Emil Roth',    'SP-1356', 2017),
  ('Ayana Sow',    'SP-1402', 2015),
  ('Finn Köhler',  'SP-1448', 2016),
  ('Jonas Weiss',  'SP-1490', 2014);

insert into public.games (name, unit, higher_is_better, tries) values
  ('Schussgeschwindigkeit', 'km/h',    true,  3),
  ('Zielschießen',          'Treffer', true,  3),
  ('Dribbel-Parcours',      's',       false, 2),
  ('20m Sprint',            's',       false, 2);

insert into public.categories (name, years) values
  ('U9/U10',  '{2017,2016}'),
  ('U11/U12', '{2015,2014}');

-- A spread of first attempts so the leaderboard has content.
insert into public.scores (player_id, game_id, value, attempt_number)
select p.id, g.id,
  case g.name
    when 'Schussgeschwindigkeit' then 56 + (p.seq * 13 + g.seq * 5) % 28 + p.seq % 3
    when 'Zielschießen'          then 4 + (p.seq * 5 + g.seq) % 9
    when 'Dribbel-Parcours'      then 12 + (p.seq * 7 + g.seq * 2) % 9 + (p.seq % 4) * 0.3
    else                              3.2 + ((p.seq * 3 + g.seq) % 11) * 0.08
  end,
  1
from (select id, name, row_number() over (order by badge_code) as seq from public.players) p
cross join (select id, name, row_number() over (order by name) as seq from public.games) g
where (p.seq * 7 + g.seq * 3) % 10 >= 2;
