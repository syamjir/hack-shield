"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  User,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/DashboardContext";
import type { Identity } from "./IdentitiesServer";
import { useEffect } from "react";

type IdentitiesClientProps = {
  identities: Identity[];
  binData: Identity[];
};

export default function IdentitiesClient({
  identities,
  binData,
}: IdentitiesClientProps) {
  const { setIdentities, setBins } = useDashboard();

  // Initialize context state with fetched data
  // (This runs only once when the client mounts)
  useEffect(() => {
    setIdentities(identities);
    setBins((prev) => ({ ...prev, identities: binData }));
  }, [identities, binData, setIdentities, setBins]);

  const moveToBin = (id: string) => {
    const deleted = identities.find((i) => i._id === id);
    if (!deleted) return;
    setIdentities((prev) => prev.filter((i) => i._id !== id));
    setBins((prev) => ({
      ...prev,
      identities: [...prev.identities, { ...deleted, isDeleted: true }],
    }));
    toast.success(`"${deleted.fullName}" moved to bin`);
  };

  if (!identities || identities.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          No identities found. Add new ones to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {identities.map((identity, i) => (
          <motion.div
            key={identity._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-a10 rounded-3xl p-6 flex flex-col justify-between border border-surface-a20 hover:shadow-2xl transition-transform hover:scale-102"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-info-a20/10 text-info-a10 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark-a0/90 text-xl">
                  {identity.fullName}
                </h3>
                <p className="text-dark-a0/50 text-sm">{identity.email}</p>
              </div>
            </div>

            {/* Full Details */}
            <div className="text-dark-a0/70 text-sm space-y-2">
              {identity.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-info-a10" />
                  {identity.phone}
                </p>
              )}
              {identity.company && (
                <p className="flex items-center gap-2">
                  <Briefcase size={16} className="text-green-500" />
                  {identity.company}
                </p>
              )}
              {identity.dateOfBirth && (
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-pink-500" />
                  {identity.dateOfBirth}
                </p>
              )}
              {identity.address && (
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-purple-500 mt-0.5" />
                  {identity.address}, {identity.city}, {identity.state}{" "}
                  {identity.postalCode}, {identity.country}
                </p>
              )}
              {identity.notes && (
                <p className="italic text-primary-a0">🗒 {identity.notes}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-4">
              <Edit
                className="text-green-500 hover:text-green-600 transition-transform hover:scale-110 cursor-pointer"
                size={20}
              />
              <Trash2
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 cursor-pointer"
                size={20}
                onClick={() => moveToBin(identity._id!)}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
