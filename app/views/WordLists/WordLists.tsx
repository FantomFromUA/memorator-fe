"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import PopUp from "@/app/components/PopUp";
import Skeleton from "@/app/components/Skeleton";
import useWordLists from "./useWordLists";

const WordLists = () => {
  const { userLogin } = useAuth();
  const { lists, isLoading, newListName, setNewListName, handleCreate, isSubmitting, error, handleDelete } = useWordLists();
  const [listIdToDelete, setListIdToDelete] = useState<number | null>(null);

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        <p className="text-sm text-zinc-500">No word lists yet. Create one above.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <div key={list.id} className="relative rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-blue-400 hover:shadow-md">
              <Link
                href={`/${userLogin}/${encodeURIComponent(list.name)}`}
                className="block p-5"
              >
                <p className="font-semibold text-zinc-900">{list.name}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {list.wordCount} {list.wordCount === 1 ? "word" : "words"} · {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); setListIdToDelete(list.id); }}
                className="absolute right-3 top-3 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
                aria-label={`Delete ${list.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <PopUp
        isOpen={listIdToDelete !== null}
        title="Delete word list"
        message="This will permanently delete the list and all its words. Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (listIdToDelete !== null) handleDelete(listIdToDelete);
          setListIdToDelete(null);
        }}
        onCancel={() => setListIdToDelete(null)}
      />
    </div>
  );
};

export default WordLists;
