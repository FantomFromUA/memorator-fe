"use client";

import { useState } from "react";

type Props = {
  onSubmit: (word: string, translation: string) => Promise<void>;
};

const AddWordForm = ({ onSubmit }: Props) => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    setError(null);
    try {
      setIsSubmitting(true);
      await onSubmit(word.trim(), translation.trim());
      setWord("");
      setTranslation("");
    } catch {
      setError("Failed to add word. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold text-zinc-900">Add a word</h2>
      <p className="mb-5 text-sm text-zinc-500">Save a new word to this list.</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="word" className="text-xs font-medium text-zinc-700">
            Word
          </label>
          <input
            id="word"
            type="text"
            placeholder="e.g. serendipity"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="translation" className="text-xs font-medium text-zinc-700">
            Translation / Definition
          </label>
          <input
            id="translation"
            type="text"
            placeholder="e.g. a happy accident"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !word.trim() || !translation.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          Add word
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
};

export default AddWordForm;
