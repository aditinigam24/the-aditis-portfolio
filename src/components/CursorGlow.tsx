import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useMediaQuery";

export function CursorGlow() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    if (reduced) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[1] hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        left: pos.x,
        top: pos.y,
        background:
          "radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
        filter: "blur(40px)",
        willChange: "transform",
      }}
    />
  );
}
