import { Note } from "@/contexts/DashboardContext";
import { cookies } from "next/headers";
import React from "react";
import NotesBinClient from "./NotesBinClient";

export async function fetchBinNotes(jwt: string) {
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
  const binData = data.data.filter((item: Note) => item.isDeleted);

  return { binData };
}

export default async function IdentitiesBinServer() {
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

    const { binData } = await fetchBinNotes(jwt);

    return <NotesBinClient binNotesFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching notes:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load bin notes. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
