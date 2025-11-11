"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";

export default function IdentitiesBinPage() {
  const { bins, identities, setIdentities } = useDashboard();

  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const binIdentities = bins.identities;

  const restoreIdentity = async (id: string) => {
    try {
      setRestoringId(id);
      await new Promise((res) => setTimeout(res, 600));

      const restored = binIdentities.find((i) => i._id === id);
      if (!restored) return;

      // Move it back to identities list
      setIdentities((prev) => [...prev, { ...restored, isDeleted: false }]);

      // Optionally: remove from bin if you have setBins in context
      // setBins((prev) => ({
      //   ...prev,
      //   identities: prev.identities.filter((i) => i._id !== id),
      // }));

      toast.success(`Restored "${restored.fullName}"`);
    } catch {
      toast.error("Failed to restore");
    } finally {
      setRestoringId(null);
    }
  };

  const deleteForever = async (id: string) => {
    try {
      setDeleteId(id);
      await new Promise((res) => setTimeout(res, 600));
      // If setBins existed, you would do this:
      // setBins((prev) => ({
      //   ...prev,
      //   identities: prev.identities.filter((i) => i._id !== id),
      // }));
      toast.success("Identity deleted permanently");
    } catch {
      toast.error("Failed to delete identity");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 mt-8">
      {binIdentities.length === 0 ? (
        <p className="text-dark-a0/60 text-sm">No deleted identities.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4  ">
          {binIdentities.map((identity, i) => (
            <motion.div
              key={identity._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md  border border-surface-a20 transition-transform hover:scale-102"
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

              <div className="flex justify-end mt-4 gap-4">
                <button
                  onClick={() => restoreIdentity(identity._id!)}
                  disabled={restoringId === identity._id}
                  className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1 hover:scale-105 transition cursor-pointer "
                >
                  <RotateCcw size={14} />
                  {restoringId === identity._id ? "Restoring..." : "Restore"}
                </button>

                <button
                  onClick={() => deleteForever(identity._id!)}
                  disabled={deleteId === identity._id}
                  className="text-danger-a0 hover:text-danger-a10 hover:scale-105 cursor-pointer text-sm flex transition items-center gap-1"
                >
                  <Trash2 size={14} />
                  {deleteId === identity._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
