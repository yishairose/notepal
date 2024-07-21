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

export async function deleteNote(id: number) {
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select();
}

export async function editNote(id, title, content) {
  const { data, error } = await supabase
    .from("notes")
    .update({ title: title, content: content })
    .eq("id", id)
    .select();
  if (error) throw error;

  return data;
}
