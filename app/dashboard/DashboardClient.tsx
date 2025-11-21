"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  Identity,
  Login,
  Note,
  useDashboard,
} from "@/contexts/DashboardContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, StickyNote, CreditCard } from "lucide-react";

type DashboardClientProp = {
  logins: Login[];
  identities: Identity[];
  notes: Note[];
  cards: Card[];
  errors: {
    logins?: string;
    identities?: string;
    notes?: string;
    cards?: string;
  };
};

export default function DashboardClient({
  logins,
  identities,
  notes,
  cards,
  errors,
}: DashboardClientProp) {
  const router = useRouter();
  const { setCards, setLogins, setNotes, setIdentities, setBins } =
    useDashboard();

  useEffect(() => {
    setLogins(logins.filter((x: Login) => !x.isDeleted));
    setIdentities(identities.filter((x: Identity) => !x.isDeleted));
    setNotes(notes.filter((x: Note) => !x.isDeleted));
    setCards(cards.filter((x: Card) => !x.isDeleted));
    setBins({
      logins: logins.filter((x: Login) => x.isDeleted),
      identities: identities.filter((x: Identity) => x.isDeleted),
      notes: notes.filter((x: Note) => x.isDeleted),
      cards: cards.filter((x: Card) => x.isDeleted),
    });

    // 🔥 Show toast errors if present
    if (errors.logins) toast.error(errors.logins);
    if (errors.identities) toast.error(errors.identities);
    if (errors.notes) toast.error(errors.notes);
    if (errors.cards) toast.error(errors.cards);
  }, []);

  const cardData = [
    {
      id: "logins",
      icon: <Lock className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Logins",
      description: "Manage your credentials.",
      count: logins?.filter((x: Login) => !x.isDeleted).length ,
      url: "/dashboard/logins",
    },
    {
      id: "identities",
      icon: <User className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Identities",
      description: "Store personal details.",
      count: identities?.filter((x: Identity) => !x.isDeleted).length,
      url: "/dashboard/identities",
    },
    {
      id: "notes",
      icon: <StickyNote className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Secure Notes",
      description: "Keep confidential notes.",
      count: notes?.filter((x: Note) => !x.isDeleted).length,
      url: "/dashboard/notes",
    },
    {
      id: "cards",
      icon: <CreditCard className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Cards",
      description: "Manage your bank cards.",
      count: cards?.filter((x: Card) => !x.isDeleted).length,
      url: "/dashboard/cards",
    },
  ];

  return (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[var(--primary-a20)] mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-[var(--surface-a40)]">
          Choose a category to manage your data securely.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 250,
            }}
            onClick={() => router.push(card.url)}
            className="bg-[var(--surface-a10)] border border-[var(--surface-a20)] hover:border-[var(--primary-a20)] rounded-xl p-6 cursor-pointer transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {card.icon}
                <h3 className="text-lg font-semibold text-[var(--primary-a20)]">
                  {card.title}
                </h3>
              </div>
              <span className="text-xs bg-[var(--primary-a20)] text-white rounded-full px-3 py-1">
                {card.count}
              </span>
            </div>
            <p className="text-[var(--surface-a40)] text-sm">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
