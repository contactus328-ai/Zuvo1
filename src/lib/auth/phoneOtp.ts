import { supabase } from "../supabase";

export type PhoneOtpStart = { ok: boolean; error?: unknown };
export type PhoneOtpVerify = { ok: boolean; error?: unknown };

/** Start SMS OTP (send code to a phone number like +91XXXXXXXXXX in E.164). */
export async function signInWithPhoneOtp(phoneRaw: string): Promise<PhoneOtpStart> {
  const phoneE164 = phoneRaw.trim();
  const { error } = await supabase.auth.signInWithOtp({
    phone: phoneE164,
    options: { channel: "sms" },
  });
  return { ok: !error, error };
}

/** Verify the SMS OTP code and create a session on success. */
export async function verifyPhoneOtp(phoneRaw: string, token: string): Promise<PhoneOtpVerify> {
  const phoneE164 = phoneRaw.trim();
  const { error } = await supabase.auth.verifyOtp({
    phone: phoneE164,
    token,
    type: "sms",
  });
  return { ok: !error, error };
}
