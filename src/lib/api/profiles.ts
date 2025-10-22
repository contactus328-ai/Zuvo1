import { supabase } from "../supabase";

export async function getMyProfile() {
  return await supabase.from("profiles").select("*").single();
}
export async function updateMyProfile(patch: any) {
  const { data, error } = await supabase.from("profiles").update(patch).select().single();
  return { data, error };
}
