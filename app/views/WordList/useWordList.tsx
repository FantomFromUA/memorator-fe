"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/data/endpoints.data";
import { useAuth } from "@/app/context/AuthContext";
import useFetchWithAuth from "@/app/utils/useFetchWithAuth";

export type Word = { id: number; word: string; translation: string };

type WordListMeta = { id: number; name: string };

const useWordList = ({ userLogin, wordListName }: { userLogin: string; wordListName: string }) => {
  const { userId } = useAuth();
  const fetchWithAuth = useFetchWithAuth();

  const [wordListId, setWordListId] = useState<number | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId === null) return;
    setIsLoading(true);
    setError(null);

    fetchWithAuth(ENDPOINTS.wordListsByUser(userId))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load lists"))))
      .then((lists: WordListMeta[]) => {
        const decoded = decodeURIComponent(wordListName);
        const match = lists.find((l) => l.name === decoded);
        if (!match) throw new Error("Word list not found");
        setWordListId(match.id);
        return fetchWithAuth(ENDPOINTS.wordsByList(match.id));
      })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load words"))))
      .then((data: Word[]) => setWords(data))
      .catch((err: Error) => setError(err.message ?? "Something went wrong"))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchWithAuth is stable but not memoized with a stable reference across renders
  }, [userId, wordListName]);

  const handleAddWord = async (word: string, translation: string) => {
    if (wordListId === null) return;
    const res = await fetchWithAuth(ENDPOINTS.wordsByList(wordListId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, translation }),
    });
    if (!res.ok) throw new Error("Failed to add word");
    const created = (await res.json()) as Word;
    setWords((prev) => [...prev, created]);
  };

  const handleDeleteWord = async (wordId: number) => {
    if (wordListId === null) return;
    await fetchWithAuth(ENDPOINTS.word(wordListId, wordId), { method: "DELETE" });
    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  const handleEditWord = async (wordId: number, word: string, translation: string) => {
    if (wordListId === null) return;
    const res = await fetchWithAuth(ENDPOINTS.word(wordListId, wordId), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, translation }),
    });
    if (!res.ok) throw new Error("Failed to update word");
    const updated = (await res.json()) as Word;
    setWords((prev) => prev.map((w) => (w.id === wordId ? updated : w)));
  };

  return { words, isLoading, error, wordListId, handleAddWord, handleDeleteWord, handleEditWord };
};

export default useWordList;
