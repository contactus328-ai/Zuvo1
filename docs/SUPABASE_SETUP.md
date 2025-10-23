# Supabase setup quick guide

## 1) Auth → URL Configuration
- Site URL: http://localhost:3000
- Additional Redirect URLs: http://localhost:3000
- Allowed Logout URLs: http://localhost:3000

## 2) Apply the SQL migration
- Open Supabase → SQL Editor → paste the content of `supabase/migrations/20251018_schema.sql` → Run.
- This creates tables, RLS, trigger, and public `images` bucket.

## 3) Environment
Create `.env.local` (never commit):
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>

## 4) Phone OTP (later)
Auth → Providers → Phone: add Twilio SID, Auth Token, Message Service SID, From number; test with verified number.

## 5) Run app
npm install
npm run dev
