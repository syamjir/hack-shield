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

export default function SecurityPage() {
  const [biometric, setBiometric] = useState(false);
  const [twoFA, setTwoFA] = useState(true);

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
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
          Security Center 🛡️
        </h1>
        <p className="text-[var(--surface-a40)]">
          Review your account’s protection level, manage security tools, and
          take proactive steps.
        </p>
      </div>

      {/* ===== SECURITY HEALTH OVERVIEW ===== */}
      <motion.div className="grid md:grid-cols-3 gap-6" variants={fadeVariants}>
        {[
          {
            title: "Password Strength",
            value: "Strong",
            icon: <Lock className="text-green-500 w-5 h-5" />,
            color: "border-green-500/40 bg-green-500/10",
          },
          {
            title: "Breach Exposure",
            value: "0 Compromised",
            icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
            color: "border-yellow-500/40 bg-yellow-500/10",
          },
          {
            title: "Security Score",
            value: "92 / 100",
            icon: <ShieldCheck className="text-[var(--primary-a20)] w-5 h-5" />,
            color: "border-[var(--primary-a20)]/40 bg-[var(--primary-a20)]/10",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`rounded-xl p-5 border ${card.color} flex flex-col items-start justify-between shadow-sm hover:shadow-md transition`}
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {card.icon}
              <h3 className="text-sm text-[var(--surface-a40)]">
                {card.title}
              </h3>
            </div>
            <p className="text-lg font-semibold text-[var(--primary-a20)]">
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== SECURITY TOOLS ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        >
          <PasswordGenerator />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] rounded-xl p-6 shadow-sm"
        >
          <BreachChecker />
        </motion.div>
      </div>

      {/* ===== SECURITY SETTINGS ===== */}
      <motion.div
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
      </motion.div>

      {/* ===== SECURITY ALERTS ===== */}
      <motion.div
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
      </motion.div>
    </motion.div>
  );
}
