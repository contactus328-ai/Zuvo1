```ts
import { supabase } from ../../lib/supabaseClient;

export type EventRow = {
  id: string;
  org_id: string;
  title: string;
  summary?: string | null;
  cover_image_url?: string | null;
  start_at: string;
  end_at: string;
  venue?: string | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export async function listByOrg(orgId: string, opts?: { includeDrafts?: boolean }) {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id ?? null;

  let q = supabase.from(events).select(*).eq(org_id, orgId).order(start_at, { ascending: true });

  // If not asking for drafts, only show published
  if (!opts?.includeDrafts) {
    q = q.eq(is_published, true);
  } else if (!uid) {
    // includeDrafts requested but no user; force published
    q = q.eq(is_published, true);
  }

  const { data, error } = await q;
  return { data: (data ?? []) as EventRow[], error };
}

export async function getById(id: string) {
  const { data, error } = await supabase.from(events).select(*).eq(id, id).single();
  return { data: (data as EventRow) ?? null, error };
}

export async function create(input: {
  org_id: string;
  title: string;
  summary?: string;
  cover_image_url?: string;
  start_at: string; // ISO string
  end_at: string;   // ISO string
  venue?: string;
  is_published?: boolean;
}) {
  const { data: auth, error: uerr } = await supabase.auth.getUser();
  if (uerr) return { data: null, error: uerr };
  if (!auth.user) return { data: null, error: new Error(Not