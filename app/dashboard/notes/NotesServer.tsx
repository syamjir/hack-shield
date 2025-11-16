import React from "react";
import { cookies } from "next/headers";
import NotesClient from "./NotesClient";

export const revalidate = 0; // disable caching

export type INote = {
  _id?: string;
  title: string;
  content: string;
  tags?: string[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function fetchNotes(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch notes");
  }

  const data = await res.json();
  const notes = data.data.filter((item: INote) => !item.isDeleted);
  const binData = data.data.filter((item: INote) => item.isDeleted);

  return { notes, binData };
}

export default async function NotesServer() {
  try {
    const cookieStore = cookies();
    const jwt = (await cookieStore).get("jwt")?.value;

    if (!jwt) {
      return (
        <div className="p-6 text-red-500">
          Unauthorized. Please log in first.
        </div>
      );
    }

    const { notes, binData } = await fetchNotes(jwt);

    return <NotesClient notesFromDB={notes} binDataFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching identities:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load notes. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
