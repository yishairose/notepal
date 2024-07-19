import supabase from "../config/supabaseClient";

export async function fetchNotes() {
  const { data, error } = await supabase.from("notes").select();
  if (error) return error;
  return data;
}

export async function fetchNoteItem(id: number) {
  const { data, error } = await supabase.from("notes").select().eq("id", id);
  if (error) return error;
  return data;
}
