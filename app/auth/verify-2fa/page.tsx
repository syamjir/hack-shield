"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, KeyRound, Loader2, Repeat } from "lucide-react";
import AuthCard from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "email";
  const otpToken = searchParams.get("token");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      // Call your API to verify OTP
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: enteredOtp, token: otpToken }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully");
        router.push("/auth/login"); // redirect after successful verification
      } else {
        throw new Error(data.error || "Invalid OTP");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      toast.error(message);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      // call resend OTP API
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otpToken }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      const data = await res.json();
      console.log(data);
      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-a0 text-light-a0 px-6">
      <motion.div
        className="absolute top-26 left-36 text-primary-a20/40"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <KeyRound size={64} />
      </motion.div>
      <AuthCard
        title="Verify Your Identity"
        subtitle={`Enter the 6-digit code sent to your ${method}`}
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
          className="w-full mt-2 bg-success-a0 hover:bg-success-a10 text-light-a0"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <CheckCircle size={18} /> Verify
            </>
          )}
        </Button>

        <Button
          onClick={handleResend}
          variant="ghost"
          className=" mt-2 text-primary-a10"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              {" "}
              <Loader2 size={18} className="animate-spin" /> Resending...
            </>
          ) : (
            <>
              <Repeat size={18} /> Resend Code
            </>
          )}
        </Button>
      </AuthCard>
    </div>
  );
}
