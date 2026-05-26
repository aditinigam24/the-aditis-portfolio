// src/components/LoadingScreen.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = { onComplete: () => void };

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("INITIALIZING NEURAL INTERFACE");

  useEffect(() => {
    const phases = [
      "INITIALIZING NEURAL INTERFACE",
      "LOADING HOLOGRAPHIC SYSTEMS",
      "SYNCING ADITI'S UNIVERSE",
      "ENTERING AI LAB",
    ];
    let i = 0;
    const phaseId = setInterval(() => {
      i = (i + 1) % phases.length;
      setPhase(phases[i]);
    }, 600);

    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / 2200) * 100);
      setProgress(p);
      if (p < 100) requestAnimationFrame(tick);
      else {
        clearInterval(phaseId);
        setTimeout(onComplete, 400);
      }
    };
    requestAnimationFrame(tick);
    return () => clearInterval(phaseId);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#06030f]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative text-center">
        <div className="font-display text-xs tracking-[0.4em] text-purple-400/80">
          {phase}
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-glow sm:text-3xl">
          <span className="text-gradient">THE ADITI&apos;S</span>
          <br />
          <span className="text-gradient-purple">PORTFOLIO</span>
        </h1>
        <div className="mx-auto mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-sm text-slate-500">
          {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}
