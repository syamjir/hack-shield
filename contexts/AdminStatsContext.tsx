"use client";

import { IUser } from "@/models/User";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AdminStatsContextType = {
  users: IUser[];
  totalUsers: number;
  newRegistrations: number;
  systemStatus: "Healthy" | "Warning" | "Down";
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
};

const AdminStatsContext = createContext<AdminStatsContextType | undefined>(
  undefined
);

export function AdminStatsProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRegistrations, setNewRegistrations] = useState(0);
  const [systemStatus, setSystemStatus] = useState<
    "Healthy" | "Warning" | "Down"
  >("Healthy");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // fetch all users
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/data",
        },
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const fetchedUsers: IUser[] = data.data;

      // total users
      setUsers(fetchedUsers);
      setTotalUsers(fetchedUsers.length);

      // new registrations in last 7 days
      const recent = fetchedUsers.filter(
        (u) =>
          new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      setNewRegistrations(recent.length);

      // simple system health logic
      setSystemStatus(fetchedUsers.length > 0 ? "Healthy" : "Warning");

      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminStatsContext.Provider
      value={{
        users,
        totalUsers,
        newRegistrations,
        systemStatus,
        loading,
        error,
        refreshStats: fetchStats,
      }}
    >
      {children}
    </AdminStatsContext.Provider>
  );
}

export function useAdminStats() {
  const ctx = useContext(AdminStatsContext);
  if (!ctx) throw new Error("useAdminStats must be inside AdminStatsProvider");
  return ctx;
}
