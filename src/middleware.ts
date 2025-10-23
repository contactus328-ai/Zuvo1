/**
 * Basic server-side auth check + rate-limited API example for Vercel Edge/Node.
 * If your routes start with /api/protected, enforce a session token header/cookie.
 */
import type { NextFetchEvent, NextRequest } from "next/server"; // if not Next, this file is inert on Vite
export function middleware(_req: NextRequest, _ev: NextFetchEvent) {
  // Placeholder – if using Next. For Vite, keep for future migration.
  return;
}
