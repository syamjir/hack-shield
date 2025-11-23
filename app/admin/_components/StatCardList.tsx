"use client";
import React from "react";
import { StatCard } from "./StatCard";
import { useAdminStats } from "@/contexts/AdminStatsContext";
import { Spinner } from "@/components/ui/spinner";

export function StatCardList() {
  const { totalUsers, newRegistrations, error, loading } = useAdminStats();
  console.log(newRegistrations);
  if (error) {
    return <div className="p-6 text-red-500">error</div>;
  }
  if (loading) {
    return (
      <div className="p-6 text-gray-500 flex gap-2 items-center">
        <p>Loading...</p>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* USERS */}
      <StatCard
        label="Total Users"
        value={String(totalUsers)}
        footer="+12 this week"
      />

      {/* ACTIVE CHATS */}
      <StatCard label="Active Chats" value={"0"} footer="Live conversations" />

      {/* NEW USERS */}
      <StatCard
        label="New Registrations"
        value={String(newRegistrations)}
        footer="Last 7 days"
      />

      {/* SYSTEM HEALTH */}
      <StatCard
        label="System Status"
        value="Healthy"
        footer="0 incidents"
        valueClass="text-green-400"
      />
    </div>
  );
}
