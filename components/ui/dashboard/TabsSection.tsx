"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PasswordTable from "./PasswordTable";
import CardSection from "./CardSection";
import IdentitySection from "./IdentitySection";
import SecureNotesSection from "./SecureNotesSection";
import BinView from "./BinView";
import { BinType } from "@/app/dashboard/page";

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
  // Determine the default active tab for each section
  console.log(bin);
  const defaultTab =
    type === "logins"
      ? "login"
      : type === "identities"
      ? "identity"
      : type === "cards"
      ? "card"
      : "notes";

  return (
    <Tabs defaultValue={defaultTab} className="mt-5">
      <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-[var(--surface-a10)] rounded-lg">
        {type === "logins" && <TabsTrigger value="login">Logins</TabsTrigger>}
        {type === "identities" && (
          <TabsTrigger value="identity">Identity</TabsTrigger>
        )}
        {type === "notes" && <TabsTrigger value="notes">Notes</TabsTrigger>}
        {type === "cards" && <TabsTrigger value="cards">Notes</TabsTrigger>}

        <TabsTrigger value="bin">Bin</TabsTrigger>
      </TabsList>

      {type === "logins" && (
        <TabsContent value="login">
          <PasswordTable
            title={type}
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {type === "identities" && (
        <TabsContent value="identity">
          <IdentitySection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

      {type === "notes" && (
        <TabsContent value="notes">
          <SecureNotesSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}
      {type === "cards" && (
        <TabsContent value="card">
          <CardSection
            passwords={passwords}
            setPasswords={setPasswords}
            setBin={setBin}
          />
        </TabsContent>
      )}

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
