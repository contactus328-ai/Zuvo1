# Supabase Ops (Real-World)

## Dashboard settings (one-time)

1. **Auth → URL Configuration**
   - SITE URL = your production domain (Vercel)
   - Additional Redirect URLs = preview domain(s) + http://localhost:5173
2. **Auth → Users → Email templates** (optional): set your sender.
3. **Storage → CORS**
   - Allowed origins: your prod + preview domains
   - Methods: GET, PUT
4. **Backups**: ensure your plan has backups enabled.

## GitHub Secrets (for CI to work)

- `SUPABASE_ACCESS_TOKEN` (Personal access token with org/project access)
- `SUPABASE_PROJECT_REF` (like: ljevjenvmimgmodpygwn)
- `SUPABASE_DB_URL` (postgres connection string; optional but required for dump)
- Optional: `ALLOWED_ORIGINS` (comma-separated prod+preview origins for any management tasks)

> If secrets are missing, jobs auto-skip safely.

## Local developer quality-of-life (optional)

- `DATABASE_URL` in `.env` lets you run `npm run db:apply` (psql) for local mirrors.
