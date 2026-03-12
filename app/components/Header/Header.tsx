"use client";

import Link from "next/link";

const Header = () => (
  <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
    <Link href="/" className="text-base font-semibold text-zinc-900 hover:text-zinc-700">
      Memorator
    </Link>
    <nav className="flex items-center gap-4">
      <Link href="/sign-in" className="text-sm text-zinc-600 hover:text-zinc-900">
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Sign up
      </Link>
    </nav>
  </header>
);

export default Header;
