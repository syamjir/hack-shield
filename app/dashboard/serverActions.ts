export async function logout() {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
