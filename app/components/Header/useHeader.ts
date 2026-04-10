"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/app/data/endpoints.data";
import { useAuth } from "@/app/context/AuthContext";

const useHeader = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLogoutPopUpOpen, setIsLogoutPopUpOpen] = useState(false);

  const handleLogout = async () => {
    const refreshTokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];
    const refreshToken = refreshTokenCookie
      ? JSON.parse(decodeURIComponent(refreshTokenCookie))
      : null;

    try {
      await fetch(ENDPOINTS.logout, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore network errors — still clear session
    } finally {
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
      setIsLoggedIn(false);
      router.push("/");
    }
  };

  return {
    isLoggedIn,
    isLogoutPopUpOpen,
    openLogoutPopUp: () => setIsLogoutPopUpOpen(true),
    closeLogoutPopUp: () => setIsLogoutPopUpOpen(false),
    handleLogout,
  };
};

export default useHeader;
