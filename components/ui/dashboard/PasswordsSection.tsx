"use client";
import { useState } from "react";
import { Eye, EyeOff, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiLock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import PasswordValidator from "@/lib/passwordValidator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { useSession } from "next-auth/react";
import calculateStrength from "@/lib/passwordStrength";
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [newPassword, setNewPassword] = useState<Password>({
    site: "",
    username: "",
    password: "",
    strength: "Weak",
    websiteUri: "",
  });
  // validator
  const validator = new PasswordValidator();

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
        strength: "",
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
          <h2 className="text-xl sm:text-2xl font-bold text-primary-a20">
            Password Vault
          </h2>
          <p className="text-sm text-dark-a0/50">
            Manage all your saved passwords securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-primary-a20 hover:bg-primary-a30 text-white rounded-xl flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Password
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-surface-a0 border border-surface-a20 rounded-xl max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary-a20">
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
                className=" bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
              />
              {newPassword.websiteUri &&
                !validator.isValidUri(newPassword.websiteUri) && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 "
                  >
                    {/* Optional icon for emphasis */}
                    <Shield size={16} className="text-danger-a10" /> Please
                    enter a valid website url
                  </motion.p>
                )}
              <Input
                placeholder="Website URL (optional)"
                value={newPassword.websiteUri || ""}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, websiteUri: e.target.value })
                }
                className=" bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
              />
              <Input
                placeholder="Username / Email"
                value={newPassword.username}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, username: e.target.value })
                }
                className=" bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
              />
              {newPassword.password && newPassword.strength && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={` pl-4  flex items-center gap-2 text-sm text-dark-a0/70  `}
                >
                  {newPassword.strength === "Strong" ? (
                    <FiCheckCircle className="text-success-a10" size={16} />
                  ) : newPassword.strength === "Medium" ? (
                    <FiAlertCircle className="text-warning-a10" size={16} />
                  ) : (
                    <FiLock className="text-danger-a10" size={16} />
                  )}
                  Strength: {newPassword.strength}
                </motion.p>
              )}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={newPassword.password}
                  onChange={(e) =>
                    setNewPassword({
                      ...newPassword,
                      password: e.target.value,
                      strength: validator.calculateStrength(e.target.value),
                    })
                  }
                  className=" bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
                />
                {/* Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-a0/50 hover:text-primary-a10/90 bg-surface-tonal-a0 rounded-2xl  p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="text-primary-a0" size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={Boolean(
                  !newPassword.site ||
                    !newPassword.username ||
                    !newPassword.password ||
                    (newPassword.websiteUri &&
                      !validator.isValidUri(newPassword.websiteUri))
                )}
                onClick={addPassword}
                className="w-full sm:w-auto bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
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
