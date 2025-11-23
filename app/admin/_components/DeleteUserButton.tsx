"use client";

import { deleteUser } from "../adminServerActions";
import { toast } from "sonner";

export default function DeleteUserButton({
  userId,
  jwt,
}: {
  userId: string;
  jwt: string;
}) {
  const handleDelete = async () => {
    try {
      const data = await deleteUser(userId, jwt);
      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }

    alert("User deleted");
    window.location.href = "/admin/users";
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Delete User
    </button>
  );
}
