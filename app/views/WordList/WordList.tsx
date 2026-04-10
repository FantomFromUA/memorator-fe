"use client";

import { useState } from "react";
import Link from "next/link";
import PopUp from "@/app/components/PopUp";
import Skeleton from "@/app/components/Skeleton";
import AddWordForm from "@/app/views/Dashboard/components/AddWordForm";
import useWordList, { type Word } from "./useWordList";

type Props = {
  userLogin: string;
  wordListName: string;
};

const WordCard = ({
  word,
  onDelete,
  onEdit,
}: {
  word: Word;
  onDelete: () => void;
  onEdit: (w: string, t: string) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(false);
  const [editWord, setEditWord] = useState(word.word);
  const [editTranslation, setEditTranslation] = useState(word.translation);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editWord.trim() || !editTranslation.trim()) return;
    setEditError(null);
    try {
      setIsSaving(true);
      await onEdit(editWord.trim(), editTranslation.trim());
      setEditing(false);
    } catch {
      setEditError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-300 bg-white p-4 shadow-sm">
        <input
          value={editWord}
          onChange={(e) => setEditWord(e.target.value)}
          className="mb-2 w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
          placeholder="Word"
        />
        <input
          value={editTranslation}
          onChange={(e) => setEditTranslation(e.target.value)}
          className="mb-3 w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
          placeholder="Translation"
        />
        {editError && <p className="mb-2 text-xs text-red-600">{editError}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => { setEditing(false); setEditWord(word.word); setEditTranslation(word.translation); }}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-semibold text-zinc-900">{word.word}</p>
      <p className="mt-0.5 text-sm text-zinc-500">{word.translation}</p>
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <button
          onClick={() => setEditing(true)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-blue-600"
          aria-label="Edit word"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
          aria-label="Delete word"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const WordList = ({ userLogin, wordListName }: Props) => {
  const { words, isLoading, error, handleAddWord, handleDeleteWord, handleEditWord } = useWordList({ userLogin, wordListName });
  const [wordIdToDelete, setWordIdToDelete] = useState<number | null>(null);

  const decoded = decodeURIComponent(wordListName);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link href="/home" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </Link>

      <p className="mb-1 text-sm text-zinc-400">{userLogin}</p>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">{decoded}</h1>

      <div className="mb-10">
        <AddWordForm onSubmit={handleAddWord} />
      </div>

      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : words.length === 0 ? (
        <p className="text-sm text-zinc-500">No words yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w) => (
            <WordCard
              key={w.id}
              word={w}
              onDelete={() => setWordIdToDelete(w.id)}
              onEdit={(word, translation) => handleEditWord(w.id, word, translation)}
            />
          ))}
        </div>
      )}

      <PopUp
        isOpen={wordIdToDelete !== null}
        title="Delete word"
        message="Are you sure you want to delete this word?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (wordIdToDelete !== null) handleDeleteWord(wordIdToDelete);
          setWordIdToDelete(null);
        }}
        onCancel={() => setWordIdToDelete(null)}
      />
    </div>
  );
};

export default WordList;
