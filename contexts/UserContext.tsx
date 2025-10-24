"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

type UserContextType = {
  user: ReturnType<typeof useUser>["user"] | null;
  isSignedIn: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn } = useUser();

  return (
    <UserContext.Provider value={{ user, isSignedIn: !!isSignedIn }}>
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
