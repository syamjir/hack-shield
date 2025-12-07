"use client";

import {
  Lock,
  Menu,
  X,
  LogOut,
  Users,
  MessageSquare,
  Home,
  Bell,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const navItems = [
    { name: " Home", href: ["/home"], icon: <Home className="w-5 h-5" /> },
    { name: "Overview", href: ["/admin"], icon: <Lock className="w-5 h-5" /> },
    {
      name: "Users",
      href: ["/admin/users"],
      icon: <Users className="w-5 h-5" />,
    },

    {
      name: "Chats",
      href: ["/admin/chats", "admin/chats/[userId]"],
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Notification",
      href: ["/admin/notification"],
      icon: <Bell className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    document.cookie = "jwt=; Max-Age=0; path=/;";
    router.push("/auth/login");
  };

  const isActive = (href: string | string[]) => {
    const paths = Array.isArray(href) ? href : [href];

    return paths.some((p) => {
      if (p.includes("[userId]")) {
        return pathname.startsWith("/admin/chats/");
      }
      return pathname === p;
    });
  };

  const getDefaultHref = (href: string | string[]) =>
    Array.isArray(href) ? href[0] : href;

  return (
    <>
      {/* ------- MOBILE TOP BAR ------- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--surface-a10)] border-b border-[var(--surface-a20)] flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Lock className="text-[var(--primary-a20)] w-5 h-5" />
          <h1 className="text-lg font-semibold text-[var(--primary-a20)]">
            Admin
          </h1>
        </div>

        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-[var(--primary-a20)]" />
        </button>
      </div>

      {/* ------- DESKTOP SIDEBAR ------- */}
      <aside className="hidden md:flex flex-col justify-between bg-[var(--surface-a10)] w-64 p-6 border-r border-[var(--surface-a20)] fixed top-0 left-0 bottom-0">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Lock className="text-[var(--primary-a20)]" />
            <h1 className="text-xl font-bold text-[var(--primary-a20)]">
              Admin Panel
            </h1>
          </div>

          <nav className="flex flex-col gap-5 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={getDefaultHref(item.href)}
                className={`flex items-center gap-2 transition ${
                  hasMounted && isActive(item.href)
                    ? "text-[var(--primary-a20)] font-medium"
                    : "text-[var(--surface-a40)] hover:text-[var(--primary-a20)]"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-[var(--surface-a40)] hover:text-[var(--primary-a20)]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* ------- MOBILE DRAWER SIDEBAR ------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--surface-a10)] z-50 border-r border-[var(--surface-a20)] flex flex-col justify-between p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                    <Lock className="text-[var(--primary-a20)]" />
                    <h1 className="text-xl font-bold text-[var(--primary-a20)]">
                      Admin Panel
                    </h1>
                  </div>

                  <button onClick={() => setOpen(false)}>
                    <X className="text-[var(--primary-a20)] w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4 text-sm">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={getDefaultHref(item.href)}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 transition ${
                        isActive(item.href)
                          ? "text-[var(--primary-a20)] font-medium"
                          : "text-[var(--surface-a40)] hover:text-[var(--primary-a20)]"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-[var(--surface-a40)] hover:text-[var(--primary-a20)]"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
