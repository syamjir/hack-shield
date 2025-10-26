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
          <h2 className="text-2xl font-bold text-[var(--primary-a20)]">
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
    </section>
  );
}
