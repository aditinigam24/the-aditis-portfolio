import { motion } from "framer-motion";
import { projects } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

export function Projects() {
  return (
    <section id="projects" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Holographic Showcase"
          title="Projects that tell a story"
          description="A glimpse into the things I've built — engineered to feel as good as they work."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="group glass-strong holo-border relative overflow-hidden rounded-3xl p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.45)]"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/0 blur-3xl transition group-hover:bg-blue-500/15" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-500/0 blur-3xl transition group-hover:bg-purple-500/10" />

              <div className="relative flex items-start justify-between">
                <span className="font-display text-5xl font-bold text-white/10 group-hover:text-white/15">
                  {p.no}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-slate-100">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
