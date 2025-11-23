import { cookies } from "next/headers";
import { getAllUsers } from "../adminServerActions";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { UserCard } from "../_components/UserCard";

export const revalidate = 0;
export default async function UsersPage() {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <div className="p-6 text-red-600 text-center font-semibold">
          Unauthorized. Please log in first.
        </div>
      </div>
    );
  }

  let users;
  try {
    users = await getAllUsers(jwt);
  } catch (err) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <div className="p-6 text-red-600 text-center font-semibold">
          Failed to fetch users. Please try again later.
        </div>
      </div>
    );
  }

  if (!users.data || users.data.length === 0) {
    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <Header />
        <div className="p-6 text-gray-600 text-center font-medium">
          No users found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <Header />

      <Suspense
        fallback={
          <div className="p-6 text-gray-500 flex gap-2 items-center">
            <p>Loading users...</p>
            <Spinner />
          </div>
        }
      >
        {/* User Cards */}
        <UserCard users={users} />
      </Suspense>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary-a20">
        Users Management
      </h2>
      <p className="text-dark-a0/50 mt-1">
        View and manage all registered users in the system.
      </p>
    </div>
  );
}
