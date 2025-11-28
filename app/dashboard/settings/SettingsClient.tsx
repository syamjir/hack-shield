"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Cloud, User, Moon, Lock } from "lucide-react";

import { IUser } from "@/models/User";
import { useUserContext } from "@/contexts/UserContext";
import { useTheme } from "next-themes";
import { updatePreference } from "./settingServerActions";
import { toast } from "sonner";
import PasswordResetModel from "@/components/ui/PasswordResetModel";

export default function SettingsClient({ user }: { user: IUser }) {
  const { theme, setTheme } = useTheme();
  const [biometric, setBiometric] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);

  const { role, autoLock, setAutoLock } = useUserContext();

  const isDark = theme === "dark";

  // === UPDATE FUNCTION ===
  const handleUpdate = async (newTheme: string, lockValue: boolean) => {
    try {
      const data = await updatePreference({
        mode: newTheme,
        auto_lock: lockValue,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  // === WHEN USER CHANGES DARK MODE ===
  const handleDarkMode = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    setTheme(newTheme);
    handleUpdate(newTheme, autoLock);
  };

  // === WHEN USER CHANGES AUTO-LOCK ===
  const handleAutoLock = (value: boolean) => {
    setAutoLock(value);
    handleUpdate(theme as string, value);
  };

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="space-y-10"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--primary-a20)] mb-2 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[var(--primary-a20)]" />
          Settings
        </h1>
        <p className="text-[var(--surface-a40)]">
          Manage your preferences, security, and account settings.
        </p>
      </div>

      {/* ===== SETTINGS SECTIONS ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ACCOUNT */}
        <motion.div
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="text-[var(--primary-a20)] w-5 h-5" />
            <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
              Account
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[var(--surface-a40)]">
            <p>
              Email:{" "}
              <span className="font-semibold text-[var(--primary-a20)]">
                {user?.email}
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenPasswordResetModal(true)}
                className="border-[var(--primary-a20)] text-[var(--primary-a20)] hover:bg-[var(--primary-a20)] hover:text-white"
              >
                Change Password
              </Button>
              <Button
                disabled={role === "Admin"}
                size="sm"
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>

        {/* PREFERENCES */}
        <motion.div
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-[var(--primary-a20)] w-5 h-5" />
            <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
              Preferences
            </h2>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--surface-a20)]">
            <span>Dark Mode</span>
            <Switch checked={isDark} onCheckedChange={handleDarkMode} />
          </div>

          <div className="flex justify-between items-center py-2">
            <span>Auto-lock after inactivity</span>
            <Switch checked={autoLock} onCheckedChange={handleAutoLock} />
          </div>
        </motion.div>

        {/* SECURITY */}
        <motion.div
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-[var(--primary-a20)] w-5 h-5" />
            <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
              Security
            </h2>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--surface-a20)]">
            <span>Enable Biometric Unlock</span>
            <Switch checked={biometric} onCheckedChange={setBiometric} />
          </div>

          <div className="flex justify-between items-center py-2">
            <span>Two-Factor Authentication (2FA)</span>
            <Button
              size="sm"
              variant="outline"
              className="border-[var(--primary-a20)] text-[var(--primary-a20)] hover:bg-[var(--primary-a20)] hover:text-white"
            >
              Configure
            </Button>
          </div>
        </motion.div>

        {/* BACKUP */}
        <motion.div
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="text-[var(--primary-a20)] w-5 h-5" />
            <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
              Backup & Sync
            </h2>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--surface-a20)]">
            <span>Enable Cloud Sync</span>
            <Switch checked={cloudSync} onCheckedChange={setCloudSync} />
          </div>

          <div className="flex justify-between items-center py-2">
            <span>Last Backup:</span>
            <span className="text-[var(--surface-a40)]">Oct 25, 2025</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="mt-4 border-[var(--primary-a20)] text-[var(--primary-a20)] hover:bg-[var(--primary-a20)] hover:text-white"
          >
            Backup Now
          </Button>
        </motion.div>
      </div>
      <PasswordResetModel
        openPasswordResetModal={openPasswordResetModal}
        setOpenPasswordResetModal={setOpenPasswordResetModal}
      />
    </motion.div>
  );
}
