"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userId: number | null;
  setUserId: (id: number | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userId: null,
  setUserId: () => {},
});

export const getCookieValue = (name: string): string | null => {
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  if (!row) return null;
  try {
    return JSON.parse(decodeURIComponent(row.split("=")[1]));
  } catch {
    return null;
  }
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = getCookieValue("accessToken");
    if (!token) return;
    setIsLoggedIn(true);
    const payload = decodeJwtPayload(token);
    if (payload?.sub) setUserId(Number(payload.sub));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
