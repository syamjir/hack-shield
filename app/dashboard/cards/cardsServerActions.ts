export async function moveNoteToBin(id: string) {
    const res = await fetch(`/api/cards/${id}/move-to-bin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  
    const data = await res.json();
  
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  }
  