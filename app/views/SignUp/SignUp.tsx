import Link from "next/link";
import useSignUp from "./useSignUp";

const SignUp = () => {
	const { handleSubmit, isSubmitting, error, success, login, setLogin, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, passwordsMatch } = useSignUp();
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-md">
        <div className="border-b border-zinc-200 bg-blue-50 px-6 py-4 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-600">Sign up to start using Memorator.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
              Login
            </label>
            <input
              id="login"
              name="login"
              type="text"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="your_login"
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-800">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {password.length > 0 && confirmPassword.length > 0 && !passwordsMatch ? (
              <p className="text-xs text-red-600">Passwords must match.</p>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" aria-live="polite">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" aria-live="polite">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          <p className="pt-1 text-center text-xs text-zinc-500">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </form>

        <div className="border-t border-zinc-200 px-6 py-4 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
    )
}

export default SignUp;