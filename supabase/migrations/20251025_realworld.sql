-- Extensions (idempotent where possible)
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Users/Profiles
create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

-- Organizations (owner = user id)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists organizations_owner_idx on public.organizations (owner);

-- Events (owned by organization)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_public boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists events_org_idx on public.events (org_id);
create index if not exists events_public_idx on public.events (is_public);

-- Registrations (user <-> event)
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);
create index if not exists registrations_user_idx on public.registrations (user_id);

-- Favorites (user <-> event)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);
create index if not exists favorites_user_idx on public.favorites (user_id);

-- Auth trigger: create matching profile when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper predicates
create or replace function public.requesting_user_id()
returns uuid language sql stable as $$
  select auth.uid()
$$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.favorites enable row level security;

-- Profiles: users can read/update themselves
drop policy if exists "profiles-self-select" on public.profiles;
create policy "profiles-self-select"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "profiles-self-update" on public.profiles;
create policy "profiles-self-update"
  on public.profiles for update
  using (id = auth.uid());

-- Organizations: owner full access; members TBD later
drop policy if exists "orgs-owner-all" on public.organizations;
create policy "orgs-owner-all"
  on public.organizations for all
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- Events:
-- Public can read public events; owners (via org) full access
drop policy if exists "events-public-read" on public.events;
create policy "events-public-read"
  on public.events for select
  using (is_public);

drop policy if exists "events-owner-all" on public.events;
create policy "events-owner-all"
  on public.events for all
  using (exists (
    select 1 from public.organizations o
    where o.id = events.org_id and o.owner = auth.uid()
  ))
  with check (exists (
    select 1 from public.organizations o
    where o.id = events.org_id and o.owner = auth.uid()
  ));

-- Registrations/Favorites: user manages own rows
drop policy if exists "registrations-self-all" on public.registrations;
create policy "registrations-self-all"
  on public.registrations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "favorites-self-all" on public.favorites;
create policy "favorites-self-all"
  on public.favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Storage: create bucket + policies
-- Requires storage extension pre-installed by platform.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Allow public read from 'images'
drop policy if exists "images-public-read" on storage.objects;
create policy "images-public-read"
  on storage.objects for select
  using (bucket_id = 'images');

-- Authenticated users can insert/update/delete only their own files (by owner)
drop policy if exists "images-owner-all" on storage.objects;
create policy "images-owner-all"
  on storage.objects for all
  using (bucket_id = 'images' and owner = auth.uid())
  with check (bucket_id = 'images' and owner = auth.uid());
