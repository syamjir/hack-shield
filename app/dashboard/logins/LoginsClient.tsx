"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Notebook,
  EyeOff,
  Eye,
  Loader2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { Login, useDashboard } from "@/contexts/DashboardContext";
import { useEffect, useState } from "react";
import { moveLoginToBin, retrievePassword } from "./loginsServerActions";
import LoginForm from "./LoginForm";

type LoginsClientProps = {
  loginsFromDB: Login[];
  binDataFromDB: Login[];
};

export default function LoginsClient({
  loginsFromDB,
  binDataFromDB,
}: LoginsClientProps) {
  const { setLogins, setBins, logins } = useDashboard();

  // Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loginToEdit, setLoginToEdit] = useState<Login | null>(null);

  // Cache revealed passwords
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  // Loading + visibility
  const [loadingPasswordId, setLoadingPasswordId] = useState<string | null>(
    null
  );
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(
    null
  );

  const [loadingEditFormId, setLoadingEditFormId] = useState<string | null>(
    null
  );

  // Initialize dashboard context
  useEffect(() => {
    setLogins(loginsFromDB);
    setBins((prev) => ({ ...prev, logins: binDataFromDB }));
  }, [loginsFromDB, binDataFromDB, setLogins, setBins]);

  // Edit handler
  const handleEdit = async (login: Login) => {
    if (!login._id) return;

    try {
      setLoadingEditFormId(login._id);

      const { data } = await retrievePassword(login._id);

      setLoginToEdit({
        ...login,
        password: data.password,
      });

      setEditModalOpen(true);
    } catch {
      toast.error("Failed to load password");
    } finally {
      setLoadingEditFormId(null);
    }
  };

  // Move to recycle bin
  const moveToBinHandler = async (id: string) => {
    try {
      const res = await moveLoginToBin(id);

      setLogins((prev) => prev.filter((x) => x._id !== id));
      setBins((prev) => ({ ...prev, logins: [...prev.logins, res.data] }));

      toast.success(res.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  // Reveal password
  const revealPassword = async (id: string) => {
    if (passwords[id]) {
      setVisiblePasswordId(id);
      return;
    }

    try {
      setLoadingPasswordId(id);
      const res = await retrievePassword(id);

      setPasswords((prev) => ({ ...prev, [id]: res.data.password }));
      setVisiblePasswordId(id);

      toast.success(res.message);
    } catch {
      toast.error("Failed to load password");
    } finally {
      setLoadingPasswordId(null);
    }
  };

  if (!logins || logins.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No logins found. Add new ones to begin.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {logins.map((login, i) => (
          <motion.div
            key={login._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-a10 rounded-3xl p-6 flex flex-col justify-between border border-surface-a20 hover:shadow-2xl transition-transform hover:scale-102"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-info-a20/10 text-info-a10 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <Notebook size={24} />
              </div>
              <h3 className="font-semibold text-dark-a0/90 text-xl">
                {login.site}
              </h3>
            </div>

            {/* DETAILS */}
            <div className="text-dark-a0/70 text-sm space-y-3">
              <p>
                <strong>Username:</strong> {login.username}
              </p>

              {/* PASSWORD */}
              <div className="flex items-center gap-3">
                <p>
                  {loadingPasswordId === login._id
                    ? "Loading..."
                    : visiblePasswordId === login._id
                    ? passwords[login._id]
                    : "••••••••"}
                </p>

                {loadingPasswordId === login._id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : visiblePasswordId === login._id ? (
                  <EyeOff
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => setVisiblePasswordId(null)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => login._id && revealPassword(login._id)}
                  />
                )}
              </div>

              {/* WEBSITE */}
              {login.websiteUri && (
                <a
                  href={
                    login.websiteUri.startsWith("http")
                      ? login.websiteUri
                      : `https://${login.websiteUri}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info-a10 text-sm underline flex items-center gap-1 mt-1 hover:text-info-a20"
                >
                  <Globe size={14} />
                  {
                    new URL(
                      login.websiteUri.startsWith("http")
                        ? login.websiteUri
                        : `https://${login.websiteUri}`
                    ).hostname
                  }
                </a>
              )}

              {/* STRENGTH */}
              <p>
                <strong>Strength:</strong>{" "}
                <span
                  className={
                    login.strength === "Strong"
                      ? "text-green-500"
                      : login.strength === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                >
                  {login.strength}
                </span>
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 mt-4">
              {loadingEditFormId === login._id ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Edit
                  className="text-green-500 hover:text-green-600 transition-transform hover:scale-110 cursor-pointer"
                  size={16}
                  onClick={() => handleEdit(login)}
                />
              )}

              <Trash2
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => login._id && moveToBinHandler(login._id)}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT FORM */}
      <LoginForm
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={loginToEdit}
      />
    </div>
  );
}
