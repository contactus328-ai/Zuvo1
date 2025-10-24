# Real-World Readiness

This repo now includes:

- Strict CSP with runtime nonces (vite plugin).
- Client & server-side auth guard skeletons.
- Zod validation for forms/APIs.
- Rate limiting with LRU (dev) and optional Redis (set env UPSTASH_REDIS_URL/REST_TOKEN).
- Sentry client/server hooks (env gated).
- Playwright smoke tests and CI pipeline.
- Supabase schema + seed + rollback scripts. Optional workflow to lock allowed origins if Management API creds are present.
- Privacy Policy & Terms routes.
- Feature flags utility.
- Analyzer & bundle split.

**CI** will run on push/PR to `main`. Add secrets as needed for optional parts:

- `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `ALLOWED_ORIGINS`
- `VITE_SENTRY_DSN` (and optionally `VITE_RELEASE`)

Create a tag `v1.0.0` to trigger release notes.

## Health endpoint

- **GET `/api/health`** → `{ ok: true, name, ts, env, commit }`
- Used by Playwright checks locally and can be polled by external monitors post-deploy.

## Supabase (Real-World)

- **Strict RLS** enabled across all tables. Users see/update only their own rows.
- **Auth trigger**: creates a `profiles` record on first sign-in (`auth.users` → `profiles`).
- **Storage**: public `images` bucket; public read, owners can write/delete their own objects.
- **CI**:
  - `supabase-migrate.yml`: pushes migrations on every commit to `main` (skips if secrets missing).
  - `supabase-backup.yml`: nightly `pg_dump` (skips if `SUPABASE_DB_URL` missing).
- **Local**:
  - `npm run db:apply` / `npm run db:rollback` (requires `DATABASE_URL`).
- **Dashboard**: set SITE URL + redirect URLs, and Storage CORS for your domains.
