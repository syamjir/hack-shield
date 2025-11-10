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
  isDeleted: false | true;
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
  isDeleted: false | true;
};

export type SecureNote = { _id: string; title: string; content: string };
export type Card = {
  _id: string;
  bank: string;
  cardNumber: string;
  expiry: string;
  cardHolder: string;
  cvv: string;
};
export type BinType = {
  logins: Login[];
  identities: Identity[];
  notes: SecureNote[];
  cards: Card[];
};

// ---------- Context Shape ----------
type DashboardContextType = {
  identities: Identity[];
  logins: Login[];
  cards: Card[];
  secureNotes: SecureNote[];
  bins: BinType;

  // setters
  setIdentities: React.Dispatch<React.SetStateAction<Identity[]>>;
  setLogins: React.Dispatch<React.SetStateAction<Login[]>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setSecureNotes: React.Dispatch<React.SetStateAction<SecureNote[]>>;
  setBins: React.Dispatch<React.SetStateAction<BinType>>;
};

// ---------- Create Context ----------
const DashboardContext = createContext<DashboardContextType | null>(null);

// ---------- Provider ----------
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [identities, setIdentities] = useState<Identity[]>([
    {
      _id: "1",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 555 123 4567",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      company: "OpenAI",
      dateOfBirth: "1990-02-15",
      notes: "VIP Client",
      isDeleted: false,
    },
    {
      _id: "2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 555 987 6543",
      company: "TechCorp",
      dateOfBirth: "1988-06-25",
      isDeleted: false,
    },
    {
      _id: "3",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 555 123 4567",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      company: "OpenAI",
      dateOfBirth: "1990-02-15",
      notes: "VIP Client",
      isDeleted: false,
    },
    {
      _id: "4",
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 555 987 6543",
      company: "TechCorp",
      dateOfBirth: "1988-06-25",
      isDeleted: false,
    },
  ]);
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
      expiry: "12/25",
      cvv: "878",
    },
  ]);
  const [secureNotes, setSecureNotes] = useState<SecureNote[]>([
    { _id: "1", title: "VPN Credentials", content: "user123 / pass123" },
  ]);

  const [bins, setBins] = useState<BinType>({
    logins: [],
    identities: [
      {
        _id: "1",
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 555 123 4567",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        company: "OpenAI",
        dateOfBirth: "1990-02-15",
        notes: "VIP Client",
        isDeleted: false,
      },
      {
        _id: "2",
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 555 987 6543",
        company: "TechCorp",
        dateOfBirth: "1988-06-25",
        isDeleted: false,
      },
      {
        _id: "3",
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 555 123 4567",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        company: "OpenAI",
        dateOfBirth: "1990-02-15",
        notes: "VIP Client",
        isDeleted: false,
      },
      {
        _id: "4",
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 555 987 6543",
        company: "TechCorp",
        dateOfBirth: "1988-06-25",
        isDeleted: false,
      },
    ],
    notes: [],
    cards: [],
  });

  return (
    <DashboardContext.Provider
      value={{
        identities,
        logins,
        cards,
        secureNotes,
        setIdentities,
        setLogins,
        setCards,
        setSecureNotes,
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
