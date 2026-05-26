// src/components/HeroSocialBar.tsx
import { motion } from "framer-motion";
import { Code2, Mail, Camera } from "lucide-react";
import { site } from "../data/portfolio";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const links = [
  { href: "https://github.com/aditinigam24", Icon: Code2, label: "GitHub" },
  { href: "https://linkedin.com/in/aditi-nigam-001b8431a", Icon: LinkedInIcon, label: "LinkedIn" },
  { href: "https://www.instagram.com/aditinigam24/", Icon: Camera, label: "Instagram" },
  { href: "mailto:aditinigam225@gmail.com", Icon: Mail, label: "Email" },
];

type Props = {
  side?: "right";
};

/** Vertical social bar on the right edge of the hero */
export function HeroSocialBar({ side = "right" }: Props) {
  if (side !== "right") return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.4, duration: 0.7 }}
      className="absolute right-0 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3"
    >
      {links.map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={label}
          className="glass-purple group grid h-10 w-10 place-items-center rounded-xl text-purple-300/80 transition hover:border-purple-400/50 hover:text-purple-200 hover:shadow-[0_0_24px_rgba(168,85,247,0.4)] sm:h-11 sm:w-11"
        >
          <Icon className="h-4 w-4 transition group-hover:scale-110" />
        </a>
      ))}
    </motion.div>
  );
}
