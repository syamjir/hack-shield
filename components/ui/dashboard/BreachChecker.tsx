"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert } from "lucide-react";
import { checkBreach } from "@/lib/passwordUtils";

export default function BreachChecker() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"safe" | "breached" | "idle">("idle");

  const handleCheck = async () => {
    const isBreached = await checkBreach(password);
    setStatus(isBreached ? "breached" : "safe");
  };

  return (
    <div className="bg-[var(--surface-a10)] rounded-xl p-5 shadow-md">
      <h3 className="font-semibold text-[var(--primary-a20)] mb-3">
        Password Breach Check
      </h3>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter password to check"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[var(--surface-a0)] border-none"
        />
        <Button
          onClick={handleCheck}
          className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)]"
        >
          Check
        </Button>
      </div>

      {status !== "idle" && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {status === "safe" ? (
            <>
              <Shield className="text-green-500" size={16} /> Password is safe
            </>
          ) : (
            <>
              <ShieldAlert className="text-red-500" size={16} /> Password found
              in breach database
            </>
          )}
        </div>
      )}
    </div>
  );
}
