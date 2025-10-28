import React from "react";
import { supabase } from "../supabase/client"; // adjust path if your client lives elsewhere
type Props = { children: React.ReactNode; fallback?: React.ReactNode; redirect?: string };
async function getSession() {
  const { data } = await supabase.auth.getSession();
  return { user: data.session?.user ?? null };
}
function onAuthStateChange(cb: (session: any) => void) {
  const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => cb(s));
  return () => sub.subscription.unsubscribe();
}
export function RequireAuth({ children, fallback = null, redirect = "/signin" }: Props) {
  const [ready, setReady] = React.useState(false);
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    let unsub = () => {};
    (async () => {
      const { user } = await getSession();
      setAuthed(Boolean(user));
      setReady(true);
      unsub = onAuthStateChange((session) => setAuthed(Boolean(session?.user)));
    })();
    return () => unsub();
  }, []);
  if (!ready) return fallback;
  if (!authed) {
    if (typeof window !== "undefined") window.location.replace(redirect);
    return null;
  }
  return <>{children}</>;
}
