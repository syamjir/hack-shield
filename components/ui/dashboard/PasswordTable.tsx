"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Globe,
  MoreVertical,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { BinType, Login } from "@/app/dashboard/page";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { FiAlertCircle, FiCheckCircle, FiLock } from "react-icons/fi";
import { Input } from "../input";
import PasswordValidator from "@/lib/passwordValidator";

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
  const [editingPassword, setEditingPassword] = useState<Login | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const validator = new PasswordValidator();

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
      setEditingPassword(retrievedPassword);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const editPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      site: formData.get("site") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      websiteUri: formData.get("websiteUri") as string,
    };
    console.log(updatedData);
    try {
      if (!editingPassword) return;
      setIsEditLoading(true);
      const strength = validator.calculateStrength(updatedData.password);
      const res = await fetch(
        `/api/passwords/${editingPassword._id}/edit-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updatedData, strength }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setVisibleId(null);
      setPasswords((prev) =>
        prev.map((p) => (p._id === data.data._id ? data.data : p))
      );

      toast.success("Password updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsEditLoading(false);
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
                  <Edit
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => {
                      if (p._id) {
                        retrievePassword(p._id);
                        setIsEditModalOpen(true);
                      }
                    }}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => {
                      if (p._id) moveToBin(p._id);
                    }}
                  />
                </div>

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
                        onClick={() => {
                          if (p._id) {
                            setOpenMenuId(null);
                            retrievePassword(p._id);
                            setIsEditModalOpen(true);
                          }
                        }}
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
      {/* Editing form */}
      {isEditModalOpen && editingPassword && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-surface-a0 border border-surface-a20 rounded-xl max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary-a20">
                Edit Password
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={(e) => editPassword(e)} className="space-y-4 py-4">
              {/* Site */}
              <Input
                placeholder="Site Name"
                name="site"
                defaultValue={editingPassword.site}
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />

              {/* Website URL */}
              <Input
                placeholder="Website URL (optional)"
                name="websiteUri"
                defaultValue={editingPassword.websiteUri}
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />

              {/* Username */}
              <Input
                placeholder="Username / Email"
                name="username"
                defaultValue={editingPassword.username}
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />

              {/* Password Input with toggle */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  defaultValue={editingPassword.password}
                  onChange={(e) =>
                    setEditingPassword({
                      ...editingPassword,
                      password: e.target.value,
                      strength: validator.calculateStrength(e.target.value),
                    })
                  }
                  className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-a0/50 hover:text-primary-a10/90 bg-surface-tonal-a0 rounded-2xl p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="text-primary-a0" size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {editingPassword.password && editingPassword.strength && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-4 flex items-center gap-2 text-sm text-dark-a0/70"
                >
                  {editingPassword.strength === "Strong" ? (
                    <FiCheckCircle className="text-success-a10" size={16} />
                  ) : editingPassword.strength === "Medium" ? (
                    <FiAlertCircle className="text-warning-a10" size={16} />
                  ) : (
                    <FiLock className="text-danger-a10" size={16} />
                  )}
                  Strength: {editingPassword.strength}
                </motion.p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-dark-a0 rounded-lg"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    !editingPassword.site ||
                    !editingPassword.username ||
                    !editingPassword.password ||
                    (!!editingPassword.websiteUri &&
                      !validator.isValidUri(editingPassword.websiteUri))
                  }
                  className="w-full sm:w-auto bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
                >
                  {isEditLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
