"use client";

import { useRouter } from "next/navigation";
import { deleteUser } from "../adminServerActions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

export default function DeleteUserButton({
  userId,
  jwt,
}: {
  userId: string;
  jwt: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      const data = await deleteUser(userId, jwt);
      toast.success(data.message);
      router.push("/admin/users");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 flex items-center bg-red-600 text-white rounded-md"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin mr-2" />
          Deleting...
        </>
      ) : (
        <>
          <LogIn size={18} className="mr-2" />
          Delete User
        </>
      )}
    </button>
  );
}
