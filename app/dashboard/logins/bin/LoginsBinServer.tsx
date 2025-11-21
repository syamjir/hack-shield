import { Note } from "@/contexts/DashboardContext";
import { cookies } from "next/headers";
import React from "react";
import LoginsBinClient from "./LoginsBinClient";

export async function fetchBinLogins(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/logins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch logins");
  }

  const data = await res.json();
  const binData = data.data.filter((item: Note) => item.isDeleted);

  return { binData };
}

export default async function LoginsBinServer() {
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

    const { binData } = await fetchBinLogins(jwt);

    return <LoginsBinClient binLoginsFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching logins:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load bin logins. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
