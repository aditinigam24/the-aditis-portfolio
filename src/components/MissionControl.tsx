import { motion } from "framer-motion";
import { missionControl } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function MissionControl() {
  return (
    <section id="mission" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Mission Control"
          title="Why work with me"
          description="I don't just build projects — I build impact through technology, design, and innovation."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {missionControl.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass holo-border group relative overflow-hidden rounded-2xl p-5"
            >
              <div className="flex items-end justify-between">
                <span className="font-display text-2xl font-bold text-gradient-blue">
                  {item.metric}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  {item.label}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                />
              </div>
              <h3 className="mt-4 font-display text-sm font-semibold text-slate-200">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
