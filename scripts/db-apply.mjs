import { execSync } from "node:child_process";
execSync('psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/schema.sql', { stdio: "inherit" });
execSync('psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql', { stdio: "inherit" });
