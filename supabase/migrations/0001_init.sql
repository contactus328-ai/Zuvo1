-- Example schema; adjust for real entities
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "rw own profile" on profiles
  for all using (auth.uid()::uuid = id) with check (auth.uid()::uuid = id);
