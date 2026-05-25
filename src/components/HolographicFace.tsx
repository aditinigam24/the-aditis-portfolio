// src/components/HolographicFace.tsx
import { useMouseParallax } from "../hooks/useMouseParallax";
import { useReducedMotion } from "../hooks/useMediaQuery";

export function HolographicFace() {
  const offset = useMouseParallax(0.35);
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-70 md:opacity-90"
      style={{
        transform: reduced
          ? undefined
          : `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <div className="relative h-[min(90vh,720px)] w-[min(95vw,640px)] animate-breathe">
        <svg
          viewBox="0 0 400 500"
          className="h-full w-full animate-flicker drop-shadow-[0_0_60px_rgba(59,130,246,0.35)]"
          fill="none"
        >
          <defs>
            <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer neural ring */}
          <ellipse
            cx="200"
            cy="250"
            rx="160"
            ry="200"
            stroke="url(#faceGrad)"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Circuit lines */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = 200 + Math.cos(angle) * 120;
            const y1 = 250 + Math.sin(angle) * 150;
            const x2 = 200 + Math.cos(angle) * 80;
            const y2 = 250 + Math.sin(angle) * 100;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#22d3ee"
                strokeWidth="0.5"
                opacity="0.4"
              />
            );
          })}

          {/* Face silhouette */}
          <path
            d="M200 80 C120 80 70 160 70 250 C70 340 120 420 200 420 C280 420 330 340 330 250 C330 160 280 80 200 80 Z"
            stroke="url(#faceGrad)"
            strokeWidth="1.5"
            fill="rgba(59,130,246,0.03)"
            filter="url(#glow)"
          />

          {/* Cheek circuits */}
          <path
            d="M130 280 Q160 300 130 320 M270 280 Q240 300 270 320"
            stroke="#a855f7"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Eyes */}
          <g className="origin-center" style={{ transformOrigin: "165px 220px" }}>
            <ellipse
              cx="165"
              cy="220"
              rx="28"
              ry="14"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="rgba(34,211,238,0.08)"
              style={{ animation: reduced ? undefined : "blink 5s ease-in-out infinite" }}
            />
            <circle cx="165" cy="220" r="6" fill="#22d3ee" opacity="0.9" />
          </g>
          <g style={{ transformOrigin: "235px 220px" }}>
            <ellipse
              cx="235"
              cy="220"
              rx="28"
              ry="14"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="rgba(34,211,238,0.08)"
              style={{ animation: reduced ? undefined : "blink 5s ease-in-out infinite 0.1s" }}
            />
            <circle cx="235" cy="220" r="6" fill="#22d3ee" opacity="0.9" />
          </g>

          {/* Nose line */}
          <path d="M200 240 L200 290" stroke="#3b82f6" strokeWidth="0.8" opacity="0.5" />

          {/* Lips */}
          <path
            d="M175 320 Q200 335 225 320"
            stroke="#ec4899"
            strokeWidth="1"
            opacity="0.5"
            fill="none"
          />

          {/* Forehead neural grid */}
          <path
            d="M150 150 L200 130 L250 150 M160 170 L200 155 L240 170"
            stroke="#3b82f6"
            strokeWidth="0.6"
            opacity="0.5"
          />
        </svg>

        {/* Scan line */}
        {!reduced && (
          <div
            className="absolute inset-x-[15%] top-[10%] h-[80%] overflow-hidden rounded-[40%] opacity-30"
            style={{ mixBlendMode: "screen" }}
          >
            <div
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
              style={{ animation: "scan-line 4s linear infinite" }}
            />
          </div>
        )}

        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#030308] via-transparent to-transparent" />
      </div>
    </div>
  );
}
