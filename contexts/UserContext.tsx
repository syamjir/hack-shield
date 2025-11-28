"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

type Role = "User" | "Admin" | null;
type UserContextType = {
  user: ReturnType<typeof useUser>["user"] | null;
  isSignedIn: boolean;
  role: Role;
  setRole: (role: Role) => void;
  autoLock: boolean;
  setAutoLock: (autoLock: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<Role>(null);
  const [autoLock, setAutoLock] = useState(true);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const roleFromLocal = localStorage.getItem("role");
    const autoLockFromLocal = !!localStorage.getItem("autoLock");
    const themeFromLocal = localStorage.getItem("theme");
    if (roleFromLocal === "User" || roleFromLocal === "Admin") {
      setRole(roleFromLocal);
    }
    if (autoLockFromLocal) setAutoLock(autoLockFromLocal);
    if (themeFromLocal) setTheme(themeFromLocal);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isSignedIn: !!isSignedIn,
        role,
        setRole,
        autoLock,
        setAutoLock,
        theme: theme || "dark",
        setTheme,
      }}
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
