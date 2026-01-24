export async function getMessagesByRoomId(id: string) {
  // Fetch all messages for a specific chat room by room ID
  const res = await fetch(`/api/messages/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  // Handle non-success HTTP responses explicitly
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
