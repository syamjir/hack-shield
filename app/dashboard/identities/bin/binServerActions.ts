import { Identity } from "@/contexts/DashboardContext";

type ResponseType = {
  message?: string;
  error?: string;
  data: Identity;
};

export async function restoreIdentity(id: string): Promise<ResponseType> {
  const res = await fetch(`/api/identities/${id}/restore`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}

export async function deleteIdentityForever(id: string): Promise<Identity> {
  //   return deletedIdenity;
}
