import { execSync } from "node:child_process";
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set; skipping local rollback.");
  process.exit(0);
}
execSync('psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/rollback.sql', { stdio: "inherit" });
