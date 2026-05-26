// src/components/MagneticButton.tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    variant === "primary"
      ? "relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(168,85,247,0.9)] bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600"
      : "relative overflow-hidden rounded-full border border-purple-500/40 bg-purple-500/5 px-7 py-3.5 text-sm font-semibold text-purple-100 backdrop-blur hover:border-purple-400/60 hover:shadow-[0_0_30px_-8px_rgba(168,85,247,0.5)]";

  const inner = (
    <motion.span
      className={`inline-flex items-center gap-2 ${base} ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className="group inline-block">
        {inner}
      </a>
    );
  }
  return <button type="button" className="group">{inner}</button>;
}
