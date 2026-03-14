import Link from "next/link";

const Hero = () => (
  <section className="flex flex-col items-center px-6 py-24 text-center">
    <span className="mb-4 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      Open beta
    </span>
    <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-900">
      Remember everything you learn
    </h1>
    <p className="mt-5 max-w-xl text-lg text-zinc-500">
      Memorator uses spaced repetition to help you build a long-term memory for anything — one card at a time.
    </p>
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/sign-up"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Get started for free
      </Link>
      <Link
        href="/sign-in"
        className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
      >
        Sign in
      </Link>
    </div>
  </section>
);

export default Hero;
