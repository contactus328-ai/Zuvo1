import { supabase } from "../supabase";

export async function listByOrg(orgId: string) {
  return await supabase.from("events").select("*").eq("organization_id", orgId).order("start_at", { ascending: true });
}
export async function getById(id: string) {
  return await supabase.from("events").select("*").eq("id", id).single();
}
export async function createEvent(values: any) {
  const { data, error } = await supabase.from("events").insert(values).select().single();
  return { data, error };
}
export async function updateEvent(id: string, patch: any) {
  const { data, error } = await supabase.from("events").update(patch).eq("id", id).select().single();
  return { data, error };
}
