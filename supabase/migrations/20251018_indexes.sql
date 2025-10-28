-- Indexes to speed common queries
create index if not exists idx_events_org_published_start on public.events (organization_id, published, start_at);
create index if not exists idx_regs_user_created on public.registrations (user_id, created_at desc);
create index if not exists idx_favs_user_created on public.favorites (user_id, created_at desc);
