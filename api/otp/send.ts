import { rateLimit } from "../../src/lib/rateLimit";
import { emailSchema } from "../../src/lib/validation";

export async function POST(req: Request) {
  const ip = (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "anon"
  ).toString();
  const rl = rateLimit(`otp:${ip}`, 5, 5 * 60_000);
  if (!rl.ok) return new Response("Too Many Requests", { status: 429 });

  const body = await req.json().catch(() => ({}));
  const result = emailSchema.safeParse(body.email);
  if (!result.success) return new Response("Invalid email", { status: 400 });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  if (process.env.NODE_ENV !== "production") {
    console.log("DEV OTP for", result.data, "=", otp);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
