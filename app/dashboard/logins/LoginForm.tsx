"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, XCircle, Eye, EyeOff, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Login, useDashboard } from "@/contexts/DashboardContext";
import PasswordValidator from "@/lib/passwordValidator";
import { FiAlertCircle, FiCheckCircle, FiLock } from "react-icons/fi";

interface LoginFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Login | null;
}

const defaultLogin: Login = {
  site: "",
  username: "",
  password: "",
  strength: "Weak",
  websiteUri: "",
};

export default function LoginForm({
  isOpen,
  onOpenChange,
  initialData,
}: LoginFormProps) {
  const { setLogins } = useDashboard();
  const isEditing = Boolean(initialData?._id);

  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Login>(defaultLogin);

  // Load initial values on edit
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validator = new PasswordValidator();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.site || !formData.username || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/logins/${initialData!._id}/edit-login`
        : `/api/logins`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save login");
      }

      const data = await res.json();

      setLogins((prev: Login[]) => {
        if (isEditing)
          return prev.map((x) => (x._id === data.data._id ? data.data : x));
        return [...prev, data.data];
      });

      toast.success(isEditing ? "Login updated!" : "Login saved!");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
      if (!isEditing) setFormData(defaultLogin);
    }
  };

  const handleChange = (key: keyof Login, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-a0 border border-surface-a20 rounded-xl max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary-a20">
            {isEditing ? "Edit Login" : "Add New Login"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          {/* Site */}
          <Input
            placeholder="Site Name"
            value={formData.site}
            onChange={(e) => handleChange("site", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Website URL */}
          {formData.websiteUri &&
            !validator.isValidUri(formData.websiteUri) && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 "
              >
                <Shield size={16} className="text-danger-a10" /> Please enter a
                valid website URL
              </motion.p>
            )}
          <Input
            placeholder="Website URL (optional)"
            value={formData.websiteUri}
            onChange={(e) => handleChange("websiteUri", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Username */}
          <Input
            placeholder="Username / Email"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Password with toggle */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formData.password}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("password", value);
                handleChange("strength", validator.calculateStrength(value));
              }}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-a0/50 hover:text-primary-a10 bg-surface-tonal-a0 rounded-2xl p-0.5"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength */}
          {formData.password && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="pl-4 flex items-center gap-2 text-sm text-dark-a0/70"
            >
              {formData.strength === "Strong" ? (
                <FiCheckCircle className="text-success-a10" size={16} />
              ) : formData.strength === "Medium" ? (
                <FiAlertCircle className="text-warning-a10" size={16} />
              ) : (
                <FiLock className="text-danger-a10" size={16} />
              )}
              Strength: {formData.strength}
            </motion.p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-dark-a0 rounded-lg"
            >
              <XCircle size={16} className="mr-1" /> Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !formData.site ||
                !formData.username ||
                !formData.password ||
                (!!formData.websiteUri &&
                  !validator.isValidUri(formData.websiteUri))
              }
              className="w-full sm:w-auto bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> {isEditing ? "Save Changes" : "Save Login"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
