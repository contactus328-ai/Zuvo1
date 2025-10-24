-- Example real tables + indices (replace with app-specific)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);
create index if not exists profiles_email_idx on profiles (email);
