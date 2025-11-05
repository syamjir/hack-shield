"use client";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function BinView({ title, bin, setBin, setPasswords }) {
  const restoreItem = async (item) => {
    try {
      const res = await fetch(`/api/passwords/${item._id}/restore`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const { message, data: restoreItem } = await res.json();

      if (!res.ok) throw new Error(message || "Something went wrong");

      toast.success(message);

      // 1️⃣ Add item back to active passwords (avoid duplicates)
      setPasswords((prev) => {
        const exists = prev.some((p) => p._id === restoreItem._id);
        return exists ? prev : [...prev, restoreItem];
      });

      // 2️⃣ Remove restored item from bin dynamically
      setBin((prev) => ({
        ...prev,
        [title]: prev[title].filter((p) => p._id !== restoreItem._id),
      }));
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const deleteForever = async (id) => {
    try {
      const res = await fetch(`/api/passwords/${id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      const deletedPassword = data.data;
      toast.success(data.message);
      // 2️⃣ Remove deleted item from bin dynamically
      setBin((prev) => ({
        ...prev,
        [title]: prev[title].filter((p) => p._id !== deletedPassword._id),
      }));
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  console.log(bin);

  return (
    <div className="p-4 bg-[var(--surface-a10)] rounded-xl">
      {bin.length === 0 ? (
        <p className="text-[var(--surface-a40)] text-center">Bin is empty</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-[var(--primary-a20)] text-left border-b border-[var(--surface-a20)]">
              <th className="p-3">Site</th>
              <th className="p-3">Username</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bin.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-[var(--surface-a10)]/70 transition"
              >
                <td className="p-3 font-semibold">{p.site}</td>
                <td className="p-3">{p.username}</td>
                <td className="p-3 flex justify-end gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => restoreItem(p)}
                    className="text-green-500"
                  >
                    <RotateCcw size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteForever(p._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
