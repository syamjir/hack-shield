"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { checkBreach } from "@/lib/passwordUtils";

export default function BreachChecker({ breachPassword }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"safe" | "breached" | "idle">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (breachPassword) setPassword(breachPassword);
  }, [breachPassword]);

  const handleCopy = async () => {
    if (password) await navigator.clipboard.writeText(password);
  };

  const handleCheck = async () => {
    try {
      if (!password) return alert("Please enter a password before proceeding.");
      setIsLoading(true);
      const isBreached = await checkBreach(password);
      setStatus(isBreached ? "breached" : "safe");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface-a10)] rounded-xl p-5 shadow-md">
      <h3 className="font-semibold text-[var(--primary-a20)] mb-3">
        Password Breach Check
      </h3>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 bg-surface-a0  rounded-sm">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password to check"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" border-none pr-20"
          />

          {/* Show/Hide Button */}
          {password && (
            <>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--primary-a10)] hover:text-[var(--primary-a20)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary-a10)] hover:text-[var(--primary-a20)]"
              >
                <Copy size={16} />
              </button>
            </>
          )}
        </div>

        {/* Check Button */}
        <Button
          onClick={handleCheck}
          className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Checking...
            </>
          ) : (
            <>
              <ShieldCheck size={18} /> Check
            </>
          )}
        </Button>
      </div>

      {/* Status Display */}
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 flex items-center gap-2 text-sm"
        >
          {status === "safe" ? (
            <>
              <Shield className="text-green-500" size={16} /> Safe — no breach
              records found.
            </>
          ) : (
            <>
              <ShieldAlert className="text-red-500" size={16} /> Breached —
              password exists in leak database.
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
