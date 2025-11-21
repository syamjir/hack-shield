export async function moveLoginToBin(id: string) {
  const res = await fetch(`/api/logins/${id}/move-to-bin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export async function retrievePassword(id: string) {
  const res = await fetch(`/api/logins/${id}/retrieve-password`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
