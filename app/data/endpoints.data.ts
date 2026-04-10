const BASE = (process.env.NEXT_PUBLIC_MEMORATOR_BE_API_URL ?? "").replace(/\/+$/, "");

export const ENDPOINTS = {
  signIn: `${BASE}/user/login`,
  signUp: `${BASE}/user/register`,
  logout: `${BASE}/user/logout`,
  refreshToken: `${BASE}/user/refresh`,
  wordLists: `${BASE}/word-lists`,
  wordListsByUser: (userId: number) => `${BASE}/word-lists/user/${userId}`,
  wordList: (id: number) => `${BASE}/word-lists/${id}`,
  wordsByList: (wordListId: number) => `${BASE}/word-lists/${wordListId}/words`,
  word: (wordListId: number, wordId: number) => `${BASE}/word-lists/${wordListId}/words/${wordId}`,
};
