"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Shield,
  Mail,
  Smartphone,
  UserPlus,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/signupValidation";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "@/contexts/UserContext";

export interface Form {
  email: string;
  password: string;
  phone: string;
}

export default function SignupPage() {
  const { user } = useUserContext();
  const emailFromClerk = user?.emailAddresses[0].emailAddress;
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "phone" | null
  >(null);
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (emailFromClerk) {
      setForm((form) => ({
        ...form,
        email: emailFromClerk,
      }));
    }
  }, [emailFromClerk]);

  const validation = new SignupValidation(form, confirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (form.password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (!selectedMethod) return toast.error("Please select a 2FA method");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selectedMethod }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      const data = await res.json();
      console.log(data);
      toast.success(data.message);
      // Redirect to verify page
      router.push(
        `/auth/verify-2fa?token=${data.otpToken}&method=${selectedMethod}`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-surface-a0 text-light-a0 px-6 pt-12 overflow-hidden">
      {/* Floating Shield Animation */}
      <motion.div
        className="absolute top-16 left-8 text-primary-a20/40"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Shield size={64} />
      </motion.div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-both-white-a0/5 border border-surface-a20 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-primary-a20 mb-2"
        >
          Create Account
        </motion.h1>

        <p className="text-dark-a0/70 text-sm mb-6">
          Secure your account with two-factor authentication
        </p>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4 mb-6 text-left">
          {/* Error Message */}
          {!validation.emailValid() && form.email && (
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
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={!!emailFromClerk}
            className=" bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
          />
          {/* Error Message */}
          {!validation.phoneValid() && form.phone && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 m-[-6] "
            >
              {/* Optional icon for emphasis */}
              <Shield size={16} className="text-danger-a10" /> Please enter a
              valid phone number
            </motion.p>
          )}
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
          />
          {/* Password Error */}
          {!validation.passwordValid() && form.password && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1 text-sm text-dark-a0/70 pl-2"
            >
              <span className="flex items-center gap-2 ">
                <Shield size={16} className="text-danger-a10" /> Password must:
              </span>
              <ul className="list-disc text-dark-a0/60 ml-8">
                <li>Be at least 8 characters</li>
                <li>Include uppercase & lowercase letters</li>
                <li>Include a number</li>
                <li>Include a special character (e.g., !@#$%)</li>
              </ul>
            </motion.div>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 pr-10 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
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
          {/* Error Message */}
          {!validation.passwordMatch() && confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 m-[-6] "
            >
              {/* Optional icon for emphasis */}
              <Shield size={16} className="text-danger-a10" /> Passwords must
              match to continue
            </motion.p>
          )}
          <Input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-0.5 focus-visible:ring-primary-a0"
          />
        </div>

        {/* 2FA Selection */}
        <div className="mb-6">
          <p className="text-sm text-dark-a0/60 mb-2">Choose 2FA method:</p>
          <div className="flex gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                aria-selected={selectedMethod === "email"}
                onClick={() => setSelectedMethod("email")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-shadow ${
                  selectedMethod === "email"
                    ? "bg-primary-a20/90 text-light-a0 shadow-lg hover:bg-primary-a10"
                    : "bg-surface-a20 text-dark-a0 hover:shadow-md hover:bg-primary-a10/20"
                }`}
              >
                <Mail size={16} /> Email
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                aria-selected={selectedMethod === "phone"}
                // onClick={() => setSelectedMethod("phone")}
                onClick={() =>
                  toast.error(
                    "Phone verification is temporarily unavailable due to DLT registration requirements. Please use email verification for now."
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-shadow ${
                  selectedMethod === "phone"
                    ? "bg-primary-a20/90 text-light-a0 shadow-lg hover:bg-primary-a10"
                    : "bg-surface-a20 text-dark-a0 hover:shadow-md hover:bg-primary-a10/20"
                }`}
              >
                <Smartphone size={16} /> Phone
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <Button
            onClick={handleSignup}
            className="w-full bg-primary-a20 hover:bg-primary-a30 text-light-a0 rounded-xl flex items-center justify-center gap-2 px-6 py-3 shadow-lg"
            disabled={
              !form.email ||
              !form.password ||
              !confirmPassword ||
              !validation.passwordMatch() ||
              !selectedMethod
            }
          >
            {isLoading ? (
              <>
                {" "}
                <Loader2 size={18} className="animate-spin" /> Signing up...
              </>
            ) : (
              <>
                <UserPlus size={18} /> Continue
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-xs text-dark-a0/60 text-center">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary-a20">PassKeeper</span> —
        Securing Your Digital Life.
      </footer>
    </div>
  );
}
