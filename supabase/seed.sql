insert into profiles (email) values ('demo@example.com')
on conflict (email) do nothing;
