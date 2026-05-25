// src/components/Hero.tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { RESUME_DOWNLOAD_NAME, RESUME_PDF_URL, site } from "../data/portfolio";
import { HeroSocialBar } from "./HeroSocialBar";
import { MagneticButton } from "./MagneticButton";
import { ScanningFace } from "./ScanningFace";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden pt-24"
    >
      <div className="absolute inset-0 bg-[#06030f]" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#06030f] to-indigo-950/30" />
      <div className="absolute right-[10%] top-1/4 h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[100px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[100rem] items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(280px,420px)_1fr] lg:gap-8 xl:gap-12">
          {/* Left — text only */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3, duration: 0.9 }}
            className="relative z-20 text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-xs text-purple-200/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-purple-400/60" />
                <span className="relative h-2 w-2 rounded-full bg-purple-400" />
              </span>
              {site.status}
            </div>

            <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl xl:text-5xl 2xl:text-6xl">
              <span className="block text-white">The Aditi&apos;s</span>
              <span className="block text-gradient-purple text-glow-purple">
                Portfolio
              </span>
            </h1>

            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-purple-300/80 sm:text-sm">
              AI/ML | Full Stack Developer
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              {site.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton href="#projects">Explore Universe</MagneticButton>
              <MagneticButton href="#ai-lab" variant="ghost">
                Enter AI Lab
              </MagneticButton>
            </div>

            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              download={RESUME_DOWNLOAD_NAME}
              className="mt-5 inline-flex items-center gap-2 text-sm text-purple-300/70 transition hover:text-purple-200"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </motion.div>

          {/* Right — 3D face + social links on far right */}
          <div className="relative flex min-h-[400px] items-center lg:min-h-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.1, duration: 1 }}
              className="relative flex w-full flex-1 items-center justify-end pr-14 sm:pr-16 lg:pr-[4.5rem]"
            >
              <ScanningFace align="right" />
            </motion.div>

            <HeroSocialBar side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
