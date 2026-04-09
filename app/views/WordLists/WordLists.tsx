"use client";

import Link from "next/link";
import useWordLists from "./useWordLists";

const WordLists = () => {
  const { lists, isLoading, newListName, setNewListName, handleCreate, isSubmitting, error } = useWordLists();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">My word lists</h1>

      <form onSubmit={handleCreate} className="mb-10 flex gap-3">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newListName.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create list"}
        </button>
      </form>

      {error && (
        <p className="mb-6 text-sm text-red-600">{error}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : lists.length === 0 ? (
        <p className="text-sm text-zinc-500">No word lists yet. Create one above.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/word-list/${list.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
            >
              <p className="font-semibold text-zinc-900">{list.name}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordLists;
