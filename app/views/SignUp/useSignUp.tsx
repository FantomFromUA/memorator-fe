import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SignUpPayload = {
  login: string;
  email: string;
  password: string;
};

const useSignUp = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_MEMORATOR_BE_API_URL ?? "";
  const SIGN_UP_URL = API_BASE_URL
    ? `${API_BASE_URL.replace(/\/+$/, "")}/users/register`
    : "/api/auth/sign-up";

  const router = useRouter();

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordsMatch = useMemo(
    () => password.length > 0 && confirmPassword.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload: SignUpPayload = {
      login: login.trim(),
      email: email.trim(),
      password,
    };

    try {
      setIsSubmitting(true);

      const res = await fetch(SIGN_UP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Sign up failed. Please try again.";
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

      setSuccess("Account created successfully. Redirecting...");
      setPassword("");
      setConfirmPassword("");

      router.push("/home");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { handleSubmit, isSubmitting, error, success, login, setLogin, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, passwordsMatch };
}

export default useSignUp;