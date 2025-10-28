import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // Minimal, dependency-free health payload
  const body = {
    ok: true,
    name: "zuvo1",
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
  };
  res.status(200).json(body);
}
