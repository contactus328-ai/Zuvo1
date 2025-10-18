import { supabase } from "../supabase";

const BUCKET = "images";

export async function uploadImage(file: File) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `u/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  return { path, error };
}

export function getPublicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
