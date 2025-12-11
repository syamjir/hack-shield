"use server";
import { AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";
import { whoAmI } from "../settings/settingServerActions";
import { SecurityClient } from "./SecurityClient";
import { getHealthOverView } from "@/server_actions/healthOverview";

export default async function SecurityPage() {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) {
    return (
      <div className="p-6 text-red-500">Unauthorized. Please log in first.</div>
    );
  }

  const { data: user } = await whoAmI(jwt);
  const result = await getHealthOverView(user?._id);

  const colorMap = {
    Strong: "success-a0",
    Medium: "warning-a0",
    Weak: "danger-a0",
  };

  const healthOverView = result[0] ?? result[0];
  const lockColor = colorMap[healthOverView.passwordStrength] || "danger-a0";

  return (
    <div className="space-y-10">
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

      <div className="grid md:grid-cols-3 gap-6">
        {/* <div className="grid md:grid-cols-3 gap-6" variants={fadeVariants}> */}
        {[
          {
            title: "Password Strength",
            value: healthOverView.passwordStrength,
            icon: <Lock className={`text-${lockColor} w-5 h-5`} />,
            color: `border-[var(--${lockColor})]`,
          },
          {
            title: "Breach Exposure",
            value: healthOverView.breachedCount,
            icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
            color: "border-yellow-500/40 bg-yellow-500/10",
          },
          {
            title: "Security Score",
            value: `${Math.floor(
              healthOverView.totalSecurityScorePercentage
            )} / 100`,
            icon: <ShieldCheck className="text-[var(--primary-a20)] w-5 h-5" />,
            color: "border-[var(--primary-a20)]/40 bg-[var(--primary-a20)]/10",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-xl p-5 border ${card.color} flex flex-col items-start justify-between shadow-sm hover:shadow-md transition`}
            //   whileHover={{ scale: 1.03 }}
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
          </div>
        ))}
      </div>
      <SecurityClient />
    </div>
  );
}
