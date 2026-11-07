"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, Store, Cctv, History, ShieldCheck, Gauge } from "lucide-react";
import type { RouteId } from "@/types";
import { ROUTES } from "@/data/routes";
import { SAFE_HAVENS } from "@/data/safeHavens";
import { CityMap } from "@/components/maps/CityMap";
import { scoreColor } from "@/components/ui/primitives";
import { SlideShell, SlideTitle, Eyebrow, rise, Glow } from "../SlideParts";
import { ScaleBox, MockPhone, GlowIcon } from "../SlideVisuals";

const INDICATORS = [
  { icon: Lightbulb, label: "Street lighting", color: "#FDE68A" },
  { icon: Store, label: "Open shops", color: "#C084FC" },
  { icon: Cctv, label: "CCTV references", color: "#22D3EE" },
  { icon: History, label: "Historical incident data", color: "#F472B6" },
  { icon: ShieldCheck, label: "Safe Havens", color: "#34D399" },
];

const TILE = 92;
const GAP = 14;
const ROW_W = INDICATORS.length * TILE + (INDICATORS.length - 1) * GAP;

function ScoreFlow() {
  const centers = INDICATORS.map((_, i) => i * (TILE + GAP) + TILE / 2);
  const mid = ROW_W / 2;
  return (
    <div className="relative" style={{ width: ROW_W, height: 262 }}>
      <div className="flex" style={{ gap: GAP }}>
        {INDICATORS.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-card/60 px-1 py-3 text-center"
              style={{ width: TILE, height: 120 }}
            >
              <GlowIcon color={it.color} size={44}>
                <Icon size={21} />
              </GlowIcon>
              <span className="text-[11.5px] font-semibold leading-tight text-fg2">{it.label}</span>
            </motion.div>
          );
        })}
      </div>
      <svg className="absolute left-0 top-[120px]" width={ROW_W} height="70" aria-hidden>
        <defs>
          <linearGradient id="flow" x1="0" x2="1">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#C084FC" />
          </linearGradient>
        </defs>
        {centers.map((x, i) => (
          <motion.path
            key={i}
            d={`M${x} 0 V 26 Q ${x} 34 ${x + (mid - x) * 0.15} 34 H ${mid} M ${mid} 34 V 70`}
            stroke="url(#flow)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 1.1 + i * 0.06 }}
          />
        ))}
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200, damping: 16 }}
        className="absolute left-1/2 top-[190px] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border-2 border-lav/70 bg-brand/15 px-6 py-3.5 shadow-[0_0_40px_-6px_#A855F7]"
      >
        <Gauge size={22} className="text-lav" />
        <span className="text-[17px] font-bold">Route Support Score</span>
      </motion.div>
    </div>
  );
}

function RoutePhone({ sel, setSel }: { sel: RouteId; setSel: (id: RouteId) => void }) {
  const scores = Object.fromEntries(ROUTES.map((r) => [r.id, r.baseScore]));
  const ordered = [...ROUTES].sort((a, b) => b.baseScore - a.baseScore);
  return (
    <MockPhone width={300} height={610}>
      <div className="flex h-full flex-col px-3">
        <div className="relative flex h-9 items-center justify-center">
          <ChevronLeft size={18} className="absolute left-0 text-fg2" />
          <span className="text-[13px] font-bold">Choose a Route</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line">
          <CityMap selected={sel} onSelect={setSel} scores={scores} recommended="B" havens={SAFE_HAVENS} showLights />
        </div>
        <div className="mt-2.5 space-y-1.5">
          {ordered.map((r) => {
            const on = r.id === sel;
            return (
              <button
                key={r.id}
                onClick={() => setSel(r.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors ${on ? "border-lav/70 bg-brand/15" : "border-line bg-card/70"}`}
              >
                <span className="h-7 w-1 rounded-full" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold">
                    {r.name}
                    {r.id === "B" && <span className="rounded-full bg-brand/30 px-1.5 text-[8px] font-bold uppercase text-lav">Recommended</span>}
                  </span>
                  <span className="block text-[10.5px] text-fg2">
                    {r.minutes} min ({r.km.toFixed(1)} km) ·{" "}
                    <span className="font-semibold" style={{ color: scoreColor(r.baseScore) }}>
                      {r.baseScore}%
                    </span>
                  </span>
                </span>
                <ChevronRight size={14} className="text-muted" />
              </button>
            );
          })}
        </div>
      </div>
    </MockPhone>
  );
}

export function MapSlide() {
  const [sel, setSel] = useState<RouteId>("B");

  return (
    <div className="relative min-h-full overflow-hidden">
      <Glow className="-right-40 top-10 h-[560px] w-[560px] opacity-25" color="#60A5FA" />
      <SlideShell className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <div>
            <Eyebrow color="#60A5FA">Intelligent route planning</Eyebrow>
            <SlideTitle className="lg:text-[50px] short:lg:text-[40px]">
              Navigate Through <span className="text-gradient">Support</span>, Not Just Distance.
            </SlideTitle>

            <motion.div variants={rise} className="mt-8 short:mt-5">
              <ScaleBox w={ROW_W} h={262} heightShare={0.36} maxScale={1.05} className="lg:[&>div]:mx-0">
                <ScoreFlow />
              </ScaleBox>
            </motion.div>

            <motion.div variants={rise} className="mt-4 flex flex-wrap gap-2">
              {ROUTES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSel(r.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-bold transition-colors ${sel === r.id ? "bg-brand/15" : "bg-card/50"}`}
                  style={{ borderColor: sel === r.id ? r.color : "rgba(192,132,252,0.18)" }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                  Route {r.id}
                  <span style={{ color: scoreColor(r.baseScore) }}>{r.baseScore}%</span>
                </button>
              ))}
            </motion.div>
            <motion.p variants={rise} className="mt-3 text-[12px] text-muted">
              Illustrative demo values — a support index, not a safety guarantee.
            </motion.p>
          </div>

          <motion.div variants={rise}>
            <ScaleBox w={300} h={610} heightShare={0.74} maxScale={1.08}>
              <RoutePhone sel={sel} setSel={setSel} />
            </ScaleBox>
          </motion.div>
        </div>
      </SlideShell>
    </div>
  );
}
