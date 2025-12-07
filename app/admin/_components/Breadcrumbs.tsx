"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const parts = pathname.split("/").filter(Boolean);
  const lastPart = parts.at(-1) || "";
  const parentPart = parts.at(-2) || "";

  // Only treat strings as IDs if they match MongoDB ObjectId format
  const looksLikeId = /^[0-9a-fA-F]{24}$/.test(lastPart);

  const nameMap: Record<string, string> = {
    admin: "Admin",
    chats: "Chats",
    users: "Users",
    home: "Home",
    notification: "Notification",
  };

  const breadcrumbs = parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/");

    let name = nameMap[part] || part;

    // Only override name for last part if it looks like an ObjectId
    if (index === parts.length - 1 && looksLikeId) {
      if (parentPart === "users") name = "User Info";
      else if (parentPart === "chats") name = "Chat Room";
      else name = "Detail";
    }

    return { name, href };
  });

  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      <Link href="/admin">Dashboard</Link>

      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={14} />

          {crumb.href === pathname ? (
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
