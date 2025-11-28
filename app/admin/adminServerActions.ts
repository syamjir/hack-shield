import { IUser } from "@/models/User";

export type SingleUserResponse = {
  message?: string;
  error?: string;
  data: IUser;
};
export type UsersListResponse = {
  message?: string;
  error?: string;
  data: IUser[];
};

export async function getAllUsers(jwt: string): Promise<UsersListResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch users");
  }

  const data = await res.json();
  return data;
}

export async function getUser(
  userId: string,
  jwt: string
): Promise<SingleUserResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch user");
  }

  const data = await res.json();
  return data;
}

export async function deleteUser(
  userId: string,
  jwt: string
): Promise<SingleUserResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch user");
  }

  const data = await res.json();
  return data;
}
