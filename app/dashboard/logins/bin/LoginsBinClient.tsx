"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { Login, useDashboard } from "@/contexts/DashboardContext";
import { restoreLogin, deleteLoginForever } from "./binServerActions";

type LoginsBinClientProps = {
  binLoginsFromDB: Login[];
};

export default function NoteBinClient({
  binLoginsFromDB,
}: LoginsBinClientProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { setBins, bins, setLogins } = useDashboard();

  useEffect(() => {
    setBins((prev) => ({ ...prev, logins: binLoginsFromDB }));
  }, [binLoginsFromDB, setBins]);

  const handleRestore = async (id: string) => {
    try {
      setRestoringId(id);
      const data = await restoreLogin(id);

      setLogins((prev) => {
        const exists = prev.some((p) => p._id === data.data._id);
        return exists ? prev : [...prev, data.data];
      });

      setBins((prev) => ({
        ...prev,
        logins: prev.logins.filter((p) => p._id !== data.data._id),
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
      const data = await deleteLoginForever(id);
      setBins((prev) => ({
        ...prev,
        logins: prev.logins.filter((p) => p._id !== data.data._id),
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

  if (bins.logins.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No deleted logins.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
      {bins.logins.map((login) => (
        <div
          key={login._id}
          className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md border border-surface-a20 transition-transform hover:scale-102"
        >
          {/* Site */}
          <h3 className="font-semibold text-lg text-primary-a20 truncate">
            {login.site}
          </h3>

          {/* Username */}
          <p className="text-sm text-dark-a0/70 truncate mt-1">
            {login.username}
          </p>

          {/* Strength Badge */}
          <p
            className={`text-xs font-semibold px-2 py-1 mt-2 rounded-full inline-block
    ${
      login.strength === "Strong"
        ? "bg-success-a20 text-success-a0"
        : login.strength === "Medium"
        ? "bg-warning-a20 text-warning-a0"
        : "bg-danger-a20 text-danger-a0"
    }
  `}
          >
            {login.strength}
          </p>

          {/* Actions */}
          <div className="flex justify-end mt-4 gap-4">
            <button
              onClick={() => login._id && handleRestore(login._id)}
              disabled={restoringId === login._id}
              className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1 hover:scale-105 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              {restoringId === login._id ? "Restoring..." : "Restore"}
            </button>

            <button
              onClick={() => login._id && handleDelete(login._id)}
              disabled={deleteId === login._id}
              className="text-danger-a0 hover:text-danger-a10 hover:scale-105 cursor-pointer text-sm flex transition items-center gap-1"
            >
              <Trash2 size={14} />
              {deleteId === login._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
