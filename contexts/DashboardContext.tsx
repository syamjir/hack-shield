"use client";
import React, { createContext, useContext, useState } from "react";

// Types
export type Login = {
  _id?: string;
  userId?: string;
  id?: number;
  site: string;
  username: string;
  strength: "Weak" | "Medium" | "Strong";
  isDeleted?: false | true;
  password: string;
  websiteUri?: string;
};

export type Identity = {
  _id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: string;
  notes?: string;
  isDeleted?: false | true;
};

export type Note = {
  _id?: string;
  title: string;
  content: string;
  tags?: string[];
  isDeleted?: boolean;
  createdAt?: Date;
};

export type Card = {
  _id?: string;
  cardHolder: string;
  bank: string;
  cardNumber: string;
  lastFour?: string;
  brand?: string;
  expiryMonth: number | undefined;
  expiryYear: number | undefined;
  cvv: string;
  isDeleted?: boolean;
};
export type BinType = {
  logins: Login[];
  identities: Identity[];
  notes: Note[];
  cards: Card[];
};

// ---------- Context Shape ----------
type DashboardContextType = {
  identities: Identity[];
  logins: Login[];
  cards: Card[];
  notes: Note[];
  bins: BinType;

  // setters
  setIdentities: React.Dispatch<React.SetStateAction<Identity[]>>;
  setLogins: React.Dispatch<React.SetStateAction<Login[]>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setBins: React.Dispatch<React.SetStateAction<BinType>>;
};

// ---------- Create Context ----------
const DashboardContext = createContext<DashboardContextType | null>(null);

// ---------- Provider ----------
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [logins, setLogins] = useState<Login[]>([
    {
      _id: "1",
      site: "github.com",
      username: "johnny",
      password: "••••••",
      strength: "Medium",
      isDeleted: false,
    },
  ]);
  const [cards, setCards] = useState<Card[]>([
    {
      _id: "1",
      bank: "HDFC",
      cardHolder: "John Doe",
      cardNumber: "**** **** **** 4242",
      expiryMonth: 12,
      expiryYear: 25,
      isDeleted: false,
      cvv: "878",
      lastFour: "4443",
    },
  ]);
  const [notes, setNotes] = useState<Note[]>([
    {
      _id: "1",
      title: "VPN Credentials",
      content: "user123 / pass123",
      createdAt: new Date(),
    },
  ]);

  const [bins, setBins] = useState<BinType>({
    logins: [],
    identities: [],
    notes: [],
    cards: [],
  });

  return (
    <DashboardContext.Provider
      value={{
        identities,
        logins,
        cards,
        notes,
        setIdentities,
        setLogins,
        setCards,
        setNotes,
        bins,
        setBins,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// ---------- Hook ----------
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
