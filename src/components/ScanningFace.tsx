import { useEffect, useRef } from "react";
import { useMouseParallax } from "../hooks/useMouseParallax";
import { useMediaQuery, useReducedMotion } from "../hooks/useMediaQuery";

/** Canvas wireframe mesh + scan beam over the hero face */
function ScanMeshOverlay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let scanY = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = () => canvas.getBoundingClientRect().width;
    const h = () => canvas.getBoundingClientRect().height;

    const draw = (t: number) => {
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.42;
      const rx = width * 0.32;
      const ry = height * 0.38;

      // Wireframe mesh (ellipse grid)
      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      ctx.lineWidth = 0.6;
      const rings = 8;
      const spokes = 14;
      for (let r = 1; r <= rings; r++) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.08) {
          const ex = cx + Math.cos(a) * rx * (r / rings);
          const ey = cy + Math.sin(a) * ry * (r / rings);
          if (a === 0) ctx.moveTo(ex, ey);
          else ctx.lineTo(ex, ey);
        }
        ctx.closePath();
        ctx.stroke();
      }
      for (let s = 0; s < spokes; s++) {
        const a = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
        ctx.stroke();
      }

      // Neck / jaw circuit lines
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.beginPath();
      ctx.moveTo(cx - rx * 0.5, cy + ry * 0.6);
      ctx.quadraticCurveTo(cx - rx * 0.3, cy + ry * 0.9, cx, cy + ry * 1.05);
      ctx.quadraticCurveTo(cx + rx * 0.3, cy + ry * 0.9, cx + rx * 0.5, cy + ry * 0.6);
      ctx.stroke();

      // Horizontal scan beam
      scanY = (Math.sin(t * 0.0012) * 0.5 + 0.5) * height;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, "rgba(168, 85, 247, 0)");
      grad.addColorStop(0.45, "rgba(192, 132, 252, 0.55)");
      grad.addColorStop(0.5, "rgba(233, 213, 255, 0.75)");
      grad.addColorStop(0.55, "rgba(192, 132, 252, 0.55)");
      grad.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 50, width, 100);

      // Vertical data ticks
      ctx.fillStyle = "rgba(168, 85, 247, 0.6)";
      for (let i = 0; i < 6; i++) {
        const x = width * (0.15 + i * 0.14);
        const tickH = 8 + Math.sin(t * 0.003 + i) * 4;
        ctx.fillRect(x, height * 0.2, 1, tickH);
        ctx.fillRect(x, height * 0.75, 1, tickH);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

type Props = { align?: "center" | "right" };

export function ScanningFace({ align = "center" }: Props) {
  const offset = useMouseParallax(0.15);
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 1024px)");
  const alignRight = align === "right";

  return (
    <div
      className={`relative flex h-full w-full items-center ${alignRight ? "justify-end" : "justify-center"}`}
      style={{
        transform: reduced ? undefined : `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Ambient glow behind face */}
      <div
        aria-hidden
        className={`absolute inset-0 flex items-center ${alignRight ? "justify-end pr-[5%]" : "justify-center"}`}
      >
        <div className="h-[70%] w-[55%] rounded-full bg-purple-600/20 blur-[80px]" />
        <div className="absolute h-[50%] w-[40%] rounded-full bg-violet-500/15 blur-[60px] translate-y-8" />
      </div>

      {/* Viewfinder brackets */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] z-20 sm:inset-[12%]"
      >
        <span className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-purple-400/70" />
        <span className="absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-purple-400/70" />
        <span className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-purple-400/70" />
        <span className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-purple-400/70" />
        {/* Crosshair */}
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-purple-500/20" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-purple-500/20" />
      </div>

      {/* Face container */}
      <div
        className={`relative z-10 animate-breathe h-[min(68vh,560px)] w-full max-w-[min(88vw,640px)] sm:h-[min(72vh,600px)] sm:max-w-[700px] lg:h-[min(78vh,680px)] lg:max-w-[780px] ${alignRight ? "ml-auto" : "mx-auto"}`}
      >
        {/* Base face image — light complexion */}
        <img
          src="/ai-face-hero.png"
          alt=""
          aria-hidden
          className="face-hero-light relative z-10 h-full w-full object-cover object-[center_18%] opacity-98"
          style={{
            maskImage:
              "radial-gradient(ellipse 72% 78% at 50% 38%, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 72% 78% at 50% 38%, black 40%, transparent 75%)",
          }}
        />

        {/* Purple rim light overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 38%, rgba(168,85,247,0.25) 0%, transparent 65%)",
          }}
        />

        {/* Scan mesh canvas */}
        {!reduced && <ScanMeshOverlay active />}

        {/* Glowing eye accent (CSS) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[32%] top-[38%] z-[25] h-3 w-8 rounded-full bg-purple-400/40 blur-md animate-pulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[32%] top-[38%] z-[25] h-3 w-8 rounded-full bg-purple-400/40 blur-md animate-pulse"
          style={{ animationDelay: "0.15s" }}
        />

        {/* Static scan line (CSS fallback + mobile) */}
        {!reduced && (
          <div
            className="pointer-events-none absolute inset-x-[10%] top-[5%] z-20 h-[90%] overflow-hidden opacity-40"
            style={{ mixBlendMode: "screen" }}
          >
            <div
              className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-purple-300/50 to-transparent"
              style={{ animation: "scan-line 3.5s linear infinite" }}
            />
          </div>
        )}

        {/* Bottom fade into bg */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/3 bg-gradient-to-t from-[#06030f] via-[#06030f]/80 to-transparent" />

        {/* Side data streams */}
        {!mobile && (
          <>
            <div
              aria-hidden
              className="absolute -left-6 top-1/4 flex flex-col gap-2 opacity-60"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-0.5 bg-gradient-to-b from-purple-500/80 to-transparent"
                  style={{ animation: `pulse-glow ${1.5 + i * 0.2}s ease-in-out infinite` }}
                />
              ))}
            </div>
            <div
              aria-hidden
              className="absolute -right-6 top-1/4 flex flex-col gap-2 opacity-60"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-0.5 bg-gradient-to-b from-violet-500/80 to-transparent"
                  style={{ animation: `pulse-glow ${1.8 + i * 0.2}s ease-in-out infinite` }}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
