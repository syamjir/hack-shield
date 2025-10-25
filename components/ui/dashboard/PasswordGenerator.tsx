"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { generatePassword } from "@/lib/passwordUtils";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);

  const handleGenerate = () => setPassword(generatePassword(length));

  const handleCopy = async () => {
    if (password) await navigator.clipboard.writeText(password);
  };

  return (
    <div className="bg-[var(--surface-a10)] rounded-xl p-5 shadow-md">
      <h3 className="font-semibold text-[var(--primary-a20)] mb-3">
        Password Generator
      </h3>
      <div className="flex items-center gap-2 mb-3">
        <Input
          type="number"
          min={8}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-20 text-center bg-[var(--surface-a0)] border-none"
        />
        <Button
          onClick={handleGenerate}
          className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)]"
        >
          <RefreshCw size={16} className="mr-2" /> Generate
        </Button>
      </div>

      <div className="flex items-center justify-between bg-[var(--surface-a0)] rounded-lg p-3">
        <span className="truncate text-[var(--surface-a50)]">
          {password || "Click Generate"}
        </span>
        {password && (
          <Button
            size="sm"
            onClick={handleCopy}
            className="bg-transparent text-[var(--primary-a20)] hover:text-[var(--primary-a30)]"
          >
            <Copy size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
