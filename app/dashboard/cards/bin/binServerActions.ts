import { Card } from "@/contexts/DashboardContext";

type ResponseType = {
  message?: string;
  error?: string;
  data: Card;
};

export async function restoreCard(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/cards/${id}/restore`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}

export async function deleteCardForever(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/cards/${id}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}
