// src/components/Navbar.tsx
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { RESUME_DOWNLOAD_NAME, RESUME_PDF_URL } from "../data/portfolio";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#ai-lab", label: "AI Lab" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.7 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass-purple holo-border flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 font-display text-xs font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            AN
            <span className="absolute inset-0 rounded-xl bg-blue-400/30 blur-md" />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-wide text-slate-200 sm:block">
            Aditi Nigam
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            download={RESUME_DOWNLOAD_NAME}
            className="hidden rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:text-cyan-300 sm:block"
          >
            Resume
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_24px_-6px_rgba(168,85,247,0.8)] sm:inline-block"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass holo-border absolute left-4 right-4 top-[calc(100%+8px)] rounded-2xl p-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
