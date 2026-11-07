"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const SCREEN_W = 360;
export const SCREEN_H = 760;
const BEZEL = 12;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

/**
 * Realistic phone mockup. The screen renders at a fixed logical size (360 × 760)
 * and the whole device is scaled to fit its container, so layouts never squash.
 */
export function PhoneFrame({ children, maxScale = 1.05 }: { children: ReactNode; maxScale?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.max(0.5, Math.min(maxScale, (width - 8) / FRAME_W, (height - 8) / FRAME_H)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxScale]);

  const s = scale ?? 1;
  return (
    <div ref={wrap} className="relative grid h-full w-full place-items-center">
      <div style={{ width: FRAME_W * s, height: FRAME_H * s, opacity: scale === null ? 0 : 1 }} className="relative transition-opacity duration-300">
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${s})` }}
        >
          {/* Glow behind device */}
          <div className="pointer-events-none absolute -inset-10 rounded-[80px] bg-brand/20 blur-3xl" />
          {/* Side buttons */}
          <span className="absolute -left-[3px] top-[150px] h-8 w-[3px] rounded-l bg-[#2a2b40]" />
          <span className="absolute -left-[3px] top-[200px] h-14 w-[3px] rounded-l bg-[#2a2b40]" />
          <span className="absolute -left-[3px] top-[266px] h-14 w-[3px] rounded-l bg-[#2a2b40]" />
          <span className="absolute -right-[3px] top-[220px] h-20 w-[3px] rounded-r bg-[#2a2b40]" />
          {/* Body */}
          <div
            className="relative h-full w-full rounded-[56px] p-[12px]"
            style={{
              background: "linear-gradient(145deg, #3a3b55 0%, #16172a 35%, #0b0b16 65%, #2c2d45 100%)",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.08), 0 0 0 1px rgba(192,132,252,0.15)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[45px] bg-bg" style={{ isolation: "isolate" }}>
              {children}
              {/* Dynamic Island */}
              <div className="pointer-events-none absolute left-1/2 top-[10px] z-[60] flex h-[30px] w-[108px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#141428] ring-1 ring-[#24244a]" />
              </div>
              {/* Home indicator */}
              <div className="pointer-events-none absolute bottom-[7px] left-1/2 z-[60] h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
