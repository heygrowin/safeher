"use client";

import { motion } from "framer-motion";
import { Bluetooth, ShieldCheck, Route as RouteIcon, ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";
import { LogoMark } from "@/components/ui/Logo";
import { SlideShell, rise, MapLines, Glow } from "../SlideParts";

export function IntroSlide({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <MapLines opacity={0.6} />
      <Glow className="-right-40 -top-40 h-[560px] w-[560px] opacity-40" />
      <Glow className="-bottom-60 -left-40 h-[520px] w-[520px] opacity-25" color="#A855F7" />

      <SlideShell className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div variants={rise} className="flex items-center gap-3">
              <LogoMark size={52} className="drop-shadow-[0_0_24px_rgba(192,132,252,0.7)]" />
              <span className="rounded-full border border-line bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fg2">Hackathon prototype</span>
            </motion.div>
            <motion.h1 variants={rise} className="mt-6 text-[64px] font-extrabold leading-[0.95] tracking-tight sm:text-[88px] lg:text-[112px]">
              Safe<span className="text-gradient">Her</span>
            </motion.h1>
            <motion.p variants={rise} className="mt-4 text-[22px] font-semibold tracking-tight text-lav sm:text-[28px]">
              {BRAND.tagline}
            </motion.p>
            <motion.p variants={rise} className="mt-4 max-w-lg text-[16px] leading-relaxed text-fg2 sm:text-[18px]">
              {BRAND.description}
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={onNext} className="btn-primary flex h-12 items-center gap-2 rounded-2xl px-6 text-[14px] font-bold">
                Begin <ArrowRight size={16} />
              </button>
              <span className="text-[12px] text-muted">
                Use <kbd className="rounded border border-line px-1.5 py-0.5 font-sans">→</kbd> or <kbd className="rounded border border-line px-1.5 py-0.5 font-sans">Space</kbd>
              </span>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div variants={rise} className="relative mx-auto w-full max-w-[460px]">
            <div className="relative overflow-hidden rounded-[36px] border border-line-strong shadow-[0_40px_120px_-30px_rgba(168,85,247,0.6)]">
              <motion.img
                src="/images/onboarding-city.png"
                alt="Illustration of a woman in a city at dusk"
                className="aspect-[4/3.6] w-full object-cover"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[12px] text-fg2 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-ok" /> Messina · 21:41 · journey planned
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 120, damping: 16 }}
              className="glass absolute -left-6 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:-left-14"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/25 text-lav">
                <RouteIcon size={17} />
              </span>
              <div>
                <p className="text-[13px] font-bold">Route B · 92%</p>
                <p className="text-[11px] text-muted">Route Support Score</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.25, type: "spring", stiffness: 120, damping: 16 }}
              className="glass absolute -right-4 top-[46%] flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:-right-10"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ok/20 text-ok">
                <ShieldCheck size={17} />
              </span>
              <div>
                <p className="text-[13px] font-bold">Safe Haven</p>
                <p className="text-[11px] text-muted">230 m · Open</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 120, damping: 16 }}
              className="absolute -bottom-10 -left-2 flex items-center gap-2 sm:-left-8"
            >
              <motion.img
                src="/images/charm-render.png"
                alt=""
                className="blend-edges h-28 w-28"
                animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-fg2">
                <Bluetooth size={12} className="text-azure" /> {BRAND.wearable}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </SlideShell>
    </div>
  );
}
