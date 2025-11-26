import Chat from "@/components/ui/Chat";
import { getUser } from "../../adminServerActions";
import { cookies } from "next/headers";

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        <div className="p-6 text-red-600 text-center font-semibold">
          Unauthorized. Please log in first.
        </div>
      </div>
    );
  }

  let user;
  try {
    user = await getUser(userId, jwt);
  } catch (err) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        <div className="p-6 text-red-600 text-center font-semibold">
          Failed to fetch user. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Chat roomId={userId} sender="admin" reciever={user.data.email} />
    </div>
  );
}
