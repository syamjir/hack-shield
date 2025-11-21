import { Login } from "@/contexts/DashboardContext";

type ResponseType = {
  message?: string;
  error?: string;
  data: Login;
};

export async function restoreLogin(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/logins/${id}/restore`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}

export async function deleteLoginForever(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/logins/${id}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}
