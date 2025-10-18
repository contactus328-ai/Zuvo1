import { supabase } from "../supabase";

export async function listMyOrgs() {
  return await supabase.from("organizations").select("*").order("created_at", { ascending: false });
}
export async function createOrg(values: any) {
  const { data, error } = await supabase.from("organizations").insert(values).select().single();
  return { data, error };
}
export async function updateOrg(id: string, patch: any) {
  const { data, error } = await supabase.from("organizations").update(patch).eq("id", id).select().single();
  return { data, error };
}
