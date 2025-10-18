import { supabase } from "../supabase";

export type OtpStartResult = { ok: boolean; error?: unknown };
export type OtpVerifyResult = { ok: boolean; error?: unknown };

export async function signInWithOtp(email: string): Promise<OtpStartResult> {
  const { error } = await supabase.auth.signInWithOtp({ email });
  return { ok: !error, error };
}

export async function verifyOtp(email: string, token: string): Promise<OtpVerifyResult> {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  return { ok: !error, error };
}
