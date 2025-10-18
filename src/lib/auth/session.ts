import { supabase } from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

export type SessionInfo = {
  session: Session | null;
  user: User | null;
  error?: unknown;
};

/** Return the current session and user (null if not signed in). */
export async function getSession(): Promise<SessionInfo> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, user: data.session?.user ?? null, error };
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function onAuthStateChange(
  handler: (session: Session | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    handler(session);
  });
  return () => data.subscription.unsubscribe();
}

/** Convenience getter for the current user. */
export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Sign the current user out. */
export async function signOut(): Promise<{ error?: unknown }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

