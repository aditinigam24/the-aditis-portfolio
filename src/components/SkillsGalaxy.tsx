// src/components/SkillsGalaxy.tsx
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { skills } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function SkillsGalaxy() {
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="skills" className="relative overflow-hidden px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Skills Galaxy"
          title="Technologies in orbit"
          description="Tools I reach for to ship intelligent, beautiful, and reliable products."
        />

        <div className="relative mx-auto mt-20 flex aspect-square max-w-2xl items-center justify-center">
          {!mobile && (
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full animate-[spin_120s_linear_infinite] opacity-30"
              viewBox="0 0 400 400"
            >
              <circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="0.5"
                strokeDasharray="4 8"
              />
              <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.3"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="orbitGrad">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          )}

          <div className="relative z-10 grid h-24 w-24 place-items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,0.3)]">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-cyan-300">
              Core
            </span>
          </div>

          {mobile ? (
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 content-center">
              {skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="glass holo-border rounded-xl p-4 text-center"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {s.category}
                  </p>
                  <p className="font-display text-sm font-semibold text-cyan-300">
                    {s.name}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            skills.map((s, i) => {
              const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
              const r = 42;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  className="absolute w-28 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="glass holo-border group rounded-2xl p-3 text-center transition hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      {s.category}
                    </p>
                    <p className="font-display text-sm font-semibold text-gradient-blue">
                      {s.name}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
