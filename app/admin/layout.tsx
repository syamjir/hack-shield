"use client";

import { ReactNode } from "react";
import AdminSidebar from "../admin/_components/AdminSidebar"; // adjust your path
import { AdminStatsProvider } from "@/contexts/AdminStatsContext";
import Breadcrumbs from "./_components/Breadcrumbs";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminStatsProvider>
      <div className="flex min-h-screen bg-[var(--surface-a0)] text-[var(--surface-a50)]">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Wrapper */}
        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-10 pt-20 md:pt-6 pb-10 overflow-y-auto">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </AdminStatsProvider>
  );
}
