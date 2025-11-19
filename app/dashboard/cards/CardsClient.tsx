"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Notebook,
  EyeOff,
  Eye,
  Loader2,
  IdCardLanyardIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, useDashboard } from "@/contexts/DashboardContext";
import { useEffect, useState } from "react";
import {
  moveCardToBin,
  retrieveCardNumber,
  retrieveCvv,
} from "./cardsServerActions";
import CardForm from "./CardForm";

type CardsClientProps = {
  cardsFromDB: Card[];
  binDataFromDB: Card[];
};

export default function CardsClient({
  cardsFromDB,
  binDataFromDB,
}: CardsClientProps) {
  const { setCards, setBins, cards } = useDashboard();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [loadingCardNumberId, setLoadingCardNumberId] = useState<string | null>(
    null
  );
  const [loadingCvvId, setLoadingCvvId] = useState<string | null>(null);

  const [visibleCardNumberId, setVisibleCardNumberId] = useState<string | null>(
    null
  );
  const [visibleCvvId, setVisibleCvvId] = useState<string | null>(null);

  const [fullCardNumber, setFullCardNumber] = useState("");
  const [fullCvv, setFullCvv] = useState("");

  // Initialize context state with fetched data
  // (This runs only once when the client mounts)
  console.log(cardsFromDB);
  useEffect(() => {
    setCards(cardsFromDB);
    setBins((prev) => ({ ...prev, cards: binDataFromDB }));
  }, [cardsFromDB, binDataFromDB, setCards, setBins]);

  const handleEdit = (card: Card) => {
    setCardToEdit(card);
    setEditModalOpen(true);
  };

  const moveToBin = async (id: string) => {
    const deleted = cards.find((i) => i._id === id);
    if (!deleted) return;
    try {
      const data = await moveCardToBin(id);
      const deleted = data.data;
      if (!deleted) return;

      setCards((prev) => prev.filter((i) => i._id !== id));
      setBins((prev) => ({
        ...prev,
        cards: [...prev.cards, deleted],
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const revealCardNumber = async (id: string) => {
    try {
      setLoadingCardNumberId(id);
      const data = await retrieveCardNumber(id);
      setFullCardNumber(data.data.cardNumber);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingCardNumberId(null);
    }
  };
  const revealCvv = async (id: string) => {
    try {
      setLoadingCvvId(id);
      const data = await retrieveCvv(id);
      setFullCvv(data.data.cvv);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingCvvId(null);
    }
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          No cards found. Add new ones to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-a10 rounded-3xl p-6 flex flex-col justify-between border border-surface-a20 hover:shadow-2xl transition-transform hover:scale-102"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-info-a20/10 text-info-a10 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                {/* Placeholder for card icon */}
                <Notebook size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-dark-a0/90 text-xl">
                  {card.cardHolder}
                </h3>
              </div>
            </div>

            {/* Full Details */}
            <div className="text-dark-a0/70 text-sm space-y-3">
              {/* Card Info */}
              <div className="italic text-dark-a0/80 leading-relaxed">
                <p>
                  <strong>Bank:</strong> {card.bank}
                </p>
                <div className="flex gap-4 items-center">
                  <p>
                    {loadingCardNumberId === card._id
                      ? "Loading..."
                      : visibleCardNumberId === card._id
                      ? fullCardNumber
                          .replace(/\D/g, "")
                          .replace(/(.{4})/g, "$1 ")
                          .trim()
                      : `**** **** **** ${card.lastFour}`}
                  </p>

                  {visibleCardNumberId === card._id ? (
                    loadingCardNumberId === card._id ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      <EyeOff
                        size={18}
                        className="cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          if (card._id) {
                            setVisibleCardNumberId(null);
                          }
                        }}
                      />
                    )
                  ) : (
                    <Eye
                      size={18}
                      className="cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        if (card._id) {
                          revealCardNumber(card._id);
                          setVisibleCardNumberId(card._id);
                        }
                      }}
                    />
                  )}
                </div>
                <p>
                  <strong>Expiry:</strong> {card.expiryMonth}/{card.expiryYear}
                </p>

                <div className="flex gap-4 items-center">
                  <p>
                    <strong>CVV:</strong>{" "}
                    {loadingCvvId === card._id
                      ? "Loading..."
                      : visibleCvvId === card._id
                      ? fullCvv
                      : "***"}
                  </p>

                  {visibleCvvId === card._id ? (
                    loadingCvvId === card._id ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      <EyeOff
                        size={18}
                        className="cursor-pointer hover:scale-110 transition"
                        onClick={() => {
                          if (card._id) {
                            setVisibleCvvId(null);
                          }
                        }}
                      />
                    )
                  ) : (
                    <Eye
                      size={18}
                      className="cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        if (card._id) {
                          revealCvv(card._id);
                          setVisibleCvvId(card._id);
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Tags (optional for categorization) */}
              {card.brand && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-primary-a20 text-white rounded-md">
                    {card.brand}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-4">
              <Edit
                className="text-green-500 hover:text-green-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => handleEdit(card)}
              />

              <Trash2
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => moveToBin(card._id!)}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Note Form Modal */}
      <CardForm
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={cardToEdit}
      />
    </div>
  );
}
