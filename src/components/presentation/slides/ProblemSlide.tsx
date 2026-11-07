"use client";

import { motion } from "framer-motion";
import { LightbulbOff, Store, ShieldOff, TriangleAlert, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { SlideShell, SlideTitle, Eyebrow, rise, Glow } from "../SlideParts";
import { ScaleBox, GlowIcon } from "../SlideVisuals";

const ROUTE = "M70 340 L170 280 L262 280 L340 190 L450 150 L560 62";

/* Pins on the map — position in the 620 × 400 design space */
const PINS = [
  { n: 1, x: 216, y: 280, color: "#F43F5E" },
  { n: 2, x: 395, y: 170, color: "#FB923C" },
  { n: 3, x: 506, y: 108, color: "#C084FC" },
  { n: 4, x: 120, y: 310, color: "#FBBF24" },
];

function Bulbs() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#FDE68A] shadow-[0_0_8px_#FDE68A]" : "bg-white/15"}`} />
      ))}
    </span>
  );
}
function Shops() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`h-2.5 w-3 rounded-[2px] ${i === 2 ? "bg-ok/80" : "bg-white/15"}`} />
      ))}
    </span>
  );
}
function NoSupport() {
  return (
    <span className="relative grid h-4 w-10 place-items-center">
      <span className="absolute inset-0 rounded-full border border-dashed border-lav/50" />
      <span className="h-1.5 w-1.5 rounded-full bg-lav/60" />
    </span>
  );
}
function Unreported() {
  return <span className="rounded-full border border-warn/40 px-1.5 text-[10px] font-bold leading-4 text-warn">?</span>;
}

const INDICATORS: { n: number; label: string; icon: ReactNode; color: string; cue: ReactNode }[] = [
  { n: 1, label: "Poor street lighting", icon: <LightbulbOff size={24} />, color: "#F43F5E", cue: <Bulbs /> },
  { n: 2, label: "Few open places", icon: <Store size={24} />, color: "#FB923C", cue: <Shops /> },
  { n: 3, label: "Limited nearby support", icon: <ShieldOff size={24} />, color: "#C084FC", cue: <NoSupport /> },
  { n: 4, label: "Unreported hazards", icon: <TriangleAlert size={24} />, color: "#FBBF24", cue: <Unreported /> },
];

function Indicator({ item, align }: { item: (typeof INDICATORS)[number]; align: "left" | "right" }) {
  return (
    <motion.div
      variants={rise}
      className={`flex items-center gap-4 rounded-3xl border border-line bg-card/50 p-4 backdrop-blur lg:flex-col lg:gap-3 lg:border-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${align === "left" ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"}`}
    >
      <div className="relative">
        <GlowIcon color={item.color} size={64}>
          {item.icon}
        </GlowIcon>
        <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold text-bg" style={{ background: item.color }}>
          {item.n}
        </span>
      </div>
      <div className={`flex flex-col gap-2 ${align === "left" ? "lg:items-end" : "lg:items-start"}`}>
        <p className="text-[16px] font-bold leading-tight lg:text-[17px]">{item.label}</p>
        {item.cue}
      </div>
    </motion.div>
  );
}

function ConventionalMap() {
  return (
    <div className="relative h-[400px] w-[620px] overflow-hidden rounded-[32px] border border-line-strong bg-[#12142E] shadow-[0_40px_120px_-30px_rgba(244,63,94,0.35)]">
      <svg viewBox="0 0 620 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="pb-dark" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity="0.75" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="pb-glow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {/* Streets */}
        {[60, 130, 210, 280, 350].map((y) => (
          <line key={`h${y}`} x1="0" x2="620" y1={y} y2={y} stroke="#1D2044" strokeWidth={y === 280 ? 10 : 5} />
        ))}
        {[70, 170, 262, 340, 450, 560].map((x) => (
          <line key={`v${x}`} y1="0" y2="400" x1={x} x2={x} stroke="#1D2044" strokeWidth="5" />
        ))}
        <rect x="380" y="220" width="60" height="44" rx="8" fill="#16302C" opacity="0.4" />

        {/* 1 · dark stretch */}
        <ellipse cx="216" cy="280" rx="80" ry="54" fill="url(#pb-dark)" />
        {/* 2 · closed shopfronts */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${352 + i * 24} ${118 - i * 9})`}>
            <rect width="18" height="14" rx="2" fill="#2A2C4A" />
            {[3, 6, 9].map((y) => (
              <line key={y} x1="2" x2="16" y1={y} y2={y} stroke="#4A4C70" strokeWidth="1" />
            ))}
          </g>
        ))}
        {/* 3 · support radius with nothing inside */}
        <circle cx="506" cy="108" r="62" fill="#C084FC" fillOpacity="0.04" stroke="#C084FC" strokeOpacity="0.45" strokeDasharray="5 7" />

        {/* Fastest route */}
        <motion.path d={ROUTE} stroke="#8EA2C8" strokeWidth="14" strokeOpacity="0.18" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#pb-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.4 }} />
        <motion.path d={ROUTE} stroke="#8EA2C8" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.4 }} />
        <circle cx="70" cy="340" r="11" fill="#60A5FA" stroke="#fff" strokeWidth="4" />
        <path d="M560 26c-11 0-19 8-19 18 0 13 19 30 19 30s19-17 19-30c0-10-8-18-19-18z" fill="#F472B6" stroke="#fff" strokeWidth="2.5" />
        <circle cx="560" cy="44" r="6" fill="#fff" />
      </svg>

      {/* ETA bubble — the only thing a conventional app optimises for */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute left-[262px] top-[226px] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#8EA2C8] px-3 py-1.5 text-[13px] font-bold text-bg shadow-lg"
      >
        <Clock size={14} strokeWidth={2.6} /> 12 min · Fastest
      </motion.div>

      {PINS.map((p, i) => (
        <motion.span
          key={p.n}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2 + i * 0.2, type: "spring", stiffness: 300, damping: 16 }}
          className="absolute"
          style={{ left: p.x, top: p.y, x: "-50%", y: "-50%" }}
        >
          <span className="absolute -inset-2 animate-ping rounded-full opacity-40" style={{ background: p.color }} />
          <span className="relative grid h-8 w-8 place-items-center rounded-full border-[3px] border-[#12142E] text-[13px] font-extrabold text-bg" style={{ background: p.color, boxShadow: `0 0 18px ${p.color}` }}>
            {p.n}
          </span>
        </motion.span>
      ))}
    </div>
  );
}

export function ProblemSlide() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Glow className="-right-60 top-20 h-[500px] w-[500px] opacity-20" color="#F43F5E" />
      <SlideShell className="relative">
        <Eyebrow color="#FB7185">The problem</Eyebrow>
        <SlideTitle>
          Getting There Isn’t the Same as <span className="text-gradient">Getting There Safely.</span>
        </SlideTitle>

        <div className="mt-10 grid items-center gap-6 short:mt-6 lg:grid-cols-[190px_1fr_190px] lg:gap-8">
          <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-14">
            <Indicator item={INDICATORS[0]} align="left" />
            <Indicator item={INDICATORS[1]} align="left" />
          </div>
          <motion.div variants={rise} className="order-1 lg:order-2">
            <ScaleBox w={620} h={400} heightShare={0.52} maxScale={1.1}>
              <ConventionalMap />
            </ScaleBox>
          </motion.div>
          <div className="order-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-14">
            <Indicator item={INDICATORS[2]} align="right" />
            <Indicator item={INDICATORS[3]} align="right" />
          </div>
        </div>
      </SlideShell>
    </div>
  );
}
