import React from "react";
import { cookies } from "next/headers";
import LoginsClient from "./LoginsClient";
import { Login } from "@/contexts/DashboardContext";

export const revalidate = 0; // disable caching

export async function fetchLogins(jwt: string) {
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
  const logins = data.data.filter((item: Login) => !item.isDeleted);
  const binData = data.data.filter((item: Login) => item.isDeleted);

  return { logins, binData };
}

export default async function LoginsServer() {
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

    const { logins, binData } = await fetchLogins(jwt);

    return <LoginsClient loginsFromDB={logins} binDataFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching logins:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load logins. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
