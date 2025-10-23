import { supabase } from "../supabase";

export async function addFavorite(eventId: string) {
  const { data, error } = await supabase.from("favorites").insert({ event_id: eventId }).select().single();
  return { data, error };
}
export async function removeFavorite(eventId: string) {
  const { data, error } = await supabase.from("favorites").delete().eq("event_id", eventId).select();
  return { data, error };
}
export async function listMyFavorites() {
  return await supabase.from("favorites").select("*").order("created_at", { ascending: false });
}
