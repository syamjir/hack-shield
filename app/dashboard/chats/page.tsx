import Chat from "@/components/ui/Chat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getLoggedUser(jwt: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`, // send cookie to server
    },
    cache: "no-store", // always fresh
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export default async function UserChatPage() {
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
    const data = await getLoggedUser(jwt);
    // check user is premium to access chat
    if (!data.data?.payment?.isPremiumUser) {
      redirect("/dashboard");
    }
    return <Chat roomId={data.data._id} sender="user" reciever="Admin" />;
  } catch (err) {
    console.error("Error loading chat:", err);
    return (
      <div className="p-6 text-red-500">
        Failed to load chat. {err instanceof Error ? err.message : ""}
      </div>
    );
  }
}
