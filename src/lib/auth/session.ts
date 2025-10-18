import { supabase } from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

export type SessionInfo = { session: Session | null; user: User | null; error?: unknown };

export async function getSession(): Promise<SessionInfo> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, user: data.session?.user ?? null, error };
}

export function onAuthStateChange(handler: (session: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_e, sess) => handler(sess));
  return () => data.subscription.unsubscribe();
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOut(): Promise<{ error?: unknown }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}
