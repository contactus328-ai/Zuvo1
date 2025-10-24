/**
 * Zod-ready schemas (kept commented so build doesn't require zod yet).
 * When ready: 
pm i zod then uncomment imports & exports below, and start using them.
 */
// import { z } from "zod";
// export const emailSchema = z.string().trim().toLowerCase().email().max(254);
// export const phoneSchema = z.string().trim().regex(/^\+[1-9]\d{6,14}$/, "Use E.164 format");
// export const otpSchema   = z.string().trim().length(6, "6 digits").regex(/^\d+$/, "Digits only");
// export const signInEmail = z.object({ email: emailSchema });
// export const signInPhone = z.object({ phone: phoneSchema });
// export const verifyOtp   = z.object({ phone: phoneSchema, token: otpSchema });