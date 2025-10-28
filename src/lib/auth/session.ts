import { supabase } from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

export type SessionInfo = {
  session: Session | null;
  user: User | null;
  error?: unknown;
};

let cached: SessionInfo = { session: null, user: null };

export async function refreshSession(): Promise<SessionInfo> {
  const { data, error } = await supabase.auth.getSession();
  cached = { session: data.session, user: data.session?.user ?? null, error };
  return cached;
}

export function getSession(): SessionInfo {
  return cached;
}

export function onAuthStateChange(
  handler: (session: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_e, sess) => {
    cached = { session: sess, user: sess?.user ?? null };
    handler(sess);
  });
  return () => data.subscription.unsubscribe();
}

export async function getUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  const user = data.user ?? null;
  cached = { session: cached.session, user, error };
  return user;
}

export async function signOut(): Promise<{ error?: unknown }> {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    cached = { session: null, user: null };
  }
  return { error };
}
