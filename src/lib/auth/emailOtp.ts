```ts
import { supabase } from ../supabaseClient;

export type OtpStartResult = { ok: boolean; error?: unknown };
export type OtpVerifyResult = { ok: boolean; error?: unknown };

/** Start email OTP sign-in (sends code). */
export async function signInWithOtp(emailRaw: string): Promise<OtpStartResult> {
  const email = emailRaw.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithOtp({ email });
  return { ok: !error, error };
}

/** Verify the OTP code (establishes session on success). */
export async function verifyOtp(
  emailRaw: string,
  token: string
): Promise<OtpVerifyResult> {
  const email = emailRaw.trim().toLowerCase();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: email,
  });
  return { ok: !error, error };
}

