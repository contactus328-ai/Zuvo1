import { supabase } from "../supabase";

export type PhoneOtpStart = { ok: boolean; error?: unknown };
export type PhoneOtpVerify = { ok: boolean; error?: unknown };

export async function signInWithPhoneOtp(phoneE164: string): Promise<PhoneOtpStart> {
  const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164, options: { channel: "sms" } });
  return { ok: !error, error };
}

export async function verifyPhoneOtp(phoneE164: string, token: string): Promise<PhoneOtpVerify> {
  const { error } = await supabase.auth.verifyOtp({ phone: phoneE164, token, type: "sms" });
  return { ok: !error, error };
}
