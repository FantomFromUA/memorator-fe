import { useState } from "react";
import { useRouter } from "next/navigation";

type SignInPayload = {
  identifier: string;
  password: string;
};

const useSignIn = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_MEMORATOR_BE_API_URL ?? "";

  const SIGN_IN_URL = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/+$/, "")}/user/login`
    : "/api/auth/sign-in";

  const router = useRouter();

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

      const res = await fetch(SIGN_IN_URL, {
        method: "POST",
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

      setSuccess("Signed in successfully. Redirecting...");
      setPassword("");

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
