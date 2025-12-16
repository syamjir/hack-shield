"use client";

import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Fingerprint,
  RefreshCcw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import PasswordGenerator from "@/components/ui/dashboard/PasswordGenerator";
import BreachChecker from "@/components/ui/dashboard/BreachChecker";
import { useState } from "react";

export function SecurityClient() {
  const [biometric, setBiometric] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [breachPassword, setBreachPassword] = useState("");

  // const fadeVariants: Variants = {
  //   hidden: { opacity: 0, y: 15 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  //   },
  // };

  return (
    <>
      {/* ===== SECURITY TOOLS ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        >
          <PasswordGenerator onBreachPassword={setBreachPassword} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        >
          <BreachChecker breachPassword={breachPassword} />
        </motion.div>
      </div>

      {/* ===== SECURITY SETTINGS ===== */}
      {/* <motion.div
        className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-[var(--primary-a20)] w-5 h-5" />
          <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
            Security Settings
          </h2>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-[var(--surface-a20)]">
          <span>Enable Two-Factor Authentication (2FA)</span>
          <Switch checked={twoFA} onCheckedChange={setTwoFA} />
        </div>

        <div className="flex justify-between items-center py-2 border-b border-[var(--surface-a20)]">
          <span>Enable Biometric Unlock</span>
          <Switch checked={biometric} onCheckedChange={setBiometric} />
        </div>

        <div className="flex justify-between items-center py-2">
          <span>Last Security Review</span>
          <span className="text-[var(--surface-a40)]">Oct 20, 2025</span>
        </div>

        <Button
          size="sm"
          className="mt-4 bg-[var(--primary-a20)] text-white hover:bg-[var(--primary-a30)] flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Run Security Check
        </Button>
      </motion.div> */}

      {/* ===== SECURITY ALERTS ===== */}
      {/* <motion.div
        className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-yellow-500 w-5 h-5" />
          <h2 className="text-lg font-semibold text-[var(--primary-a20)]">
            Recent Security Alerts
          </h2>
        </div>

        <ul className="text-sm text-[var(--surface-a40)] space-y-3">
          <li className="flex justify-between items-center border-b border-[var(--surface-a20)] pb-2">
            <span>New login detected from Chrome on Windows</span>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </li>
          <li className="flex justify-between items-center border-b border-[var(--surface-a20)] pb-2">
            <span>3 passwords reused across different sites</span>
            <Button size="sm" variant="outline">
              Fix Now
            </Button>
          </li>
          <li className="flex justify-between items-center">
            <span>Breach report available for LinkedIn account</span>
            <Button size="sm" variant="outline">
              Check
            </Button>
          </li>
        </ul>
      </motion.div> */}
    </>
  );
}
