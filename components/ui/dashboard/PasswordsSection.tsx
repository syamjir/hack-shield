"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
// import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Password {
  _id?: string;
  userId?: string;
  site: string;
  username: string;
  password: string;
  strength: "Weak" | "Medium" | "Strong";
  websiteUri?: string;
}

export default function PasswordsSection() {
  // const { data: session } = useSession();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [newPassword, setNewPassword] = useState<Password>({
    site: "",
    username: "",
    password: "",
    strength: "Weak",
    websiteUri: "",
  });

  // ✅ Password strength checker
  const calculateStrength = (
    password: string
  ): "Weak" | "Medium" | "Strong" => {
    if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password))
      return "Strong";
    if (password.length >= 6) return "Medium";
    return "Weak";
  };

  // ✅ Add new password (API call)
  const addPassword = async () => {
    if (
      !newPassword.site ||
      !newPassword.username ||
      !newPassword.password ||
      !session?.user?.id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const strength = calculateStrength(newPassword.password);

    try {
      const res = await fetch("/api/passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPassword,
          userId: "usedid",
          strength,
        }),
      });

      if (!res.ok) throw new Error("Failed to save password");
      const data = await res.json();

      setPasswords((prev) => [...prev, data]);
      setNewPassword({
        site: "",
        username: "",
        password: "",
        strength: "Weak",
        websiteUri: "",
      });
      toast.success("Password saved successfully!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <section className="px-1 sm:px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary-a20)]">
            Password Vault
          </h2>
          <p className="text-sm text-[var(--surface-a40)]">
            Manage all your saved passwords securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Password
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[var(--surface-a0)] border border-[var(--surface-a20)] rounded-xl max-w-[90vw] sm:max-w-md">
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
              />
              <Input
                placeholder="Website URL (optional)"
                value={newPassword.websiteUri || ""}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, websiteUri: e.target.value })
                }
              />
              <Input
                placeholder="Username / Email"
                value={newPassword.username}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, username: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Enter Password"
                value={newPassword.password}
                onChange={(e) =>
                  setNewPassword({
                    ...newPassword,
                    password: e.target.value,
                    strength: calculateStrength(e.target.value),
                  })
                }
              />
              <p
                className={`text-sm ${
                  newPassword.strength === "Strong"
                    ? "text-green-500"
                    : newPassword.strength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                Strength: {newPassword.strength}
              </p>
            </div>

            <DialogFooter>
              <Button
                onClick={addPassword}
                className="w-full sm:w-auto bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg"
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
