import WordList from "@/app/views/WordList";

type Props = {
  params: Promise<{ userLogin: string; wordListName: string }>;
};

const WordListPage = async ({ params }: Props) => {
  const { userLogin, wordListName } = await params;
  return <WordList userLogin={userLogin} wordListName={decodeURIComponent(wordListName)} />;
};

export default WordListPage;
