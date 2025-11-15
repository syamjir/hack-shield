"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, StickyNote, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabsSection from "@/components/ui/dashboard/TabsSection";
import { toast } from "sonner";
import type { Identity } from "../dashboard/identities/IdentitiesServer";
import { useDashboard } from "@/contexts/DashboardContext";
import { useRouter } from "next/navigation";

// ===== TYPES =====
export type Login = {
  _id?: string;
  userId?: string;
  id?: number;
  site: string;
  username: string;
  strength: "Weak" | "Medium" | "Strong";
  isDeleted: false | true;
  password: string;
  websiteUri?: string;
};
// export type Identity = { id: number; name: string; email: string };
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

type PasswordResponse = {
  message?: string;
  error?: string;
  data: Login[];
};

export default function DashboardPage() {
  // ===== STATE =====
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    null | "logins" | "identities" | "notes" | "cards"
  >(null);

  // ===== MOCK DATA =====
  const [logins, setLogins] = useState<Login[]>([]);

  // const [identities, setIdentities] = useState<Identity[]>([
  //   { id: 1, name: "Personal", email: "dharmi@gmail.com" },
  //   { id: 2, name: "Work", email: "d.r@company.com" },
  // ]);

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

  const { setIdentities, setBins, identities } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchPasswords = async () => {
      try {
        const res = await fetch("/api/passwords", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // userId retrieve in backend login users userId
        });
        if (!res.ok) {
          const errorData: PasswordResponse = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }
        const data: PasswordResponse = await res.json();
        const loginData = data.data.filter((data) => data.isDeleted === false);
        const binData = data.data.filter((data) => data.isDeleted === true);
        if (isMounted) {
          setLogins(loginData);
          setBin((prev) => ({ ...prev, logins: binData }));
        }
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        if (isMounted) toast.error(message);
      }
    };
    const fetchIdentities = async () => {
      try {
        const res = await fetch(`/api/identities`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch identities");
        }

        const data = await res.json();
        const identities = data.data.filter(
          (item: Identity) => !item.isDeleted
        );
        const binIdentities = data.data.filter(
          (item: Identity) => item.isDeleted
        );
        setIdentities(identities);
        setBins((prev) => ({ ...prev, identities: binIdentities }));
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        if (isMounted) toast.error(message);
      }
    };
    fetchPasswords();
    fetchIdentities();

    return () => {
      isMounted = false;
    };
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
      url: "/dashboard/logins",
    },
    {
      id: "identities",
      icon: <User className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Identities",
      description: "Store your name, address, and personal data.",
      count: identities.length,
      url: "/dashboard/identities",
    },
    {
      id: "notes",
      icon: <StickyNote className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Secure Notes",
      description: "Keep private notes and confidential text safe.",
      count: notes.length,
      url: "/dashboard/notes",
    },
    {
      id: "cards",
      icon: <CreditCard className="text-[var(--primary-a20)] w-6 h-6" />,
      title: "Cards",
      description: "Manage your bank cards and details.",
      count: cards.length,
      url: "/dashboard/cards",
    },
  ];

  // password data fetch from db

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
                className="flex items-center gap-2 mb-2 text-[var(--primary-a20)] hover:text-[var(--primary-a30)]"
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
