export async function moveIdentityToBin(id: string) {
  const res = await fetch(`/api/identities/${id}/move-to-bin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
