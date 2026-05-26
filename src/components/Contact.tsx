// src/components/Contact.tsx
import { motion } from "framer-motion";
import { Mail, Send, Share2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { site } from "../data/portfolio";
import { SectionHeader } from "./SectionHeader";

const API_URL = import.meta.env.VITE_API_URL || "https://the-aditis-portfolio.onrender.com";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const question = String(data.get("question") ?? "");
    const message = String(data.get("message") ?? "");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
      console.error("Email error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openJerry = () => {
    window.dispatchEvent(new CustomEvent("jerry:open"));
  };

  return (
    <section id="contact" className="relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="glass-strong holo-border overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Communication Terminal"
                title="Let's build something impactful"
                description="Open to internships, collaborations, and conversations on AI, full stack engineering, and design-led products."
              />
              <button
                type="button"
                onClick={openJerry}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Have a quick question? Ask Jerry →
              </button>
              <div className="mt-8 space-y-3">
                <a
                  href={`mailto:${site.email}`}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-500/30"
                >
                  <Mail className="h-4 w-4 text-cyan-400" />
                  {site.email}
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-500/30"
                >
                  <Share2 className="h-4 w-4 text-cyan-400" />
                  {site.linkedinLabel}
                </a>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {(["name", "email", "question"] as const).map((field) => (
                <label key={field} className="block">
                  <span className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    {field === "question" ? "Your question" : field}
                  </span>
                  <input
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50 focus:bg-white/[0.06]"
                    placeholder={
                      field === "email"
                        ? "you@domain.com"
                        : field === "question"
                          ? "Internship, collaboration…"
                          : "Your name"
                    }
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me what you're building…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
                />
              </label>
              {error && (
                <div className="flex gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {sent && (
                <div className="flex gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-300">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Message sent! Check your email for confirmation.</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.8)] transition hover:opacity-95 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending…" : sent ? "Message sent! 🎉" : "Transmit Message"}
              </button>
            </motion.form>
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 {site.name} · All rights reserved.</span>
          <span className="font-display tracking-[0.3em] text-slate-600">
            ADITI · NIGAM
          </span>
        </footer>
      </div>
    </section>
  );
}
