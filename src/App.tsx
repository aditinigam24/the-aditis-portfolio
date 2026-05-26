import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { About } from "./components/About";
import { Achievements } from "./components/Achievements";
import { AILab } from "./components/AILab";
import { Contact } from "./components/Contact";
import { CursorGlow } from "./components/CursorGlow";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { StatsRibbon } from "./components/StatsRibbon";
import { Jerry } from "./components/Jerry";
import { LoadingScreen } from "./components/LoadingScreen";
import { MissionControl } from "./components/MissionControl";
import { Navbar } from "./components/Navbar";
import { Particles } from "./components/Particles";
import { Projects } from "./components/Projects";
import { SkillsGalaxy } from "./components/SkillsGalaxy";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen key="load" onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <div className="relative min-h-screen">
          <div className="fixed inset-0 -z-20 bg-[#06030f]" />
          <div className="fixed inset-0 -z-10 bg-gradient-to-b from-purple-950/30 via-[#06030f] to-[#06030f]" />
          <div className="fixed inset-0 -z-10 grid-bg opacity-40" />
          <Particles />
          <CursorGlow />
          <Navbar />
          <main>
            <Hero />
            <StatsRibbon />
            <About />
            <MissionControl />
            <SkillsGalaxy />
            <Projects />
            <AILab />
            <Experience />
            <Achievements />
            <Contact />
          </main>
          <Jerry />
        </div>
      )}
    </>
  );
}
