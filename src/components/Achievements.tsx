// src/components/Achievements.tsx
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { achievements } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function Achievements() {
  return (
    <section id="achievements" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Achievements"
          title="Impact beyond code"
          description="Leadership, entrepreneurship, and community — measured in real outcomes."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass holo-border flex gap-4 rounded-2xl p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-100">
                  {a.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
