"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/data/endpoints.data";
import { useAuth } from "@/app/context/AuthContext";
import useFetchWithAuth from "@/app/utils/useFetchWithAuth";

export type WordList = {
  id: number;
  name: string;
  createdAt: string;
  wordCount: number;
};

const useWordLists = () => {
  const { userId } = useAuth();
  const fetchWithAuth = useFetchWithAuth();
  const [lists, setLists] = useState<WordList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId === null) return;
    setIsLoading(true);
    fetchWithAuth(ENDPOINTS.wordListsByUser(userId))
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WordList[]) => setLists(data))
      .catch(() => setError("Failed to load word lists."))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchWithAuth is stable but not memoized with a stable reference across renders
  }, [userId]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newListName.trim() || userId === null) return;
    setError(null);

    try {
      setIsSubmitting(true);
      const res = await fetchWithAuth(ENDPOINTS.wordLists, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newListName.trim() }),
      });

      if (!res.ok) {
        let message = "Failed to create list. Please try again.";
        try {
          const data = (await res.json()) as { message?: string; error?: string };
          message = data.message ?? data.error ?? message;
        } catch { /* ignore */ }
        setError(message);
        return;
      }

      const created = (await res.json()) as WordList;
      setLists((prev) => [created, ...prev]);
      setNewListName("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (listId: number) => {
    try {
      await fetchWithAuth(ENDPOINTS.wordList(listId), { method: "DELETE" });
      setLists((prev) => prev.filter((l) => l.id !== listId));
    } catch {
      setError("Failed to delete list. Please try again.");
    }
  };

  return { lists, isLoading, newListName, setNewListName, handleCreate, isSubmitting, error, handleDelete };
};

export default useWordLists;
