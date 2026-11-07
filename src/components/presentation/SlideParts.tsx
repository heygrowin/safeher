"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function SlideShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className={`mx-auto flex min-h-full w-full max-w-[1280px] flex-col justify-center px-5 pb-28 pt-20 sm:px-10 lg:px-14 short:pb-24 short:pt-16 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, color = "#C084FC" }: { children: ReactNode; color?: string }) {
  return (
    <motion.p variants={rise} className="mb-3 short:mb-2 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color }}>
      <span className="h-px w-8" style={{ background: color }} />
      {children}
    </motion.p>
  );
}

export function SlideTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2 variants={rise} className={`max-w-4xl text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[44px] lg:text-[54px] short:lg:text-[42px] ${className}`}>
      {children}
    </motion.h2>
  );
}

/** Ambient animated route lines used as slide backgrounds */
export function MapLines({ opacity = 0.5 }: { opacity?: number }) {
  const paths = [
    "M-50 620 C 200 560, 260 420, 420 400 S 700 300, 820 180 S 1100 60, 1500 40",
    "M-50 760 C 180 700, 360 640, 520 520 S 820 460, 980 300 S 1250 200, 1500 220",
    "M100 900 C 260 760, 300 640, 480 600 S 760 600, 900 480 S 1200 420, 1500 380",
  ];
  const colors = ["#A855F7", "#60A5FA", "#C084FC"];
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ opacity }} aria-hidden>
      <defs>
        <filter id="ml-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`g${i}`} x1={i * 110} y1="0" x2={i * 110 - 200} y2="900" stroke="#C084FC" strokeOpacity="0.04" />
      ))}
      {paths.map((d, i) => (
        <g key={i}>
          <motion.path
            d={d}
            stroke={colors[i]}
            strokeWidth="6"
            strokeOpacity="0.25"
            fill="none"
            filter="url(#ml-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.6, delay: 0.3 + i * 0.4, ease: "easeInOut" }}
          />
          <motion.path
            d={d}
            stroke={colors[i]}
            strokeWidth="1.6"
            strokeOpacity="0.7"
            strokeDasharray="2 10"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, strokeDashoffset: [0, -120] }}
            transition={{ pathLength: { duration: 2.6, delay: 0.3 + i * 0.4 }, strokeDashoffset: { duration: 6, repeat: Infinity, ease: "linear" } }}
          />
        </g>
      ))}
    </svg>
  );
}

export function Glow({ className = "", color = "#8B5CF6" }: { className?: string; color?: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-[120px] ${className}`} style={{ background: color }} />;
}
