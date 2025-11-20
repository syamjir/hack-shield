"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { Card, useDashboard } from "@/contexts/DashboardContext";
import { restoreCard, deleteCardForever } from "./binServerActions";

type IdentitiesBinClientProps = {
  binCardsFromDB: Card[];
};

export default function NoteBinClient({
  binCardsFromDB,
}: IdentitiesBinClientProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { setBins, bins, setCards } = useDashboard();

  useEffect(() => {
    setBins((prev) => ({ ...prev, cards: binCardsFromDB }));
  }, [binCardsFromDB, setBins]);

  const handleRestore = async (id: string) => {
    try {
      setRestoringId(id);
      const data = await restoreCard(id);

      setCards((prev) => {
        const exists = prev.some((p) => p._id === data.data._id);
        return exists ? prev : [...prev, data.data];
      });

      setBins((prev) => ({
        ...prev,
        cards: prev.cards.filter((p) => p._id !== data.data._id),
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
      const data = await deleteCardForever(id);
      setBins((prev) => ({
        ...prev,
        cards: prev.cards.filter((p) => p._id !== data.data._id),
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

  if (bins.cards.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No deleted cards.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
      {bins.cards.map((card) => (
        <div
          key={card._id}
          className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md border border-surface-a20 transition-transform hover:scale-102"
        >
          {/* Card Holder */}
          <h3 className="font-semibold text-lg text-primary-a20 truncate">
            {card.cardHolder}
          </h3>

          {/* Bank */}
          <p className="text-sm text-dark-a0/70 truncate mt-1">{card.bank}</p>

          {/* Last Four Digits */}
          <p className="text-xs text-dark-a0/50 mt-1">
            **** **** **** {card.lastFour}
          </p>

          {/* Optional Brand */}
          {card.brand && (
            <p className="text-xs text-dark-a0/50 mt-1 truncate">
              {card.brand}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end mt-4 gap-4">
            <button
              onClick={() => card._id && handleRestore(card._id)}
              disabled={restoringId === card._id}
              className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1 hover:scale-105 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              {restoringId === card._id ? "Restoring..." : "Restore"}
            </button>

            <button
              onClick={() => card._id && handleDelete(card._id)}
              disabled={deleteId === card._id}
              className="text-danger-a0 hover:text-danger-a10 hover:scale-105 cursor-pointer text-sm flex transition items-center gap-1"
            >
              <Trash2 size={14} />
              {deleteId === card._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
