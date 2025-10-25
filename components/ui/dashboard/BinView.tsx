"use client";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";

export default function BinView({ title, bin, setBin, setPasswords }) {
  const restoreItem = (item) => {
    // 1️⃣ Add item back to the active list
    setPasswords((prev) => [...prev, item]);

    // 2️⃣ Remove item from the bin based on the section title
    if (title === "logins") {
      setBin((prev) => ({
        ...prev,
        logins: prev.logins.filter((p) => p.id !== item.id),
      }));
    } else if (title === "identities") {
      setBin((prev) => ({
        ...prev,
        identities: prev.identities.filter((p) => p.id !== item.id),
      }));
    } else if (title === "notes") {
      setBin((prev) => ({
        ...prev,
        notes: prev.notes.filter((p) => p.id !== item.id),
      }));
    }
  };

  const deleteForever = (id) => {
    setBin((prev) => prev.filter((p) => p.id !== id));
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
                key={p.id}
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
                    onClick={() => deleteForever(p.id)}
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
