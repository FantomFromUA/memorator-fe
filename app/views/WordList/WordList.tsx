"use client";

type Props = {
  userLogin: string;
  wordListName: string;
};

const WordList = ({ userLogin, wordListName }: Props) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="mb-1 text-sm text-zinc-400">{userLogin}</p>
      <h1 className="text-2xl font-bold text-zinc-900">{wordListName}</h1>
    </div>
  );
};

export default WordList;
