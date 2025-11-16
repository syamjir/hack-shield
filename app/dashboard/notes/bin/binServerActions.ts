import { Note } from "@/contexts/DashboardContext";

type ResponseType = {
  message?: string;
  error?: string;
  data: Note;
};

export async function restoreNote(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/notes/${id}/restore`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}

export async function deleteNoteForever(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/notes/${id}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}
