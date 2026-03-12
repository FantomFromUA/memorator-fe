import useSignIn from "./useSignIn";

const SignIn = () => {
  const { handleSubmit, isSubmitting, error, success, identifier, setIdentifier, password, setPassword } = useSignIn();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-md">
        <div className="border-b border-zinc-200 bg-blue-50 px-6 py-4 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-600">Sign in to your Memorator account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="space-y-1">
            <label htmlFor="identifier" className="block text-sm font-medium text-zinc-800">
              Login or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="your_login or email"
              autoComplete="username"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Your password"
              autoComplete="current-password"
            />
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
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="border-t border-zinc-200 px-6 py-4 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="font-medium text-blue-600 hover:text-blue-700">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
