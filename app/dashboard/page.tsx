// app/dashboard/page.tsx (SERVER COMPONENT)
import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  const withAuth = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Cookie: `jwt=${jwt}` } : {}),
    },
    cache: "no-store" as const,
  };

  const [loginsRes, identitiesRes, notesRes, cardsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/logins`, withAuth),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/identities`, withAuth),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notes`, withAuth),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cards`, withAuth),
  ]);

  const loginsData = await loginsRes.json();
  const identitiesData = await identitiesRes.json();
  const notesData = await notesRes.json();
  const cardsData = await cardsRes.json();

  if (!jwt) {
    return (
      <div className="p-6 text-red-500">Unauthorized. Please log in first.</div>
    );
  }

  return (
    <DashboardClient
      logins={loginsData.data}
      identities={identitiesData.data}
      notes={notesData.data}
      cards={cardsData.data}
      errors={{
        logins: loginsData.error,
        identities: identitiesData.error,
        notes: notesData.error,
        cards: cardsData.error,
      }}
    />
  );
}
