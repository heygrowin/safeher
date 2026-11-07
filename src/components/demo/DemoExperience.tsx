"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Maximize, Minimize, RotateCcw, SlidersHorizontal, X, FlaskConical } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { LogoMark } from "@/components/ui/Logo";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { PhoneApp } from "@/components/phone/PhoneApp";
import { DemoControls } from "./DemoControls";
import { SCREEN_INFO, TIER_COLOR } from "./screenInfo";
import type { ScreenId } from "@/types";

const JUMPS: { id: ScreenId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "routes", label: "Routes" },
  { id: "havens", label: "Safe Havens" },
  { id: "journey", label: "Journey" },
  { id: "hazard", label: "Hazard" },
  { id: "buddy", label: "Buddy" },
  { id: "charm", label: "Charm" },
  { id: "lowBattery", label: "Battery" },
  { id: "sos", label: "SOS" },
];

function FeaturePanel() {
  const { state, go } = useDemo();
  const info = SCREEN_INFO[state.screen];
  const color = TIER_COLOR[info.tier];
  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        <motion.div key={state.screen} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider" style={{ background: `${color}22`, color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {info.tier}
          </span>
          <h3 className="mt-3 text-[20px] font-extrabold leading-tight">{info.title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-fg2">{info.body}</p>
          <div className="mt-4 rounded-2xl border border-line bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-lav">
              <Lightbulb size={13} /> Try this
            </p>
            <ul className="mt-2 space-y-1.5">
              {info.tryThis.map((t) => (
                <li key={t} className="flex gap-2 text-[12.5px] text-fg2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-lav" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div>
        <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted">Jump to screen</p>
        <div className="flex flex-wrap gap-1.5">
          {JUMPS.map((j) => (
            <button
              key={j.id}
              onClick={() => go(j.id)}
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${state.screen === j.id ? "bg-brand text-white" : "border border-line text-fg2 hover:text-fg"}`}
            >
              {j.label}
            </button>
          ))}
        </div>
      </div>

      <p className="flex gap-2 rounded-xl border border-line bg-white/[0.02] p-3 text-[11px] leading-relaxed text-muted">
        <FlaskConical size={14} className="mt-[1px] shrink-0 text-lav" />
        Hackathon prototype. Routes, scores, places, people, GPS, Bluetooth and alerts are all simulated with local mock data.
      </p>
    </div>
  );
}

export function DemoExperience({ onBack, fullscreen, onToggleFullscreen }: { onBack: () => void; fullscreen: boolean; onToggleFullscreen: () => void }) {
  const { dispatch } = useDemo();
  const [sheet, setSheet] = useState(false);

  return (
    <div className="stage-bg relative flex h-dvh flex-col overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />

      {/* Top bar */}
      <header className="relative z-20 flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <button onClick={onBack} aria-label="Back to presentation" className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-[12.5px] font-semibold text-fg2 hover:text-fg">
          <ArrowLeft size={15} /> <span className="hidden sm:inline">Presentation</span>
        </button>
        <div className="flex items-center gap-2">
          <LogoMark size={22} />
          <span className="text-[15px] font-extrabold tracking-tight">{BRAND.name}</span>
          <span className="hidden rounded-full bg-brand/20 px-2 py-[2px] text-[10px] font-bold uppercase tracking-wider text-lav sm:inline">Live demo</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="hidden items-center gap-1.5 rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-[12.5px] font-semibold text-fg2 hover:text-fg sm:flex"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={onToggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-fg2 hover:text-fg"
          >
            {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex min-h-0 flex-1 gap-6 px-2 pb-3 sm:px-6 lg:pb-6">
        <aside className="thin-scroll glass hidden w-[260px] shrink-0 self-center overflow-y-auto rounded-3xl p-5 lg:block" style={{ maxHeight: "100%" }}>
          <DemoControls />
        </aside>

        <main className="relative min-w-0 flex-1">
          <PhoneFrame>
            <PhoneApp />
          </PhoneFrame>
        </main>

        <aside className="thin-scroll glass hidden w-[290px] shrink-0 self-center overflow-y-auto rounded-3xl p-5 xl:block" style={{ maxHeight: "100%" }}>
          <FeaturePanel />
        </aside>
      </div>

      {/* Mobile / tablet controls */}
      <button
        onClick={() => setSheet(true)}
        className="btn-primary absolute bottom-4 right-4 z-30 flex h-12 items-center gap-2 rounded-full px-4 text-[13px] font-bold lg:hidden"
      >
        <SlidersHorizontal size={16} /> Demo
      </button>
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="absolute inset-0 z-40 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="thin-scroll absolute inset-x-0 bottom-0 z-50 max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t border-line-strong bg-bg2 p-5 lg:hidden"
            >
              <div className="mb-3 flex justify-end">
                <button onClick={() => setSheet(false)} aria-label="Close demo controls" className="grid h-8 w-8 place-items-center rounded-full bg-white/5">
                  <X size={16} />
                </button>
              </div>
              <DemoControls onAction={() => setSheet(false)} />
              <div className="mt-6 border-t border-line pt-5">
                <FeaturePanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
