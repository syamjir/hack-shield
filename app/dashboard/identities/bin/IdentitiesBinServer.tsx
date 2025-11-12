import { Identity } from "@/contexts/DashboardContext";
import { cookies } from "next/headers";
import React from "react";
import IdentitiesBinClient from "./IdentitiesBinClient";

export async function fetchBinIdentities(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/identities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch identities");
  }

  const data = await res.json();
  const binData = data.data.filter((item: Identity) => item.isDeleted);

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

    const { binData } = await fetchBinIdentities(jwt);

    return <IdentitiesBinClient binIdenitiesFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching identities:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load bin identities. {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
