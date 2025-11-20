"use client";

import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Notebook,
  EyeOff,
  Eye,
  Loader2,
  TrendingUpDownIcon,
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

// Utility formatter
const formatCardNumber = (num: string) =>
  num
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

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

  // Revealed data caches
  const [cardNumbers, setCardNumbers] = useState<Record<string, string>>({});
  const [cvvs, setCvvs] = useState<Record<string, string>>({});

  // Loading states
  const [loadingCardNumberId, setLoadingCardNumberId] = useState<string | null>(
    null
  );
  const [loadingCvvId, setLoadingCvvId] = useState<string | null>(null);

  // Visibility states
  const [visibleCardNumberId, setVisibleCardNumberId] = useState<string | null>(
    null
  );
  const [visibleCvvId, setVisibleCvvId] = useState<string | null>(null);

  const [loadingEditFormId, setLoadingEditFormId] = useState<string | null>(
    null
  );

  // Initialize context data
  useEffect(() => {
    setCards(cardsFromDB);
    setBins((prev) => ({ ...prev, cards: binDataFromDB }));
  }, [cardsFromDB, binDataFromDB, setCards, setBins]);

  // Edit handler
  const handleEdit = async (card: Card) => {
    if (!card._id) return;

    try {
      setLoadingEditFormId(card._id);
      const { data: numData } = await retrieveCardNumber(card._id);
      const { data: cvvData } = await retrieveCvv(card._id);

      setCardToEdit({
        ...card,
        cardNumber: numData.cardNumber,
        cvv: cvvData.cvv,
      });

      setEditModalOpen(true);
    } catch {
      toast.error("Failed to load card details.");
    } finally {
      setLoadingEditFormId(null);
    }
  };

  // Delete handler
  const moveToBinHandler = async (id: string) => {
    try {
      const response = await moveCardToBin(id);
      const deleted = response.data;

      setCards((prev) => prev.filter((i) => i._id !== id));
      setBins((prev) => ({ ...prev, cards: [...prev.cards, deleted] }));

      toast.success(response.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  // Reveal card number
  const revealCardNumber = async (id: string) => {
    if (cardNumbers[id]) {
      setVisibleCardNumberId(id);
      return; // Already cached
    }

    try {
      setLoadingCardNumberId(id);
      const res = await retrieveCardNumber(id);
      const value = res.data.cardNumber;

      setCardNumbers((prev) => ({ ...prev, [id]: value }));
      setVisibleCardNumberId(id);

      toast.success(res.message);
    } catch {
      toast.error("Failed to load card number");
    } finally {
      setLoadingCardNumberId(null);
    }
  };

  // Reveal CVV
  const revealCvv = async (id: string) => {
    if (cvvs[id]) {
      setVisibleCvvId(id);
      return;
    }

    try {
      setLoadingCvvId(id);
      const res = await retrieveCvv(id);

      setCvvs((prev) => ({ ...prev, [id]: res.data.cvv }));
      setVisibleCvvId(id);

      toast.success(res.message);
    } catch {
      toast.error("Failed to load CVV");
    } finally {
      setLoadingCvvId(null);
    }
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No cards found. Add new ones to begin.</p>
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
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-info-a20/10 text-info-a10 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <Notebook size={24} />
              </div>
              <h3 className="font-semibold text-dark-a0/90 text-xl">
                {card.cardHolder}
              </h3>
            </div>

            {/* DETAILS */}
            <div className="text-dark-a0/70 text-sm space-y-3">
              <p>
                <strong>Bank:</strong> {card.bank}
              </p>

              {/* CARD NUMBER */}
              <div className="flex items-center gap-3">
                <p>
                  {loadingCardNumberId === card._id
                    ? "Loading..."
                    : visibleCardNumberId === card._id
                    ? formatCardNumber(cardNumbers[card._id] || "")
                    : `**** **** **** ${card.lastFour}`}
                </p>

                {/* ICON */}
                {loadingCardNumberId === card._id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : visibleCardNumberId === card._id ? (
                  <EyeOff
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => setVisibleCardNumberId(null)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => card._id && revealCardNumber(card._id)}
                  />
                )}
              </div>

              {/* EXPIRY */}
              <p>
                <strong>Expiry:</strong> {card.expiryMonth}/{card.expiryYear}
              </p>

              {/* CVV */}
              <div className="flex items-center gap-3">
                <p>
                  <strong>CVV:</strong>{" "}
                  {loadingCvvId === card._id
                    ? "Loading..."
                    : visibleCvvId === card._id
                    ? cvvs[card._id]
                    : "***"}
                </p>

                {/* ICON */}
                {loadingCvvId === card._id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : visibleCvvId === card._id ? (
                  <EyeOff
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => setVisibleCvvId(null)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer hover:scale-110 transition"
                    size={18}
                    onClick={() => card._id && revealCvv(card._id)}
                  />
                )}
              </div>

              {/* BRAND */}
              {card.brand && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-primary-a20 text-white rounded-md">
                    {card.brand}
                  </span>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 mt-4">
              {loadingEditFormId === card._id ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Edit
                  className="text-green-500 hover:text-green-600 transition-transform hover:scale-110 cursor-pointer"
                  size={16}
                  onClick={() => handleEdit(card)}
                />
              )}

              <Trash2
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => card._id && moveToBinHandler(card._id)}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL FORM */}
      <CardForm
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={cardToEdit}
      />
    </div>
  );
}
