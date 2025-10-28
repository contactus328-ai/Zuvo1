# Release checklist (prod)
- [ ] Supabase Dashboard updated per /docs/ops/SUPABASE_ORIGINS_CHECKLIST.md.
- [ ] Protected routes use <RequireAuth redirect="/signin" />.
- [ ] If using validation: 
pm i zod and uncomment schemas in src/lib/validation/auth.ts.
- [ ] Sensitive routes use ateLimit() keyed by IP + route + identifier.
- [ ] Preview deploy: confirm no CSP violations; Realtime connects (wss).
- [ ] E2E smoke: sign-in → one core protected flow passes.
- [ ] Tag release and publish notes.