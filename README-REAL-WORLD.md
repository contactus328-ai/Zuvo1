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
