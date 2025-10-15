-- Create a public bucket for images used by the UI
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects (it is on by default, keep explicit)
alter table storage.objects enable row level security;

-- Public can read images in this bucket
create policy images_public_read
on storage.objects
for select
using (bucket_id = 'images');

-- Only authenticated users can upload to the images bucket
create policy images_auth_insert
on storage.objects
for insert
with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- Object owner can update/delete their own files
create policy images_owner_update
on storage.objects
for update
using (bucket_id = 'images' and owner = auth.uid())
with check (bucket_id = 'images' and owner = auth.uid());

create policy images_owner_delete
on storage.objects
for delete
using (bucket_id = 'images' and owner = auth.uid());