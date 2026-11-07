"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Smartphone } from "lucide-react";
import { BRAND } from "@/config/brand";
import { LogoMark } from "@/components/ui/Logo";
import { IntroSlide } from "./slides/IntroSlide";
import { ProblemSlide } from "./slides/ProblemSlide";
import { MapSlide } from "./slides/MapSlide";
import { ActiveJourneySlide } from "./slides/ActiveJourneySlide";
import { CharmSlide } from "./slides/CharmSlide";
import { CommunitySlide } from "./slides/CommunitySlide";

export const SLIDE_TITLES = ["Introduction", "The Problem", "Intelligent Navigation", "Active Journey & Community", BRAND.wearable, "Emergency & Impact"];
export const SLIDE_COUNT = SLIDE_TITLES.length;

interface Props {
  index: number;
  direction: number;
  onGo: (i: number) => void;
  onLaunch: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function Presentation({ index, direction, onGo, onLaunch, fullscreen, onToggleFullscreen }: Props) {
  const next = () => (index < SLIDE_COUNT - 1 ? onGo(index + 1) : onLaunch());
  const prev = () => index > 0 && onGo(index - 1);

  const slide = [
    <IntroSlide key="s0" onNext={next} />,
    <ProblemSlide key="s1" />,
    <MapSlide key="s2" />,
    <ActiveJourneySlide key="s3" />,
    <CharmSlide key="s4" />,
    <CommunitySlide key="s5" onLaunch={onLaunch} />,
  ][index];

  return (
    <div className="stage-bg relative h-dvh overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex h-16 items-center gap-3 px-5 sm:px-8">
        <button onClick={() => onGo(0)} className="flex items-center gap-2" aria-label="Back to first slide">
          <LogoMark size={24} />
          <span className="text-[15px] font-extrabold tracking-tight">{BRAND.name}</span>
        </button>
        <span className="hidden text-[12px] text-muted sm:inline">/ {SLIDE_TITLES[index]}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onLaunch}
            aria-label="Skip to demo"
            className="flex items-center gap-1.5 rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-[12px] font-semibold text-fg2 hover:text-fg"
          >
            <Smartphone size={14} /> <span className="hidden sm:inline">Skip to demo</span>
          </button>
          <button
            onClick={onToggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
            title="Full screen (F)"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-fg2 hover:text-fg"
          >
            {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={index}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 80, filter: "blur(8px)" }),
            center: { opacity: 1, x: 0, filter: "blur(0px)" },
            exit: (d: number) => ({ opacity: 0, x: d * -80, filter: "blur(8px)" }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="thin-scroll absolute inset-0 overflow-y-auto overflow-x-hidden"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDE_COUNT}: ${SLIDE_TITLES[index]}`}
        >
          {slide}
        </motion.section>
      </AnimatePresence>

      {/* Bottom navigation */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-8 sm:pb-6 short:sm:pb-4">
        <div className="glass pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-fg2 transition-colors hover:text-fg disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[12px] font-semibold text-fg2">{SLIDE_TITLES[index]}</span>
              <span className="shrink-0 text-[12px] tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {SLIDE_TITLES.map((t, i) => (
                <button key={t} onClick={() => onGo(i)} aria-label={`Go to slide ${i + 1}: ${t}`} className="group h-3 flex-1 py-1">
                  <span className="block h-1 overflow-hidden rounded-full bg-white/10 group-hover:bg-white/20">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-brand to-lav"
                      initial={false}
                      animate={{ width: i <= index ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            aria-label={index === SLIDE_COUNT - 1 ? "Experience the app" : "Next slide"}
            className="btn-primary flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[13px] font-bold sm:px-4"
          >
            <span className="hidden sm:inline">{index === SLIDE_COUNT - 1 ? "Open demo" : "Next"}</span>
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-muted md:block short:hidden">← → or Space to navigate · F for full screen</p>
      </footer>
    </div>
  );
}
