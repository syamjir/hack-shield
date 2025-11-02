"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, StickyNote, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabsSection from "@/components/ui/dashboard/TabsSection";

// ===== TYPES =====
export type Login = {
  _id?: string;
  userId?: string;
  id?: number;
  site: string;
  username: string;
  strength: "Weak" | "Medium" | "Strong";
  password: string;
  websiteUri?: string;
};
export type Identity = { id: number; name: string; email: string };
export type Note = { id: number; title: string; content: string };
export type Card = {
  id: number;
  bank: string;
  cardNumber: string;
  expiry: string;
  cardHolder: string;
  cvv: string;
};
export type BinType = {
  logins: Login[];
  identities: Identity[];
  notes: Note[];
  cards: Card[];
};

export default function DashboardPage() {
  // ===== STATE =====
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    null | "logins" | "identities" | "notes" | "cards"
  >(null);

  // ===== MOCK DATA =====
  const [logins, setLogins] = useState<Login[]>([
    {
      id: 1,
      site: "Google",
      username: "dharmi@gmail.com",
      strength: "Strong",
      password: "1234",
      websiteUri: "https://www.google.com",
    },
    {
      id: 2,
      site: "LinkedIn",
      username: "dharmishta.r",
      strength: "Medium",
      password: "abcd",
      websiteUri: "https://www.linkedin.com",
    },
  ]);

  const [identities, setIdentities] = useState<Identity[]>([
    { id: 1, name: "Personal", email: "dharmi@gmail.com" },
    { id: 2, name: "Work", email: "d.r@company.com" },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: "API Key", content: "XYZ123-SECRET" },
  ]);

  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      bank: "SBI",
      cardNumber: "**** **** **** 1234",
      expiry: "12/26",
      cardHolder: "Dharmishta R Nath",
      cvv: "***",
    },
  ]);

  const [bin, setBin] = useState<BinType>({
    logins: [],
    identities: [],
    notes: [],
    cards: [],
  });

  // ===== LOADING ANIMATION =====
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // ===== ANIMATIONS =====
  const fadeVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.3 } },
  };

  const cardData = [
    {
      id: "logins",
      icon: <Lock className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Logins",
      description: "Manage your website credentials securely.",
      count: logins.length,
    },
    {
      id: "identities",
      icon: <User className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Identities",
      description: "Store your name, address, and personal data.",
      count: identities.length,
    },
    {
      id: "notes",
      icon: <StickyNote className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Secure Notes",
      description: "Keep private notes and confidential text safe.",
      count: notes.length,
    },
    {
      id: "cards",
      icon: <CreditCard className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Cards",
      description: "Manage your bank cards and details.",
      count: cards.length,
    },
  ];

  // ===== RENDER =====
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          className="flex justify-center items-center h-[70vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-10 h-10 border-4 border-[var(--primary-a20)] border-t-transparent rounded-full animate-spin"
            transition={{ repeat: Infinity }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {!activeSection ? (
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
                    onClick={() =>
                      setActiveSection(
                        card.id as "logins" | "identities" | "notes" | "cards"
                      )
                    }
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
          ) : (
            <motion.div
              key={activeSection}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                variant="ghost"
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 mb-6 text-[var(--primary-a20)] hover:text-[var(--primary-a30)]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              <TabsSection
                type={activeSection}
                passwords={
                  activeSection === "logins"
                    ? logins
                    : activeSection === "identities"
                    ? identities
                    : activeSection === "notes"
                    ? notes
                    : cards
                }
                setPasswords={
                  activeSection === "logins"
                    ? setLogins
                    : activeSection === "identities"
                    ? setIdentities
                    : activeSection === "notes"
                    ? setNotes
                    : setCards
                }
                bin={bin}
                setBin={setBin}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
