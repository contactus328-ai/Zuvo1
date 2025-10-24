import { supabase } from "../supabase";

export async function registerMe(eventId: string) {
  const { data, error } = await supabase.from("registrations").insert({ event_id: eventId }).select().single();
  return { data, error };
}
export async function unregisterMe(eventId: string) {
  const { data, error } = await supabase.from("registrations").delete().eq("event_id", eventId).select();
  return { data, error };
}
export async function listMine() {
  return await supabase.from("registrations").select("*").order("created_at", { ascending: false });
}
