"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NoteForm from "./NoteForm";

interface Tab {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface IdentitiesLayoutProps {
  children: React.ReactNode;
}

export default function IdentitiesLayout({ children }: IdentitiesLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const tabs: Tab[] = [
    { name: "notes", href: "/dashboard/notes" },
    { name: "Bin", href: "/dashboard/notes/bin" },
  ];

  return (
    <div className="space-y-3">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
        <div>
          <h2 className="text-2xl font-bold text-primary-a20">Notes</h2>
          <p className="text-sm text-dark-a0/50">
            Manage your saved notes details.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary-a20 hover:bg-primary-a10 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4 mb-2 transition-all duration-200 shadow-md active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Add Notes</span>
        </Button>
      </div>

      {/* Sub-navigation */}
      <nav
        className="flex flex-wrap gap-1 sm:gap-4 bg-surface-a10 rounded-xl p-1 px-1 shadow-inner w-fit"
        aria-label="Identities sub-navigation"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-surface-a10 text-dark-a0 shadow-lg border-1 "
                  : "text-dark-a0 "
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              {tab.name}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      <main className="w-full">{children}</main>

      {/* Identity form modal */}
      <NoteForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
