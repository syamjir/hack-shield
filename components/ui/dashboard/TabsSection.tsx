"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PasswordTable from "./PasswordTable";
import CardSection from "./CardSection";
import IdentitySection from "./IdentitySection";
import SecureNotesSection from "./SecureNotesSection";
import BinView from "./BinView";
import { BinType, Login } from "@/app/dashboard/page";
import PasswordsSection from "./PasswordsSection";
import PasswordGenerator from "./PasswordGenerator";
import BreachChecker from "./BreachChecker";
import { Search } from "lucide-react";
import { Input } from "../input";

interface TabsSectionProps {
  type: "logins" | "identities" | "notes" | "cards";
  passwords: Login[];
  setPasswords: React.Dispatch<React.SetStateAction<Login[]>>;
  bin: BinType;
  setBin: React.Dispatch<React.SetStateAction<BinType>>;
}

export default function TabsSection({
  type,
  passwords,
  bin,
  setPasswords,
  setBin,
}: TabsSectionProps) {
  const [breachPassword, setBreachPassword] = useState("");
  const defaultTab =
    type === "logins"
      ? "login"
      : type === "identities"
      ? "identity"
      : type === "cards"
      ? "card"
      : "notes";
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs
      defaultValue={defaultTab}
      value={activeTab}
      onValueChange={setActiveTab}
      className=" w-full"
    >
      {/* Header (Password Vault Info Section) */}
      {type === "logins" && <PasswordsSection setPasswords={setPasswords} />}

      {/* Tabs + Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-wrap">
        {/* Tabs List */}
        <TabsList className="flex flex-wrap justify-start gap-2 bg-[var(--surface-a10)] rounded-lg p-1 w-full sm:w-auto">
          {type === "logins" && (
            <>
              <TabsTrigger
                value="login"
                className="flex-1 sm:flex-none px-4 py-2 text-sm"
              >
                Logins
              </TabsTrigger>
              <TabsTrigger
                value="secure"
                className="flex-1 sm:flex-none px-4 py-2 text-sm"
              >
                Secure Passwords
              </TabsTrigger>
            </>
          )}
          {type === "identities" && (
            <TabsTrigger
              value="identity"
              className="flex-1 sm:flex-none px-4 py-2 text-sm"
            >
              Identity
            </TabsTrigger>
          )}
          {type === "notes" && (
            <TabsTrigger
              value="notes"
              className="flex-1 sm:flex-none px-4 py-2 text-sm"
            >
              Notes
            </TabsTrigger>
          )}
          {type === "cards" && (
            <TabsTrigger
              value="card"
              className="flex-1 sm:flex-none px-4 py-2 text-sm"
            >
              Cards
            </TabsTrigger>
          )}
          <TabsTrigger
            value="bin"
            className="flex-1 sm:flex-none px-4 py-2 text-sm"
          >
            Bin
          </TabsTrigger>
        </TabsList>

        {/* Search Bar (only for logins tab) */}
        {type === "logins" && activeTab === "login" && (
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="absolute left-3 top-2.5 text-[var(--surface-a40)] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search passwords..."
              className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* ==== CONTENT AREA ==== */}

      {/* Logins */}
      {type === "logins" && (
        <>
          <TabsContent value="login" className="w-full ">
            <PasswordTable
              title={type}
              passwords={passwords}
              setPasswords={setPasswords}
              setBin={setBin}
            />
          </TabsContent>

          <TabsContent value="secure" className="w-full">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordGenerator onBreachPassword={setBreachPassword} />
              <BreachChecker breachPassword={breachPassword} />
            </section>
          </TabsContent>
        </>
      )}

      {/* Identities */}
      {type === "identities" && (
        <TabsContent value="identity" className="w-full">
          <IdentitySection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Notes */}
      {type === "notes" && (
        <TabsContent value="notes" className="w-full">
          <SecureNotesSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Cards */}
      {type === "cards" && (
        <TabsContent value="card" className="w-full">
          <CardSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Bin */}
      <TabsContent value="bin" className="w-full">
        <BinView
          title={type}
          bin={
            type === "logins"
              ? bin.logins
              : type === "identities"
              ? bin.identities
              : type === "cards"
              ? bin.cards
              : bin.notes
          }
          setBin={setBin}
          setPasswords={setPasswords}
        />
      </TabsContent>
    </Tabs>
  );
}
