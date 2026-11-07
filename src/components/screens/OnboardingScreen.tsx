"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/primitives";

const PAGES = [
  {
    title: "Your Journey, With More Support.",
    body: "Plan routes that pass open businesses, lit streets and verified Safe Havens — and keep trusted people in the loop.",
  },
  {
    title: "Stay Connected While You Move.",
    body: "Share your journey temporarily, get discreet check-ins and flag local hazards in one tap.",
  },
  {
    title: "A Discreet Charm In Your Pocket.",
    body: `The ${BRAND.wearable} pairs with your phone so help is one gesture away — even when you can't reach your screen.`,
  },
];

export function OnboardingScreen() {
  const { go, toast } = useDemo();
  const [page, setPage] = useState(0);
  const p = PAGES[page];

  useEffect(() => {
    const t = setTimeout(() => setPage((n) => (n + 1) % PAGES.length), 4500);
    return () => clearTimeout(t);
  }, [page]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#1a1450] via-[#120f35] to-bg">
      <div className="relative z-10 flex flex-col items-center pt-[66px] text-center">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <LogoMark size={42} className="mx-auto drop-shadow-[0_0_18px_rgba(192,132,252,0.7)]" />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-1.5 text-[32px] font-extrabold leading-none tracking-tight"
        >
          Safe<span className="text-lav">Her</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-1.5 text-[13px] font-medium text-fg2">
          {BRAND.tagline}
        </motion.p>
      </div>

      {/* Illustration */}
      <div className="relative -mt-2 h-[262px] shrink-0">
        <motion.img
          src="/images/onboarding-city.png"
          alt="Illustration of a woman in a city at dusk"
          className="h-full w-full object-cover"
          style={{ WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 72%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 72%, transparent 100%)" }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 mt-auto px-6 pb-[34px]">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <h2 className="text-[24px] font-extrabold leading-tight tracking-tight">{p.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fg2">{p.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mb-5 mt-5 flex gap-2" role="tablist" aria-label="Onboarding pages">
          {PAGES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${i === page ? "w-7 bg-lav" : "w-2 bg-white/25 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <Button full size="lg" iconRight={ArrowRight} onClick={() => go("home")}>
          Get Started
        </Button>
        <button
          onClick={() => {
            toast("Demo mode — no sign-in needed. Welcome back, Aanya!", "info");
            go("home");
          }}
          className="mt-3 w-full py-2 text-[13px] font-medium text-fg2 hover:text-fg"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
