// src/components/About.tsx
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Rocket, Sparkles } from "lucide-react";
import { aboutCards, beyondCards, quotes, site } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

const icons = [GraduationCap, Briefcase, Sparkles, Rocket];

export function About() {
  return (
    <>
      <section id="about" className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Digital Journey"
            title={
              <>
                Aditi&apos;s Digital Journey
                <br />
                <span className="text-gradient-blue">code, craft & curiosity</span>
              </>
            }
            description="Full Stack Developer, Generative AI enthusiast, entrepreneur, and community-driven leader — passionate about building impactful and aesthetically driven digital experiences."
          />

          <div className="relative mt-16">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent md:block md:left-8" />
            <div className="grid gap-5 md:grid-cols-2">
              {aboutCards.map((card, i) => {
                const Icon = icons[i] ?? Sparkles;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="glass holo-border group relative overflow-hidden rounded-2xl p-6 transition hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.4)]"
                  >
                    <div className="flex gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                        <Icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-slate-100">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Beyond the screen"
            title="Outside the technical world"
            description="Beyond development, building meaningful connections, leading communities, and growing through collaboration."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {beyondCards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass holo-border rounded-2xl p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {c.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-gradient-blue">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-slate-400">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong holo-border rounded-3xl p-10 text-center sm:p-16"
          >
            <p className="font-display text-2xl font-medium text-gradient sm:text-3xl">
              &ldquo;{quotes[0]}&rdquo;
            </p>
            <p className="mt-6 text-sm text-slate-500">— {site.name}</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
