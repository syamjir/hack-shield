"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Lock } from "lucide-react";
import TurnstileCaptcha from "@/components/ui/TurnstileCaptcha";

export default function Home() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-surface-a0 text-dark-a0 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[550px] h-[550px] bg-primary-a20/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-xl bg-both-white-a0/5 border border-surface-a30 rounded-2xl p-8 w-[90%] max-w-md shadow-[0_0_30px_rgba(160,110,206,0.2)] flex flex-col items-center text-center"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <Lock
            className="text-primary-a0 drop-shadow-[0_0_6px_rgba(160,110,206,0.7)]"
            size={26}
          />
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary-a10 to-primary-a30 bg-clip-text text-transparent">
            Access Verification
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-dark-a0/50 mb-8 text-sm leading-relaxed">
          Complete the CAPTCHA verification below to proceed securely.
        </p>

        {/* CAPTCHA Section */}
        <div className="w-full flex justify-center mb-8">
          <TurnstileCaptcha />
        </div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex mt-4 flex-col items-center space-y-4"
        >
          <h3 className="text-sm font-medium text-dark-a0/50">
            Scan to open the app on your phone
          </h3>
          <div className="bg-both-white-a0 p-4 rounded-2xl shadow-[0_0_20px_rgba(171,126,212,0.15)]">
            <QRCode value={appUrl} size={160} fgColor="#333333" />
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-dark-a0/50 text-xs z-10">
        © {new Date().getFullYear()} SecureApp — Safe & Verified Access
      </footer>
    </main>
  );
}
