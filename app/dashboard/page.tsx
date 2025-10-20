"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Plus,
  Search,
  LogOut,
  Settings,
  Shield,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [passwords, setPasswords] = useState([
    { id: 1, site: "Google", username: "dharmi@gmail.com", strength: "Strong" },
    { id: 2, site: "LinkedIn", username: "dharmishta.r", strength: "Medium" },
    { id: 3, site: "GitHub", username: "coder_dharmi", strength: "Weak" },
  ]);

  const [newPassword, setNewPassword] = useState({
    site: "",
    username: "",
    strength: "Strong",
  });

  const addPassword = () => {
    if (!newPassword.site || !newPassword.username) return;
    setPasswords([...passwords, { ...newPassword, id: Date.now() }]);
    setNewPassword({ site: "", username: "", strength: "Strong" });
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface-a0)] text-[var(--surface-a50)]">
      {/* ===== SIDEBAR ===== */}
      <aside className="hidden md:flex flex-col justify-between bg-[var(--surface-a10)] w-64 p-6 border-r border-[var(--surface-a20)]">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Lock className="text-[var(--primary-a20)]" />
            <h1 className="text-xl font-bold text-[var(--primary-a20)]">
              PassKeeper
            </h1>
          </div>

          <nav className="flex flex-col gap-4 text-sm">
            <button className="text-left hover:text-[var(--primary-a20)] transition">
              Dashboard
            </button>
            <button className="text-left hover:text-[var(--primary-a20)] transition">
              Security Reports
            </button>
            <button className="text-left hover:text-[var(--primary-a20)] transition">
              Settings
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-[var(--surface-a40)] hover:text-[var(--primary-a20)] cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-5 md:px-10 py-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--primary-a20)]">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-[var(--surface-a40)]">
              Manage all your stored credentials securely.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5 md:mt-0 bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--surface-a0)] border-[var(--surface-a20)] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-[var(--primary-a20)]">
                  Add New Password
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Input
                  placeholder="Site Name"
                  value={newPassword.site}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, site: e.target.value })
                  }
                  className="bg-[var(--surface-a10)] border-none"
                />
                <Input
                  placeholder="Username / Email"
                  value={newPassword.username}
                  onChange={(e) =>
                    setNewPassword({ ...newPassword, username: e.target.value })
                  }
                  className="bg-[var(--surface-a10)] border-none"
                />
              </div>

              <DialogFooter>
                <Button
                  onClick={addPassword}
                  className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg"
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-[var(--surface-a40)] w-4 h-4" />
          <Input
            type="text"
            placeholder="Search passwords..."
            className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-xl"
          />
        </div>

        {/* PASSWORD TABLE */}
        <div className="overflow-x-auto rounded-2xl bg-[var(--surface-a10)]/50 backdrop-blur-md shadow-md">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-[var(--primary-a20)] text-left border-b border-[var(--surface-a20)]">
                <th className="p-4">Site</th>
                <th className="p-4">Username</th>
                <th className="p-4">Strength</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-[var(--surface-a10)]/70 transition"
                >
                  <td className="p-4 font-semibold">{p.site}</td>
                  <td className="p-4">{p.username}</td>
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
                  <td className="p-4 flex justify-end gap-3 text-[var(--primary-a20)]">
                    <Eye className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                    <Edit className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                    <Trash2 className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
