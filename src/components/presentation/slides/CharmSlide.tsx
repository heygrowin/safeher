"use client";

import { motion } from "framer-motion";
import { Hand, Bluetooth, Pointer, Radio } from "lucide-react";
import { BRAND } from "@/config/brand";
import { CharmVisual } from "@/components/wearable/CharmVisual";
import { SlideShell, SlideTitle, Eyebrow, rise, Glow } from "../SlideParts";
import { ScaleBox, GlowIcon } from "../SlideVisuals";

const FEATURES = [
  { icon: Hand, label: "Silent physical trigger", sub: "Discreet press, no screen needed", color: "#F43F5E" },
  { icon: Bluetooth, label: "Bluetooth Low Energy", sub: "Paired with your phone", color: "#60A5FA" },
  { icon: Pointer, label: "Gesture activation", sub: "Double-click · 3-second hold", color: "#C084FC" },
  { icon: Radio, label: "Emergency beacon", sub: "Concept · nearby compatible devices", color: "#22D3EE" },
];

/** Product stage: glowing rings, pedestal and the established charm render. */
function ProductStage() {
  return (
    <div className="relative h-[600px] w-[600px]">
      {/* Halo */}
      <div className="absolute left-1/2 top-[50%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.45),transparent_65%)] blur-2xl" />
      {/* Glowing rings */}
      {[520, 420, 320].map((d, i) => (
        <div
          key={d}
          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: d, height: d, borderColor: `rgba(192,132,252,${0.12 + i * 0.08})` }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-[50%] h-[520px] w-[520px] rounded-full"
        style={{ x: "-50%", y: "-50%", background: "conic-gradient(from 0deg, transparent 0deg, rgba(192,132,252,0.55) 40deg, transparent 80deg)", WebkitMaskImage: "radial-gradient(closest-side, transparent 98%, #000 99%)", maskImage: "radial-gradient(closest-side, transparent 98%, #000 99%)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      {/* Signal pulses */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-[50%] h-[240px] w-[240px] rounded-full border-2 border-lav/60"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.05, ease: "easeOut" }}
        />
      ))}

      {/* Pedestal */}
      <div className="absolute bottom-[38px] left-1/2 h-[70px] w-[340px] -translate-x-1/2">
        <div className="absolute inset-x-0 top-[22px] h-[48px] rounded-b-[50%] bg-gradient-to-b from-[#2a1f55] to-[#120f2e]" />
        <div className="absolute inset-x-0 top-0 h-[46px] rounded-[50%] border-2 border-lav/70 bg-[radial-gradient(ellipse_at_center,#3b2a78,#1a1440_70%)] shadow-[0_0_40px_rgba(168,85,247,0.8),inset_0_0_20px_rgba(192,132,252,0.5)]" />
        <div className="absolute -bottom-6 left-1/2 h-10 w-[420px] -translate-x-1/2 rounded-[50%] bg-brand/30 blur-2xl" />
      </div>

      {/* The charm (existing design) */}
      <div className="absolute left-1/2 top-[78px] -translate-x-1/2">
        <CharmVisual size={440} />
      </div>
    </div>
  );
}

export function CharmSlide() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Glow className="left-[5%] top-1/4 h-[600px] w-[600px] opacity-35" color="#A855F7" />
      <SlideShell className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <motion.div variants={rise} className="order-2 lg:order-1">
            <ScaleBox w={600} h={600} heightShare={0.74} maxScale={1.05}>
              <ProductStage />
            </ScaleBox>
          </motion.div>

          <div className="order-1 lg:order-2">
            <Eyebrow color="#C084FC">{BRAND.wearable}</Eyebrow>
            <SlideTitle>
              Safety You <span className="text-gradient">Can Carry.</span>
            </SlideTitle>
            <div className="mt-8 space-y-3 short:mt-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.label} variants={rise} whileHover={{ x: 4 }} className="flex items-center gap-4 rounded-2xl border border-line bg-card/50 p-3.5 backdrop-blur">
                    <GlowIcon color={f.color} size={50}>
                      <Icon size={22} />
                    </GlowIcon>
                    <div>
                      <p className="text-[17px] font-bold leading-tight">{f.label}</p>
                      <p className="text-[13px] text-muted">{f.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </SlideShell>
    </div>
  );
}
