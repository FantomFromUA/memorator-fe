import AddWordForm from "./components/AddWordForm";
import ExerciseGrid from "./components/ExerciseGrid";

const Dashboard = () => (
  <div className="mx-auto w-full max-w-5xl px-6 py-10">
    <h1 className="mb-8 text-2xl font-bold text-zinc-900">My workspace</h1>
    <div className="flex flex-col gap-10">
      <AddWordForm />
      <div className="border-t border-zinc-200" />
      <ExerciseGrid />
    </div>
  </div>
);

export default Dashboard;
