"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useHeader = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("accessToken="));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(hasToken);
  }, []);

  const handleLogout = () => {
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push("/");
  };

  return { isLoggedIn, handleLogout };
};

export default useHeader;
