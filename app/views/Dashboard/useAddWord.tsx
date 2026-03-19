"use client";

import { useState } from "react";

const useAddWord = () => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;

    setIsSubmitting(true);
    // TODO: call API to save word
    console.log("Adding word:", { word: word.trim(), translation: translation.trim() });
    setWord("");
    setTranslation("");
    setIsSubmitting(false);
  }

  return { word, setWord, translation, setTranslation, isSubmitting, handleSubmit };
};

export default useAddWord;
