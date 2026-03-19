import Link from "next/link";

const exercises = [
  { id: "flashcards", name: "Flashcards", description: "Classic front/back card review" },
  { id: "multiple-choice", name: "Multiple Choice", description: "Pick the correct translation" },
  { id: "fill-in-the-blank", name: "Fill in the Blank", description: "Type the missing word" },
  { id: "listening", name: "Listening Practice", description: "Hear and identify the word" },
  { id: "spelling", name: "Spelling Practice", description: "Type the word from memory" },
  { id: "writing", name: "Writing Practice", description: "Translate full sentences" },
];

const ExerciseGrid = () => (
  <section>
    <h2 className="mb-1 text-lg font-semibold text-zinc-900">Exercises</h2>
    <p className="mb-5 text-sm text-zinc-500">Choose an exercise to practice your words.</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exercises.map((ex) => (
        <Link
          key={ex.id}
          href={`/exercises/${ex.id}`}
          className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <span className="text-sm font-semibold text-zinc-900">{ex.name}</span>
          <span className="mt-1 text-xs text-zinc-500">{ex.description}</span>
        </Link>
      ))}
    </div>
  </section>
);

export default ExerciseGrid;
