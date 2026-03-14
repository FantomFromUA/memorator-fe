import CtaBanner from "./components/CtaBanner";
import Features from "./components/Features";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";

const Home = () => (
  <div className="flex flex-col">
    <Hero />

    <div className="mx-auto w-full max-w-5xl border-t border-zinc-200 px-6" />

    <Features />

    <div className="mx-auto w-full max-w-5xl border-t border-zinc-200 px-6" />

    <HowItWorks />

    <CtaBanner />
  </div>
);

export default Home;
