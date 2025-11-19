export async function moveCardToBin(id: string) {
  const res = await fetch(`/api/cards/${id}/move-to-bin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export async function retrieveCardNumber(id: string) {
  const res = await fetch(`/api/cards/${id}/retrieve-cardnumber`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export async function retrieveCvv(id: string) {
  const res = await fetch(`/api/cards/${id}/retrieve-cvv`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
