-- CAUTION: drops all app tables
drop table if exists public.favorites cascade;
drop table if exists public.registrations cascade;
drop table if exists public.events cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.requesting_user_id();
-- Storage bucket left intact intentionally
