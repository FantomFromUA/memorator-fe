"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getCookieValue, decodeJwtPayload } from "@/app/context/AuthContext";
import { ENDPOINTS } from "@/app/data/endpoints.data";

const useFetchWithAuth = () => {
  const { setIsLoggedIn, setUserId } = useAuth();
  const router = useRouter();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = getCookieValue("accessToken");

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (res.status !== 401) return res;

    // Access token expired — try to refresh
    const refreshToken = getCookieValue("refreshToken");
    if (!refreshToken) return logout();

    const refreshRes = await fetch(ENDPOINTS.refreshToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) return logout();

    const data = (await refreshRes.json()) as { accessToken: string; refreshToken: string };
    document.cookie = `accessToken=${encodeURIComponent(JSON.stringify(data.accessToken))}; path=/; sameSite=lax`;
    document.cookie = `refreshToken=${encodeURIComponent(JSON.stringify(data.refreshToken))}; path=/; sameSite=lax`;

    const payload = decodeJwtPayload(data.accessToken);
    if (payload?.sub) setUserId(Number(payload.sub));

    // Retry original request with fresh token
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
    });

    function logout(): Response {
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
      setIsLoggedIn(false);
      router.push("/");
      return res;
    }
  }, [setIsLoggedIn, setUserId, router]);

  return fetchWithAuth;
};

export default useFetchWithAuth;
