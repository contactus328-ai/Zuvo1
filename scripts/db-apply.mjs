import { execSync } from "node:child_process";
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set; skipping local apply.");
  process.exit(0);
}
execSync('psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20251025_realworld.sql', { stdio: "inherit" });
execSync('psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql', { stdio: "inherit" });
