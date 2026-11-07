"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Signal, Wifi } from "lucide-react";

/**
 * Renders children at a fixed design size and scales them to fit the available
 * width (and a share of the viewport height), so slide visuals never squash.
 */
export function ScaleBox({
  w,
  h,
  maxScale = 1.15,
  heightShare = 0.66,
  className = "",
  children,
}: {
  w: number;
  h: number;
  maxScale?: number;
  heightShare?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setS(Math.max(0.35, Math.min(maxScale, width / w, (window.innerHeight * heightShare) / h)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [w, h, maxScale, heightShare]);

  const scale = s ?? 1;
  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="relative mx-auto" style={{ width: w * scale, height: h * scale, opacity: s === null ? 0 : 1 }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Static, presentation-only phone mockup (independent of the live demo). */
export function MockPhone({ children, width = 290, height = 600, className = "", tone = "default" }: { children: ReactNode; width?: number; height?: number; className?: string; tone?: "default" | "sos" }) {
  return (
    <div
      className={`relative rounded-[46px] p-[10px] ${className}`}
      style={{
        width,
        height,
        background: "linear-gradient(145deg, #3a3b55 0%, #16172a 35%, #0b0b16 65%, #2c2d45 100%)",
        boxShadow: "0 40px 90px -20px rgba(0,0,0,0.85), 0 0 60px -10px rgba(168,85,247,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[37px]"
        style={{ background: tone === "sos" ? "radial-gradient(120% 70% at 50% 0%, rgba(244,63,94,0.3), transparent 60%), #0B0A1A" : "radial-gradient(90% 50% at 50% 0%, rgba(139,92,246,0.18), transparent), #090B1B" }}
      >
        <div className="absolute left-1/2 top-[9px] z-20 h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative z-10 flex h-[40px] items-center justify-between px-6 pt-1 text-[12px] font-semibold">
          <span>21:41</span>
          <span className="flex items-center gap-1">
            <Signal size={12} strokeWidth={2.6} />
            <Wifi size={12} strokeWidth={2.6} />
            <span className="grid h-[11px] w-[22px] place-items-center rounded-[3px] bg-white/90 text-[8px] font-extrabold text-bg">87</span>
          </span>
        </div>
        <div className="relative h-[calc(100%-40px)]">{children}</div>
        <div className="absolute bottom-[6px] left-1/2 z-20 h-[4px] w-[100px] -translate-x-1/2 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

/** Icon inside a softly glowing rounded tile — shared slide iconography. */
export function GlowIcon({ children, color, size = 52 }: { children: ReactNode; color: string; size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-2xl"
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${color}33, ${color}12)`, color, boxShadow: `inset 0 0 0 1px ${color}55, 0 0 26px -6px ${color}` }}
    >
      {children}
    </span>
  );
}
