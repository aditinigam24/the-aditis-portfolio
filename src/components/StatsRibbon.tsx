// src/components/StatsRibbon.tsx
import { motion } from "framer-motion";
import { Brain, Code2, Layers, Network, Rocket } from "lucide-react";

const stats = [
  { icon: Rocket, value: "20+", label: "Projects Completed" },
  { icon: Layers, value: "10+", label: "Technologies Mastered" },
  { icon: Brain, value: "2", label: "AI / Tech Internships" },
  { icon: Network, value: "1.5K+", label: "LinkedIn Network" },
  { icon: Code2, value: "Full Stack/AI", label: "Developer Identity" },
];

export function StatsRibbon() {
  return (
    <section className="relative z-20 border-y border-purple-500/10 bg-[#06030f]/80 px-4 py-6 backdrop-blur-md sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass-purple flex items-center gap-3 rounded-2xl px-4 py-3"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-purple-100">
                {s.value}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                {s.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
