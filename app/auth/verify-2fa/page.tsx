"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import AuthCard from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Verify2FAPage() {
  const router = useRouter();
  const method = useSearchParams().get("method");
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp === "123456") {
      router.push("/login");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-a0 text-light-a0 px-6">
      <AuthCard
        title="Verify Your Identity"
        subtitle={`Enter the 6-digit code sent to your ${method}`}
      >
        <input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="bg-surface-a20 text-light-a0 rounded-md px-3 py-2 outline-none text-center text-lg tracking-widest focus:ring-2 focus:ring-primary-a20"
        />
        <Button
          onClick={handleVerify}
          className="w-full mt-6 bg-success-a10 hover:bg-success-a20 text-light-a0"
        >
          Verify
        </Button>
      </AuthCard>
    </div>
  );
}
