/**
 * Best-effort client IP extraction for API/Edge handlers on Vercel.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "anon";
}