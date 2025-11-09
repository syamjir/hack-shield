"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Identity } from "@/types";

export default function IdentitiesBinPage() {
  const [binIdentities, setBinIdentities] = useState<Identity[]>([
    {
      _id: "2",
      fullName: "Jane Doe",
      email: "jane@example.com",
      address: "456 Elm Street",
      city: "Los Angeles",
      country: "USA",
    },
  ]);

  const [restoringId, setRestoringId] = useState<string | null>(null);

  const restoreIdentity = async (id: string) => {
    try {
      setRestoringId(id);
      await new Promise((res) => setTimeout(res, 600));

      const restored = binIdentities.find((i) => i._id === id);
      if (!restored) return;

      setBinIdentities((prev) => prev.filter((i) => i._id !== id));
      toast.success(`Restored "${restored.fullName}"`);
    } catch {
      toast.error("Failed to restore");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary-a20">Identity Bin</h1>

      {binIdentities.length === 0 ? (
        <p className="text-dark-a0/60 text-sm">No deleted identities.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {binIdentities.map((identity, i) => (
            <motion.div
              key={identity._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-primary-a20">
                {identity.fullName}
              </h3>
              <p className="text-sm text-dark-a0/70">{identity.email}</p>

              {identity.address && (
                <p className="text-sm text-dark-a0/60 mt-1">
                  {identity.address}, {identity.city}, {identity.country}
                </p>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => restoreIdentity(identity._id!)}
                  disabled={restoringId === identity._id}
                  className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  {restoringId === identity._id ? "Restoring..." : "Restore"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
