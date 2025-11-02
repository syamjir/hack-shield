"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Plus, Save, Shield } from "lucide-react";
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
import { toast } from "sonner";
import { Login } from "@/app/dashboard/page";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
interface PasswordsSectionProp {
  setPasswords: React.Dispatch<React.SetStateAction<Login[]>>;
}

export default function PasswordsSection({
  setPasswords,
}: PasswordsSectionProp) {
  const { isSignedIn } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<Login>({
    site: "",
    username: "",
    password: "",
    strength: "Weak",
    websiteUri: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  // validator
  const validator = new PasswordValidator();

  // ✅ Add new password (API call)
  const addPassword = async () => {
    if (
      !newPassword.site ||
      !newPassword.username ||
      !newPassword.password ||
      !newPassword.strength
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!isSignedIn) {
      toast.error("Please log in first");
      router.push("/welcome");
      return;
    }

    const strength = validator.calculateStrength(newPassword.password);

    try {
      setIsLoading(true);
      const res = await fetch("/api/passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPassword,
          strength,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      const data = await res.json();
      console.log(data);
      setPasswords((prev: Login[]) => [...prev, data.password]);
      setNewPassword({
        site: "",
        username: "",
        password: "",
        strength: "Weak",
        websiteUri: "",
      });
      toast.success("Password saved successfully!");
      setDialogOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
