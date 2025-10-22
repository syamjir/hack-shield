"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, LogIn, Shield, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/input";
import { LoginValidation } from "@/lib/loginValidation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "verify">("verify");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const validation = new LoginValidation(email, password);

  // Handle input change for each OTP box
  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      // only allow digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next input
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (value && nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Step 1: Validate login and send OTP
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log(data);
      alert(data.message || "OTP sent successfully!");
      setStep("verify");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP code");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log(data);
      alert(data.message);
      router.push("/home");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    } finally {
      setIsLoading(false);
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

      {/* Step 1: Login */}
      {step === "login" ? (
        <AuthCard
          title="Welcome Back 👋"
          subtitle="Login to continue to your secure dashboard"
        >
          <div className="flex flex-col gap-4">
            {/* Error Message */}
            {!validation.emailValid() && email && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 m-[-6] "
              >
                {/* Optional icon for emphasis */}
                <Shield size={16} className="text-danger-a10" /> Please enter a
                valid email address
              </motion.p>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
            />
            {/* Error Message */}
            {!validation.passwordValid() && password && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 m-[-6] "
              >
                {/* Optional icon for emphasis */}
                <Shield size={16} className="text-danger-a10" /> Password must
                be at least 8 characters long.
              </motion.p>
            )}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
            />
            <Button
              onClick={handleLogin}
              disabled={
                !email ||
                !password ||
                !validation.emailValid() ||
                !validation.passwordValid()
              }
              className="w-full mt-4 bg-primary-a20 hover:bg-primary-a30 text-light-a0 flex items-center justify-center gap-2 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Logging...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Continue
                </>
              )}
            </Button>
          </div>
        </AuthCard>
      ) : (
        // Step 2: OTP Verify
        <AuthCard
          title="Two-Factor Verification 🔐"
          subtitle="Enter the 6-digit code sent to your email or phone"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((num, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  className=" w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12  bg-surface-a20 text-dark-a0 rounded-md text-center text-xl focus:ring-2 focus:ring-primary-a20"
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.some((digit) => digit === "")}
              className="w-full mt-6 bg-success-a10 hover:bg-success-a20 text-light-a0 flex items-center justify-center gap-2 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Verify & Login
                </>
              )}
            </Button>

            <p className="text-xs text-dark-a0/60 mt-4">
              Didn’t receive code?{" "}
              <span
                className="text-primary-a20 cursor-pointer hover:underline"
                onClick={handleLogin}
              >
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
