const features = [
  {
    icon: "🧠",
    title: "Spaced Repetition",
    description:
      "Memorator schedules reviews at the optimal moment — right before you forget. Study less, remember more.",
  },
  {
    icon: "⚡",
    title: "Instant Flashcards",
    description:
      "Create cards in seconds. Add a front, a back, and you're ready. No templates, no friction.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description:
      "See exactly how many cards you've mastered, what's due today, and how your retention is trending.",
  },
  {
    icon: "🔒",
    title: "Your Data, Secure",
    description:
      "Cards are tied to your account and stored safely. Sign in from any device and pick up where you left off.",
  },
];

const Features = () => (
  <section className="mx-auto w-full max-w-5xl px-6 py-20">
    <h2 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
      Everything you need to study smarter
    </h2>
    <p className="mb-12 text-center text-sm text-zinc-500">
      No bloat. Just the tools that actually help you memorize.
    </p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-2xl border border-zinc-200 p-6 shadow-sm bg-white"
        >
          <span className="text-3xl">{f.icon}</span>
          <h3 className="mt-3 text-sm font-semibold text-zinc-900">{f.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{f.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
