"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { restoreIdentity, deleteIdentityForever } from "./binServerActions";
import { Identity } from "@/contexts/DashboardContext";

type IdentitiesBinClientProps = {
  binIdenitiesFromDB: Identity[];
};

export default function IdentitiesBinClient({
  binIdenitiesFromDB,
}: IdentitiesBinClientProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { setBins, bins, setIdentities } = useDashboard();

  useEffect(() => {
    setBins((prev) => ({ ...prev, identities: binIdenitiesFromDB }));
  }, [binIdenitiesFromDB, setBins]);

  const handleRestore = async (id: string) => {
    try {
      setRestoringId(id);
      const data = await restoreIdentity(id);

      setIdentities((prev) => {
        const exists = prev.some((p) => p._id === data.data._id);
        return exists ? prev : [...prev, data.data];
      });

      setBins((prev) => ({
        ...prev,
        identities: prev.identities.filter((p) => p._id !== data.data._id),
      }));

      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteId(id);
      const data = await deleteIdentityForever(id);
      setBins((prev) => ({
        ...prev,
        identities: prev.identities.filter((p) => p._id !== data.data._id),
      }));

      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  };

  if (bins.identities.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No deleted identities.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
      {bins.identities.map((identity) => (
        <div
          key={identity._id}
          className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md border border-surface-a20 transition-transform hover:scale-102"
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
              onClick={() => {
                if (identity._id) {
                  handleRestore(identity._id);
                }
              }}
              disabled={restoringId === identity._id}
              className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1 hover:scale-105 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              {restoringId === identity._id ? "Restoring..." : "Restore"}
            </button>

            <button
              onClick={() => {
                if (identity._id) {
                  handleDelete(identity._id);
                }
              }}
              disabled={deleteId === identity._id}
              className="text-danger-a0 hover:text-danger-a10 hover:scale-105 cursor-pointer text-sm flex transition items-center gap-1"
            >
              <Trash2 size={14} />
              {deleteId === identity._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
