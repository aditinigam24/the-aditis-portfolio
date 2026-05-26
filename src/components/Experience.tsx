import { motion } from "framer-motion";
import { timeline } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Experience"
          title="Chapters of a curious career"
        />

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent md:left-1/2" />
          <div className="space-y-10">
            {timeline.map((t, i) => {
              const right = i % 2 === 1;
              return (
                <motion.div
                  key={t.role + t.when}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative grid md:grid-cols-2 md:gap-12 ${right ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div
                    className={`pl-12 md:pl-0 ${right ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}
                  >
                    <span className="absolute left-4 top-2 -translate-x-1/2 md:left-1/2">
                      <span className="relative grid h-4 w-4 place-items-center">
                        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/40" />
                        <span className="relative h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-[0_0_16px_#3b82f6]" />
                      </span>
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                      {t.when} · {t.tag}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-slate-100">
                      {t.role}
                    </h3>
                    <p className="text-sm font-medium text-cyan-400">{t.org}</p>
                  </div>
                  <div
                    className={`mt-4 pl-12 md:mt-0 md:pl-0 ${right ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                  >
                    <div className="glass rounded-2xl p-5 text-sm text-slate-400">
                      {t.body}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
