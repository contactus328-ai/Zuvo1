import { z } from "zod";

export const emailSchema = z.string().email().max(254);
export const otpSchema = z.string().regex(/^[0-9]{4,8}$/);

export const signInSchema = z.object({
  email: emailSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
