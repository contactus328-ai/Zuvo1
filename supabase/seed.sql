-- Seed minimal data (safe idempotency)
insert into public.organizations (id, owner, name)
select gen_random_uuid(), p.id, 'My First Org'
from public.profiles p
where p.id = auth.uid()
on conflict do nothing;
