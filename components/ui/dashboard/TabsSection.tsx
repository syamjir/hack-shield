"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PasswordTable from "./PasswordTable";
import CardSection from "./CardSection";
import IdentitySection from "./IdentitySection";
import SecureNotesSection from "./SecureNotesSection";
import BinView from "./BinView";
import { BinType } from "@/app/dashboard/page";
import PasswordsSection from "./PasswordsSection";
import PasswordGenerator from "./PasswordGenerator";
import BreachChecker from "./BreachChecker";
import { Search } from "lucide-react";
import { Input } from "../input";
import { useState } from "react";

interface TabsSectionProps {
  type: "logins" | "identities" | "notes" | "cards";
  passwords: any[];
  setPasswords: (data: any[]) => void;
  bin: BinType;
  setBin: (data: BinType) => void;
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
      className="mt-5"
    >
      {type === "logins" && <PasswordsSection />}
      <div className="flex justify-between mb-3">
        <TabsList className="flex flex-wrap gap-2 bg-[var(--surface-a10)] rounded-lg p-1 ">
          {type === "logins" && (
            <>
              <TabsTrigger value="login" className="flex-1 md:flex-none px-4">
                Logins
              </TabsTrigger>
              <TabsTrigger value="secure" className="flex-1 md:flex-none px-4">
                Secure Password
              </TabsTrigger>
            </>
          )}
          {type === "identities" && (
            <TabsTrigger value="identity" className="flex-1 md:flex-none px-4">
              Identity
            </TabsTrigger>
          )}
          {type === "notes" && (
            <TabsTrigger value="notes" className="flex-1 md:flex-none px-4">
              Notes
            </TabsTrigger>
          )}
          {type === "cards" && (
            <TabsTrigger value="card" className="flex-1 md:flex-none px-4">
              Cards
            </TabsTrigger>
          )}
          <TabsTrigger value="bin" className="flex-1 md:flex-none px-4">
            Bin
          </TabsTrigger>
        </TabsList>

        {type === "logins" && activeTab === "login" && (
          <div className="relative w-lg">
            <Search className="absolute left-3 top-2.5 text-[var(--surface-a40)] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search passwords..."
              className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Logins */}
      {type === "logins" && (
        <>
          <TabsContent value="login">
            <PasswordTable
              title={type}
              passwords={passwords}
              setPasswords={setPasswords}
              setBin={setBin}
            />
          </TabsContent>

          <TabsContent value="secure">
            <section className="grid md:grid-cols-2 gap-4">
              <PasswordGenerator onBreachPassword={setBreachPassword} />
              <BreachChecker breachPassword={breachPassword} />
            </section>
          </TabsContent>
        </>
      )}

      {/* Identities */}
      {type === "identities" && (
        <TabsContent value="identity">
          <IdentitySection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Notes */}
      {type === "notes" && (
        <TabsContent value="notes">
          <SecureNotesSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Cards */}
      {type === "cards" && (
        <TabsContent value="card">
          <CardSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {/* Bin */}
      <TabsContent value="bin">
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
