"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/ui/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: Validate login
  const handleLogin = () => {
    if (!email || !password) return alert("Please enter email & password");
    // Normally you would verify credentials here (via backend)
    setStep("verify");
  };

  // Step 2: Validate OTP (2FA)
  const handleVerify = () => {
    if (otp === "123456") {
      router.push("/dashboard");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-surface-a0 text-light-a0 px-6 overflow-hidden">
      {/* Floating background icons */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-24 left-10 text-primary-a20/40"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Lock size={48} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-16 text-primary-a20/30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <ShieldCheck size={56} />
        </motion.div>
      </motion.div>

      {step === "login" ? (
        <AuthCard
          title="Welcome Back 👋"
          subtitle="Login to continue to your secure dashboard"
        >
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-a20 text-light-a0 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary-a20"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface-a20 text-light-a0 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary-a20"
            />
            <Button
              onClick={handleLogin}
              className="w-full mt-4 bg-primary-a20 hover:bg-primary-a30 text-light-a0 flex items-center justify-center gap-2 rounded-xl"
            >
              <LogIn size={18} />
              Continue
            </Button>
          </div>
        </AuthCard>
      ) : (
        <AuthCard
          title="Two-Factor Verification 🔐"
          subtitle="Enter the 6-digit code sent to your email or phone"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-surface-a20 text-light-a0 rounded-md px-3 py-2 outline-none text-center text-lg tracking-widest focus:ring-2 focus:ring-primary-a20"
            />

            <Button
              onClick={handleVerify}
              className="w-full mt-6 bg-success-a10 hover:bg-success-a20 text-light-a0 flex items-center justify-center gap-2 rounded-xl"
            >
              <ShieldCheck size={18} />
              Verify & Login
            </Button>

            <p className="text-xs text-dark-a0/60 mt-4">
              Didn’t receive code?{" "}
              <span className="text-primary-a20 cursor-pointer hover:underline">
                Resend
              </span>
            </p>
          </motion.div>
        </AuthCard>
      )}

      {/* Footer */}
      <footer className="mt-12 text-xs text-dark-a0/60 text-center">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary-a20">PassKeeper</span> — All
        rights reserved.
      </footer>
    </div>
  );
}
