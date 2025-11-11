import React from "react";
import { cookies } from "next/headers";
import IdentitiesClient from "./IdentitiesClient";

export const revalidate = 0; // disable caching

export type Identity = {
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: string;
  notes?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

async function fetchIdentities(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/identities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`, // send cookie to server
    },
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch identities");
  }

  const data = await res.json();
  const identities = data.data.filter((item: Identity) => !item.isDeleted);
  const binData = data.data.filter((item: Identity) => item.isDeleted);

  return { identities, binData };
}

export default async function IdentityServer() {
  try {
    const cookieStore = cookies(); // synchronous
    const jwt = (await cookieStore).get("jwt")?.value;

    if (!jwt) {
      return (
        <div className="p-6 text-red-500">
          Unauthorized. Please log in first.
        </div>
      );
    }

    const { identities, binData } = await fetchIdentities(jwt);

    return <IdentitiesClient identities={identities} binData={binData} />;
  } catch (err) {
    console.error("Error fetching identities:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load identities. {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
