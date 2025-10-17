```ts
import { supabase } from ../../lib/supabaseClient;

/** Organization record shape (subset) */
export type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
};

export async function listMine() {
  // RLS returns only what you can read; filter by creator_id = auth.uid() server-side via policy.
  const { data, error } = await supabase
    .from(organizations)
    .select(*)
    .order(created_at, { ascending: false });
  return { data: (data ?? []) as Organization[], error };
}

export async function create(input: {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}) {
  // Policy requires creator_id = auth.uid(); we set it explicitly.
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return { data: null, error: userErr };
  if (!user) return { data: null, error: new Error(Not