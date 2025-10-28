import type { VercelRequest, VercelResponse } from "@vercel/node";
import { rateLimit } from "../../src/lib/rateLimit";
import { emailSchema } from "../../src/lib/validation";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string) ||
    (req.headers["cf-connecting-ip"] as string) ||
    req.socket.remoteAddress ||
    "anon";
  const rl = rateLimit(`otp:${ip}`, 5, 5 * 60_000);
  if (!rl.ok) return res.status(429).json({ error: "Too Many Requests" });

  const email = typeof req.body?.email === "string" ? req.body.email : "";
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  if (process.env.NODE_ENV !== "production") {
    console.log("DEV OTP for", parsed.data, "=", otp);
  }
  // TODO: persist OTP with TTL (KV/Supabase) and send via provider.
  return res.status(200).json({ ok: true });
}
