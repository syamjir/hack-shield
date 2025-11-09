"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  href: string;
  icon?: React.ReactNode; // Optional icon for modern look
}

interface IdentitiesLayoutProps {
  children: React.ReactNode;
}

export default function IdentitiesLayout({ children }: IdentitiesLayoutProps) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { name: "Identities", href: "/dashboard/identities" },
    { name: "Bin", href: "/dashboard/identities/bin" },
  ];

  return (
    <div className="space-y-3">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
        <div>
          <h2 className="text-2xl font-bold text-primary-a20">Identities</h2>
          <p className="text-sm text-dark-a0/50">
            Manage your stored identity information and personal details.
          </p>
        </div>
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
    </div>
  );
}
