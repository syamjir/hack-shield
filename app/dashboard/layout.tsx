"use client";

import { Lock, LogOut, Menu, X, Shield, Settings, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      name: "Security",
      href: "/dashboard/security",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    router.push("/");
  };

  return (
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
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 transition ${
                  pathname === item.href
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
      <div className="fixed md:hidden top-0 left-0 right-0 z-50 bg-[var(--surface-a10)] border-b border-[var(--surface-a20)] flex items-center justify-around p-4">
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
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ====== MOBILE SIDEBAR (Slide + Overlay) ====== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dim background */}
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Sidebar */}
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
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 transition ${
                        pathname === item.href
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
      <main className="flex-1 px-5 md:px-10 pt-20 md:pt-6 md:pb-6  w-full md:ml-64 h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full overflow-hidden"
        >
          {children}
        </motion.div>
      </main>

      {/* ====== MOBILE BOTTOM NAVIGATION ====== */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[var(--surface-a10)] border-t border-[var(--surface-a20)] flex justify-around py-3 z-30">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs transition ${
              pathname === item.href
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
  );
}
