"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Edit, Trash2, Globe } from "lucide-react";
import { BinType, Login } from "@/app/dashboard/page";
import { toast } from "sonner";

interface PasswordTableProps {
  title: string;
  passwords: Login[];
  setPasswords: React.Dispatch<React.SetStateAction<Login[]>>;
  setBin: React.Dispatch<React.SetStateAction<BinType>>;
}

export default function PasswordTable({
  title,
  passwords,
  setPasswords,
  setBin,
}: PasswordTableProps) {
  const [visibleId, setVisibleId] = useState<number | null>(null);

  const moveToBin = async (id: string) => {
    try {
      const res = await fetch(`/api/passwords/${id}/move-to-bin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message);

      const deletedPassword = data.data;
      if (!deletedPassword) return;

      // Determine which key to update based on section title
      const key =
        title === "logins"
          ? "logins"
          : title === "identities"
          ? "identities"
          : title === "notes"
          ? "notes"
          : "cards";

      // ✅ Update the Bin with the deleted password
      setBin((prev: BinType) => ({
        ...prev,
        [key]: [...prev[key], deletedPassword],
      }));

      // ✅ Remove from the active password list
      setPasswords((prev: Login[]) =>
        prev.filter((p) => p._id !== deletedPassword._id)
      );
    } catch (err) {
      console.error("Move to bin failed:", err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      {/* ✅ Desktop View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl bg-surface-a10/50 backdrop-blur-md shadow-md">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-primary-a20 text-left border-b border-surface-a20">
              <th className="p-4">Site</th>
              <th className="p-4">Website</th>
              <th className="p-4">Username</th>
              <th className="p-4">Password</th>
              <th className="p-4">Strength</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passwords.map((p, i) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-surface-a10/70 transition"
              >
                <td className="p-4 font-semibold text-dark-a0/50">{p.site}</td>

                {/* 🌐 Website URI */}
                <td className="p-4 text-info-a10 underline">
                  {p.websiteUri ? (
                    <a
                      href={
                        p.websiteUri.startsWith("http")
                          ? p.websiteUri
                          : `https://${p.websiteUri}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-info-a20"
                    >
                      <Globe size={14} />
                      {
                        new URL(
                          p.websiteUri.startsWith("http")
                            ? p.websiteUri
                            : `https://${p.websiteUri}`
                        ).hostname
                      }
                    </a>
                  ) : (
                    <span className="text-dark-a0/50">—</span>
                  )}
                </td>

                <td className="p-4 text-dark-a0/50">{p.username}</td>

                <td className="p-4 font-mono text-dark-a0/50">
                  {visibleId === p._id ? p.password : "••••••••"}
                </td>

                <td
                  className={`p-4 ${
                    p.strength === "Strong"
                      ? "text-green-500"
                      : p.strength === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {p.strength}
                </td>

                <td className="p-4 flex justify-end gap-3 text-primary-a20">
                  {visibleId === p._id ? (
                    <EyeOff
                      className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                      onClick={() => setVisibleId(null)}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                      onClick={() => setVisibleId(p._id)}
                    />
                  )}
                  <Edit className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                  <Trash2
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => moveToBin(p._id)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile + Tablet View */}
      <div className="lg:hidden space-y-3">
        {passwords.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-a10/50 rounded-xl p-4 shadow-sm backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-primary-a20">{p.site}</h3>
              <span
                className={`text-xs font-semibold ${
                  p.strength === "Strong"
                    ? "text-green-500"
                    : p.strength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {p.strength}
              </span>
            </div>

            {/* 🌐 Website */}
            {p.websiteUri && (
              <a
                href={
                  p.websiteUri.startsWith("http")
                    ? p.websiteUri
                    : `https://${p.websiteUri}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className=" text-info-a0 text-sm underline flex items-center gap-1 mb-2"
              >
                <Globe size={14} />
                {
                  new URL(
                    p.websiteUri.startsWith("http")
                      ? p.websiteUri
                      : `https://${p.websiteUri}`
                  ).hostname
                }
              </a>
            )}

            <p className="text-sm text-surface-a40 mb-2">{p.username}</p>
            <p className="font-mono mb-3">
              {visibleId === p._id ? p.password : "••••••••"}
            </p>

            <div className="flex justify-end gap-3 text-primary-a20">
              {visibleId === p._id ? (
                <EyeOff
                  className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                  onClick={() => setVisibleId(null)}
                />
              ) : (
                <Eye
                  className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                  onClick={() => setVisibleId(p._id)}
                />
              )}
              <Edit className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
              <Trash2
                className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                onClick={() => moveToBin(p._id)}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
