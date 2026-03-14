import Link from "next/link";

const CtaBanner = () => (
  <section className="bg-blue-600 px-6 py-16 text-center">
    <h2 className="text-2xl font-bold text-white">Start memorizing today</h2>
    <p className="mt-2 text-sm text-blue-100">
      Free to use. No credit card required.
    </p>
    <Link
      href="/sign-up"
      className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
    >
      Create your account
    </Link>
  </section>
);

export default CtaBanner;
