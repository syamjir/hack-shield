export async function getMessagesByRoomId(id: string) {
    const res = await fetch(`/api/messages/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  }