"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR mismatch

  const parts = pathname.split("/").filter(Boolean);
  const lastPart = parts[parts.length - 1];
  const parentPart = parts[parts.length - 2] || "";

  const looksLikeId = lastPart.length > 10; // MongoDB-like ID

  const nameMap: Record<string, string> = {
    admin: "Admin",
    chats: "Chats",
    users: "Users",
    home: "Home",
  };

  const breadcrumbs = parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/");

    let label: string;
    if (index === parts.length - 1 && looksLikeId) {
      if (parentPart === "users") {
        label = "User Info";
      } else if (parentPart === "chats") {
        label = "Chat Room";
      } else {
        label = "Detail";
      }
    } else {
      label = nameMap[part] || part;
    }

    return { name: label, href };
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
