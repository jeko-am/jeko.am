alter table public.pet_profiles
  add column if not exists state text,
  add column if not exists country text;

update public.pet_profiles p
set
  country = coalesce(nullif(p.country, ''), nullif(u.country, '')),
  state = coalesce(nullif(p.state, ''), nullif(u.state, ''))
from public.user_profiles u
where p.user_id = u.user_id
  and (p.country is null or p.country = '' or p.state is null or p.state = '');

create index if not exists pet_profiles_country_city_idx
  on public.pet_profiles (country, city);
