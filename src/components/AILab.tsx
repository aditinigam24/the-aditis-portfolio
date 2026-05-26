import { motion } from "framer-motion";
import { Brain, Cpu, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { aiLabProjects } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

const snippets = [
  "import { Agent } from '@neural/core'",
  "const jerry = new PortfolioGuide()",
  "await llm.analyze(workflows)",
  "export const intelligence = true",
];

export function AILab() {
  const [booted, setBooted] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const id = setInterval(() => setLine((l) => (l + 1) % snippets.length), 2200);
    return () => clearInterval(id);
  }, [booted]);

  return (
    <section id="ai-lab" className="relative overflow-hidden px-4 py-24 sm:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/10" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="AI Lab"
          title="Futuristic research facility"
          description="Neural interfaces, intelligent systems, and AI-powered products — enter the lab."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-strong holo-border mt-12 overflow-hidden rounded-3xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="font-mono text-xs text-slate-400">
              aditi-ai-lab — system init
            </span>
            <span className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-white/10 p-6 font-mono text-sm lg:border-b-0 lg:border-r">
              {booted ? (
                <>
                  <p className="text-green-400/90">&gt; NEURAL_NET: ONLINE</p>
                  <p className="text-cyan-400/90">&gt; JERRY_MODULE: LOADED</p>
                  <p className="text-purple-400/90">&gt; GEN_AI_PIPELINE: READY</p>
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-4 text-slate-300"
                  >
                    {snippets[line]}
                  </motion.p>
                </>
              ) : (
                <p className="animate-pulse text-slate-500">&gt; Initializing...</p>
              )}
            </div>

            <div className="relative flex min-h-[200px] items-center justify-center p-8">
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                    style={{
                      top: `${12 + i * 10}%`,
                      animation: `data-stream ${3 + i * 0.3}s linear infinite`,
                    }}
                  />
                ))}
              </div>
              <Brain className="relative h-24 w-24 text-cyan-400/80 animate-pulse" />
              <Cpu className="absolute right-8 top-8 h-8 w-8 text-purple-400/50" />
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {aiLabProjects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass holo-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-green-400">{p.status}</span>
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-100">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
