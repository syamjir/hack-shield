import Chat from "@/components/ui/Chat";

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <Chat roomId={userId} sender="admin" />;
}
