"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Edit, Trash2, Globe, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { BinType, Login } from "@/app/dashboard/page";

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
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const moveToBin = async (id: string) => {
    try {
      const res = await fetch(`/api/passwords/${id}/move-to-bin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success(data.message);

      const deleted = data.data;
      if (!deleted) return;

      const key =
        title === "logins"
          ? "logins"
          : title === "identities"
          ? "identities"
          : title === "notes"
          ? "notes"
          : "cards";

      setBin((prev) => ({ ...prev, [key]: [...prev[key], deleted] }));
      setPasswords((prev) => prev.filter((p) => p._id !== deleted._id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const retrievePassword = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/passwords/${id}/retrieve-password`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const retrievedPassword = data.data;

      // ✅ Update state:  replace the password in the list
      setPasswords((prev) => {
        return prev.map((p) =>
          p._id === retrievedPassword._id ? retrievedPassword : p
        );
      });

      // Show which password is visible
      setVisibleId(retrievedPassword._id);

      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* 🌟 Scrollable container with smooth scroll and height limits */}
      <div
        className="
    max-h-[70vh]
    overflow-y-auto
    pr-1
    pb-60 sm:pb-14
    scroll-pb-60 sm:scroll-pb-14
    scrollbar-thin scrollbar-thumb-surface-a20 scrollbar-track-transparent
    hover:scrollbar-thumb-surface-a30
  "
      >
        {passwords.length === 0 && (
          <p className="text-dark-a0/60 text-sm ">
            No active passwords. Check the bin or add a new one!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
          {passwords.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative bg-surface-a10/60 rounded-2xl p-5 backdrop-blur-lg shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-primary-a20">
                    {p.site}
                  </h3>
                  {p.websiteUri && (
                    <a
                      href={
                        p.websiteUri.startsWith("http")
                          ? p.websiteUri
                          : `https://${p.websiteUri}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info-a10 text-sm underline flex items-center gap-1 mt-1 hover:text-info-a20"
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
                </div>

                {/* Strength Badge */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    p.strength === "Strong"
                      ? "bg-success-a20 text-success-a0"
                      : p.strength === "Medium"
                      ? "bg-warning-a20 text-warning-a0"
                      : "bg-danger-a20 text-danger-a0"
                  }`}
                >
                  {p.strength}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1 mb-3">
                <p className="text-sm text-dark-a0/60">
                  <span className="font-semibold ">Username:</span>{" "}
                  {p.username || "—"}
                </p>
                <p className="font-mono text-dark-a0/70 text-sm">
                  <span className="font-semibold ">Password:</span>{" "}
                  {loadingId === p._id
                    ? "Loading..."
                    : visibleId === p._id
                    ? p.password
                    : "••••••••"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-3 text-primary-a20">
                {/* Desktop actions */}
                <div className="hidden sm:flex gap-3">
                  {visibleId === p._id ? (
                    <EyeOff
                      className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                      onClick={() => setVisibleId(null)}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        if (p._id) retrievePassword(p._id);
                      }}
                    />
                  )}
                  <Edit className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                  <Trash2
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => {
                      if (p._id) moveToBin(p._id);
                    }}
                  />
                </div>

                {/* Mobile menu */}
                {/* Mobile menu */}
                <div className="sm:hidden relative">
                  <MoreVertical
                    className="w-5 h-5 cursor-pointer hover:text-primary-a40"
                    onClick={() => {
                      if (p._id) {
                        setOpenMenuId(openMenuId === p._id ? null : p._id);
                      }
                    }}
                  />
                  {openMenuId === p._id && (
                    <div
                      className="fixed z-[999] bg-surface-a10 backdrop-blur-xl rounded-lg shadow-lg border border-surface-tonal-a30"
                      style={{
                        top: "2%",
                        left: "66%",
                        transform: "translateX(-40%)",
                        width: "130px",
                      }}
                    >
                      <button
                        onClick={() => {
                          if (p._id) {
                            if (visibleId === p._id) {
                              setVisibleId(null);
                            } else {
                              retrievePassword(p._id);
                            }
                            setOpenMenuId(null);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-a20 hover:rounded-t-lg w-full text-left"
                      >
                        {visibleId === p._id ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {visibleId === p._id ? "Hide" : "Show"}
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-a20 w-full text-left"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (p._id) {
                            moveToBin(p._id);
                            setOpenMenuId(null);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-danger-a0 hover:bg-surface-a20 hover:rounded-b-lg w-full text-left"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
