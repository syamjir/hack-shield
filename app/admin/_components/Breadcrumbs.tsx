"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const parts = pathname
    .toLowerCase() // normalize
    .split("/")
    .filter(Boolean);

  const nameMap: Record<string, string> = {
    admin: "Admin",
    chats: "Chats",
    users: "Users",
    home: "Home",
    notification: "Notification",
  };

  const breadcrumbs = parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/");
    return {
      name: nameMap[part] || part,
      href,
    };
  });

  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      <Link href="/admin">Dashboard</Link>

      {breadcrumbs.map((crumb, i) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={14} />
          {i === breadcrumbs.length - 1 ? (
            <span className="text-[var(--primary-a20)] font-medium">
              {crumb.name}
            </span>
          ) : (
            <Link href={crumb.href}>{crumb.name}</Link>
          )}
        </div>
      ))}
    </nav>
  );
}
