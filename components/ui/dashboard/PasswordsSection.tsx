"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
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

export default function PasswordsSection() {
  const [passwords, setPasswords] = useState([
    { id: 1, site: "Google", username: "user@gmail.com", strength: "Strong" },
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
    <section>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary-a20)]">
            Passwords Vault
          </h2>
          <p className="text-sm text-[var(--surface-a40)]">
            Manage all your saved passwords securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Password
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 text-[var(--surface-a40)] w-4 h-4" />
        <Input
          type="text"
          placeholder="Search passwords..."
          className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-xl"
        />
      </div>

      {/* Password List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passwords.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{item.site}</h3>
              <p className="text-sm text-[var(--surface-a40)]">
                {item.username}
              </p>
            </div>
            <div className="flex gap-2">
              <Eye className="w-4 h-4 cursor-pointer" />
              <Edit className="w-4 h-4 cursor-pointer" />
              <Trash2 className="w-4 h-4 cursor-pointer text-red-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
