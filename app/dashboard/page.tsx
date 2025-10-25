"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  LogOut,
  ArrowLeft,
  User,
  StickyNote,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import PasswordGenerator from "@/components/ui/dashboard/PasswordGenerator";
import BreachChecker from "@/components/ui/dashboard/BreachChecker";
import TabsSection from "@/components/ui/dashboard/TabsSection";

export type Login = {
  id: number;
  site: string;
  username: string;
  strength: string;
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
export default function Dashboard() {
  // ===== STATE =====
  const [activePage, setActivePage] = useState("dashboard");
  const [activeSection, setActiveSection] = useState<
    null | "logins" | "identities" | "notes" | "cards"
  >(null);

  // ===== DATA =====
  const [logins, setLogins] = useState([
    { id: 1, site: "Google", username: "dharmi@gmail.com", strength: "Strong" },
    { id: 2, site: "LinkedIn", username: "dharmishta.r", strength: "Medium" },
  ]);

  const [identities, setIdentities] = useState([
    { id: 1, name: "Personal", email: "dharmi@gmail.com" },
    { id: 2, name: "Work", email: "d.r@company.com" },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, title: "API Key", content: "XYZ123-SECRET" },
  ]);

  const [cards, setCards] = useState([
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

  // ===== RENDER DASHBOARD CARDS =====
  const renderDashboardCards = () => {
    const cardData = [
      {
        id: "logins",
        icon: <Lock className="text-[var(--primary-a20)] w-6 h-6" />,
        title: "Logins",
        description: "Manage your website credentials securely.",
        count: logins.length,
        color: "bg-[var(--surface-a10)]",
      },
      {
        id: "identities",
        icon: <User className="text-[var(--primary-a20)] w-6 h-6" />,
        title: "Identities",
        description: "Store your name, address, and personal data.",
        count: identities.length,
        color: "bg-[var(--surface-a10)]",
      },
      {
        id: "notes",
        icon: <StickyNote className="text-[var(--primary-a20)] w-6 h-6" />,
        title: "Secure Notes",
        description: "Keep private notes and confidential text safe.",
        count: notes.length,
        color: "bg-[var(--surface-a10)]",
      },
      {
        id: "cards",
        icon: <CreditCard className="text-[var(--primary-a20)] w-6 h-6" />,
        title: "Cards",
        description: "Manage your bank cards and card details.",
        count: cards.length, // assuming you have a state array `atmCards`
        color: "bg-[var(--surface-a10)]",
      },
    ];

    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            onClick={() =>
              setActiveSection(card.id as "logins" | "identities" | "notes")
            }
            className={`${card.color} border border-[var(--surface-a20)] hover:border-[var(--primary-a20)] rounded-xl p-6 cursor-pointer transition`}
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
    );
  };

  // ===== MAIN CONTENT =====
  const renderMainContent = () => {
    if (activePage !== "dashboard") {
      return (
        <div className="text-center py-10 text-[var(--surface-a40)]">
          <h2 className="text-2xl font-semibold mb-2 capitalize">
            {activePage.replace("-", " ")}
          </h2>
          <p>Coming soon...</p>
        </div>
      );
    }

    // Inside a section
    if (activeSection) {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 mb-6 text-[var(--primary-a20)] hover:text-[var(--primary-a30)]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {activeSection === "logins" && (
            <>
              <TabsSection
                type="logins"
                passwords={logins}
                setPasswords={setLogins}
                bin={bin}
                setBin={setBin}
              />

              <section className="grid md:grid-cols-2 gap-4 mt-8">
                <PasswordGenerator />
                <BreachChecker />
              </section>
            </>
          )}

          {activeSection === "identities" && (
            <TabsSection
              type="identities"
              passwords={identities}
              setPasswords={setIdentities}
              bin={bin}
              setBin={setBin}
            />
          )}

          {activeSection === "notes" && (
            <TabsSection
              type="notes"
              passwords={notes}
              setPasswords={setNotes}
              bin={bin}
              setBin={setBin}
            />
          )}
          {activeSection === "cards" && (
            <TabsSection
              type="cards"
              passwords={cards}
              setPasswords={setCards}
              bin={bin}
              setBin={setBin}
            />
          )}
        </div>
      );
    }

    // Default dashboard home
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
        {renderDashboardCards()}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface-a0)] text-[var(--surface-a50)]">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between bg-[var(--surface-a10)] w-64 p-6 border-r border-[var(--surface-a20)]">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Lock className="text-[var(--primary-a20)]" />
            <h1 className="text-xl font-bold text-[var(--primary-a20)]">
              PassKeeper
            </h1>
          </div>

          <nav className="flex flex-col gap-4 text-sm">
            {["dashboard", "security", "settings"].map((page) => (
              <button
                key={page}
                className={`text-left transition ${
                  activePage === page
                    ? "text-[var(--primary-a20)] font-medium"
                    : "hover:text-[var(--primary-a20)]"
                }`}
                onClick={() => {
                  setActivePage(page);
                  setActiveSection(null);
                }}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-[var(--surface-a40)] hover:text-[var(--primary-a20)] cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-5 md:px-10 py-10">{renderMainContent()}</main>
    </div>
  );
}
