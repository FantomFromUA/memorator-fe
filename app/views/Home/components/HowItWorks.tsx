const steps = [
  { number: "01", title: "Create an account", description: "Sign up in seconds with a login and email." },
  { number: "02", title: "Add flashcards", description: "Build decks around any topic — languages, code, science, anything." },
  { number: "03", title: "Review daily", description: "Memorator tells you what to study. You just show up." },
];

const HowItWorks = () => (
  <section className="mx-auto w-full max-w-3xl px-6 py-20">
    <h2 className="mb-2 text-center text-2xl font-semibold text-zinc-900">How it works</h2>
    <p className="mb-12 text-center text-sm text-zinc-500">
      Up and running in under two minutes.
    </p>
    <div className="flex flex-col gap-8 sm:flex-row">
      {steps.map((s) => (
        <div key={s.number} className="flex flex-1 flex-col items-center text-center">
          <span
            className="mb-3 flex h-12 w-12 items-center justify-center bg-blue-600 text-sm font-bold text-white"
            style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
          >
            {s.number}
          </span>
          <h3 className="text-sm font-semibold text-zinc-900">{s.title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{s.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
