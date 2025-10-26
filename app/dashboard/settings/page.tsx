"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Cloud, User, Moon, Lock } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);

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
        {/* ========== ACCOUNT SETTINGS ========== */}
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
                dharmi@gmail.com
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="border-[var(--primary-a20)] text-[var(--primary-a20)] hover:bg-[var(--primary-a20)] hover:text-white"
              >
                Change Password
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ========== APP PREFERENCES ========== */}
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
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div className="flex justify-between items-center py-2">
            <span>Auto-lock after inactivity</span>
            <Switch checked={autoLock} onCheckedChange={setAutoLock} />
          </div>
        </motion.div>

        {/* ========== SECURITY SETTINGS ========== */}
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

        {/* ========== BACKUP & SYNC ========== */}
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
    </motion.div>
  );
}
