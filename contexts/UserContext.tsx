"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useUser } from "@clerk/nextjs";

type Role = "User" | "Admin" | null;
type UserContextType = {
  user: ReturnType<typeof useUser>["user"] | null;
  isSignedIn: boolean;
  role: Role;
  setRole: (role: Role) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<Role>(null);
  useEffect(() => {
    const roleFromLocal = localStorage.getItem("role");
    if (roleFromLocal === "User" || roleFromLocal === "Admin") {
      setRole(roleFromLocal);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isSignedIn: !!isSignedIn, role, setRole }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within UserProvider");
  return context;
};
