import React from "react";
import { cookies } from "next/headers";
import CardsClient from "./CardsClient";
import { Card } from "@/contexts/DashboardContext";

export const revalidate = 0; // disable caching

export async function fetchCards(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch cards");
  }

  const data = await res.json();
  const cards = data.data.filter((item: Card) => !item.isDeleted);
  const binData = data.data.filter((item: Card) => item.isDeleted);

  return { cards, binData };
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

    const { cards, binData } = await fetchCards(jwt);

    return <CardsClient cardsFromDB={cards} binDataFromDB={binData} />;
  } catch (err) {
    console.error("Error fetching cards:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load cards. | {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
