"use client";

import {
  Lock,
  LogOut,
  Menu,
  X,
  Shield,
  Settings,
  Home,
  UserSquare2,
  FileText,
  CreditCard,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/home", icon: <Home className="w-5 h-5" /> },
    {
      name: "Overview",
      href: ["/dashboard"],
      icon: <Lock className="w-5 h-5" />,
    },
    {
      name: "Logins",
      href: ["/dashboard/logins"],
      icon: <Lock className="w-5 h-5" />,
    },
    {
      name: "Identities",
      href: ["/dashboard/identities", "/dashboard/identities/bin"],
      icon: <UserSquare2 className="w-5 h-5" />,
    },
    {
      name: "Notes",
      href: ["/dashboard/notes"],
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Cards",
      href: ["/dashboard/cards"],
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Chats",
      href: ["/dashboard/chats"],
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: ["/dashboard/settings"],
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Security",
      href: ["/dashboard/security"],
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    router.push("/");
  };

  // Breadcrumbs
  const Breadcrumbs = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    const nameMap: Record<string, string> = {
      dashboard: "Dashboard",
      logins: "Logins",
      identities: "Identities",
      notes: "Secure Notes",
      cards: "Cards",
      bin: "Bin",
      settings: "Settings",
      security: "Security",
      home: "Home",
    };

    const breadcrumbs = pathParts.map((part, index) => {
      const href = "/" + pathParts.slice(0, index + 1).join("/");
      return { name: nameMap[part] || part, href };
    });

    return (
      <nav
        className="flex items-center gap-1 text-sm text-[var(--surface-a40)] mb-4 overflow-x-auto whitespace-nowrap"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard">Overview</Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-[var(--surface-a30)]" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-[var(--primary-a20)] font-medium">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-[var(--primary-a20)] transition"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  };

  const isActive = (href: string | string[]) =>
    Array.isArray(href) ? href.includes(pathname) : pathname === href;

  const getDefaultHref = (href: string | string[]) =>
    Array.isArray(href) ? href[0] : href;

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-[var(--surface-a0)] text-[var(--surface-a50)] relative">
        {/* ====== SIDEBAR (Desktop) ====== */}
        <aside className="hidden md:flex flex-col justify-between bg-[var(--surface-a10)] w-64 p-6 border-r border-[var(--surface-a20)] fixed top-0 left-0 h-full">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <Lock className="text-[var(--primary-a20)]" />
              <h1 className="text-xl font-bold text-[var(--primary-a20)]">
                PassKeeper
              </h1>
            </div>
            <nav className="flex flex-col gap-5 text-sm">
              {navItems.map((item) => (
                <Link
                  key={getDefaultHref(item.href)}
                  href={getDefaultHref(item.href)}
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
            className="flex items-center gap-3 text-[var(--surface-a40)] hover:text-[var(--primary-a20)] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </aside>

        {/* ====== MOBILE HEADER ====== */}
        <div className="fixed md:hidden top-0 left-0 right-0 z-50 bg-[var(--surface-a10)] border-b border-[var(--surface-a20)] flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Lock className="text-[var(--primary-a20)] w-5 h-5" />
            <h1 className="text-lg font-semibold text-[var(--primary-a20)]">
              PassKeeper
            </h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[var(--primary-a20)]"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ====== MOBILE SIDEBAR ====== */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                key="mobile-menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-64 bg-[var(--surface-a10)] border-r border-[var(--surface-a20)] z-50 flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <Lock className="text-[var(--primary-a20)]" />
                      <h1 className="text-xl font-bold text-[var(--primary-a20)]">
                        PassKeeper
                      </h1>
                    </div>
                    <button onClick={() => setMenuOpen(false)}>
                      <X className="text-[var(--primary-a20)] w-5 h-5" />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-4 text-sm">
                    {navItems.map((item) => (
                      <Link
                        key={getDefaultHref(item.href)}
                        href={getDefaultHref(item.href)}
                        onClick={() => setMenuOpen(false)}
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
                  className="flex items-center gap-3 mt-6 text-[var(--surface-a40)] hover:text-[var(--primary-a20)] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ====== MAIN CONTENT ====== */}
        <main className="flex-1 sm:pt-0 pt-13 px-4 sm:px-6 lg:px-10 md:ml-64 overflow-y-auto h-screen">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pb-24 relative"
          >
            <div className="sticky top-0 sm:z-50 z-0 bg-surface-a0 pt-6 pb-1">
              <Breadcrumbs />
            </div>

            <div className="pt-1">{children}</div>
          </motion.div>
        </main>

        {/* ====== MOBILE BOTTOM NAVIGATION ====== */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[var(--surface-a10)] border-t border-[var(--surface-a20)] flex justify-around py-3 z-30">
          {navItems.map((item) => (
            <Link
              key={getDefaultHref(item.href)}
              href={getDefaultHref(item.href)}
              className={`flex flex-col items-center text-xs transition ${
                isActive(item.href)
                  ? "text-[var(--primary-a20)]"
                  : "text-[var(--surface-a40)] hover:text-[var(--primary-a20)]"
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </DashboardProvider>
  );
}
