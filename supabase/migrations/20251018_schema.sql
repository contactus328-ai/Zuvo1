-- SCHEMA: core tables
create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  published boolean default false,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid default auth.uid(),
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.favorites enable row level security;

-- Basic policies
do $$
begin
  -- profiles: user reads own, updates own; others no
  if not exists (select 1 from pg_policies where polname='profiles_self_read') then
    create policy profiles_self_read on public.profiles
      for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where polname='profiles_self_update') then
    create policy profiles_self_update on public.profiles
      for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;

  -- organizations: owner full; authenticated read
  if not exists (select 1 from pg_policies where polname='orgs_owner_all') then
    create policy orgs_owner_all on public.organizations
      using (owner_id = auth.uid()) with check (owner_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where polname='orgs_read_all') then
    create policy orgs_read_all on public.organizations
      for select using (auth.role() = 'authenticated');
  end if;

  -- events: published readable by all; owner manages
  if not exists (select 1 from pg_policies where polname='events_read_published') then
    create policy events_read_published on public.events
      for select using (published or exists (
        select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid()
      ));
  end if;
  if not exists (select 1 from pg_policies where polname='events_owner_all') then
    create policy events_owner_all on public.events
      using (exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid()))
      with check (exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = auth.uid()));
  end if;

  -- registrations/favorites: user manages own rows
  if not exists (select 1 from pg_policies where polname='regs_user_all') then
    create policy regs_user_all on public.registrations
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where polname='favs_user_all') then
    create policy favs_user_all on public.favorites
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

-- Trigger: create profile row when auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage: create images bucket if missing and make it public
insert into storage.buckets (id, name, public)
values ('images','images', true)
on conflict (id) do nothing;
