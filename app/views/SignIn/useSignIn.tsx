import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "@/app/data/endpoints.data";
import { useAuth, decodeJwtPayload } from "@/app/context/AuthContext";

type SignInPayload = {
  identifier: string;
  password: string;
};

const useSignIn = () => {
  const router = useRouter();
  const { setIsLoggedIn, setUserId, setUserLogin } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload: SignInPayload = {
      identifier: identifier.trim(),
      password,
    };

    try {
      setIsSubmitting(true);

      const res = await fetch(ENDPOINTS.signIn, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Sign in failed. Please try again.";
        try {
          const data = (await res.json()) as { message?: string; error?: string };
          message = data.message ?? data.error ?? message;
        } catch {
          // ignore JSON parse errors
        }
        setError(message);
        return;
      }

      const data = await res.json() as Record<string, unknown>;

      for (const [key, value] of Object.entries(data)) {
        document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; path=/; sameSite=lax`;
      }

      const accessToken = data.accessToken as string | undefined;
      if (accessToken) {
        const jwtPayload = decodeJwtPayload(accessToken);
        if (jwtPayload?.sub) setUserId(Number(jwtPayload.sub));
        if (jwtPayload?.login) setUserLogin(String(jwtPayload.login));
      }

      setSuccess("Signed in successfully. Redirecting...");
      setPassword("");
      setIsLoggedIn(true);
      router.push("/home");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { handleSubmit, isSubmitting, error, success, identifier, setIdentifier, password, setPassword };
};

export default useSignIn;
