"use client";

import { motion } from "framer-motion";
import { Share2, Shuffle, TriangleAlert, Users, ShieldCheck, Clock, CircleCheck, Lightbulb, ChevronLeft } from "lucide-react";
import { TRUSTED_CONTACTS } from "@/data/contacts";
import { CityMap } from "@/components/maps/CityMap";
import { Avatar } from "@/components/ui/primitives";
import { SlideShell, SlideTitle, Eyebrow, rise, Glow } from "../SlideParts";
import { ScaleBox, MockPhone, GlowIcon } from "../SlideVisuals";

const FEATURES = [
  { icon: Share2, label: "Live journey sharing", sub: "Trusted contacts follow along", color: "#34D399" },
  { icon: Shuffle, label: "Route deviation check-ins", sub: "A discreet “Are you okay?”", color: "#FBBF24" },
  { icon: TriangleAlert, label: "Hazard reporting", sub: "One tap, place-based", color: "#F472B6" },
  { icon: Users, label: "Travel Buddy", sub: "Walk together", color: "#60A5FA" },
];

function JourneyPhone() {
  return (
    <MockPhone width={270} height={560}>
      <div className="flex h-full flex-col gap-2 px-3">
        <div className="relative flex h-8 items-center justify-center">
          <ChevronLeft size={17} className="absolute left-0 text-fg2" />
          <span className="text-[13px] font-bold">My Journey</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-ok/40 bg-[#0f2a24] px-2.5 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ok" />
          <div className="flex-1">
            <p className="text-[11.5px] font-bold">Live Journey</p>
            <p className="text-[9.5px] text-fg2">You’re on Route B</p>
          </div>
          <span className="text-[11.5px] font-bold">12 min</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-line">
          <CityMap routes={["B"]} selected="B" progress={0.42} showLights />
        </div>
        <div className="flex items-center gap-2 px-0.5">
          <span className="text-[10.5px] font-semibold text-fg2">Sharing with (2)</span>
          <span className="ml-auto flex -space-x-1.5">
            {TRUSTED_CONTACTS.map((c) => (
              <span key={c.id} className="rounded-full ring-2 ring-bg">
                <Avatar initials={c.initials} color={c.color} size={22} />
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-card/70 px-2.5 py-2">
          <ShieldCheck size={15} className="text-ok" />
          <span className="flex-1 text-[10.5px] font-semibold">On supported route</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-card/70 px-2.5 py-2">
          <Clock size={15} className="text-lav" />
          <span className="flex-1 text-[10.5px] font-semibold">Next check-in in 10 min</span>
        </div>
      </div>
    </MockPhone>
  );
}

function Composition() {
  return (
    <div className="relative h-[580px] w-[660px]">
      {/* Two women walking together */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute right-0 top-[40px] h-[480px] w-[430px] overflow-hidden rounded-[36px] border border-line-strong shadow-[0_40px_120px_-30px_rgba(168,85,247,0.55)]"
      >
        <img src="/images/travel-buddies.png" alt="Two women walking together at night" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/30" />
        <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl border border-line bg-bg/60 px-4 py-3 backdrop-blur-md">
          <GlowIcon color="#60A5FA" size={40}>
            <Users size={19} />
          </GlowIcon>
          <div>
            <p className="text-[15px] font-bold">Travel Buddy</p>
            <p className="text-[12px] text-fg2">Walk together</p>
          </div>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="absolute left-0 top-[10px]">
        <JourneyPhone />
      </motion.div>

      {/* Deviation check-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 180, damping: 16 }}
        className="absolute left-[300px] top-[150px] w-[250px] rounded-2xl border border-warn/40 bg-[#1d1a2e]/95 p-3.5 shadow-2xl backdrop-blur"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-warn/15 text-warn">
            <Shuffle size={17} />
          </span>
          <p className="text-[14px] font-bold">Everything okay?</p>
        </div>
        <div className="mt-2.5 flex gap-2">
          <span className="btn-primary flex flex-1 items-center justify-center gap-1 rounded-xl py-1.5 text-[12px] font-bold">
            <CircleCheck size={13} /> I’m Okay
          </span>
          <span className="flex flex-1 items-center justify-center rounded-xl border border-line py-1.5 text-[12px] font-semibold text-fg2">Review</span>
        </div>
      </motion.div>

      {/* Hazard reported */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 180, damping: 16 }}
        className="absolute left-[230px] top-[440px] flex items-center gap-2.5 rounded-2xl border border-[#F472B6]/40 bg-[#1d1a2e]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F472B6]/15 text-[#F472B6]">
          <Lightbulb size={17} />
        </span>
        <div>
          <p className="text-[13px] font-bold">Streetlight reported</p>
          <p className="text-[11px] text-fg2">Added to the route map</p>
        </div>
      </motion.div>
    </div>
  );
}

export function ActiveJourneySlide() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Glow className="-left-40 bottom-0 h-[520px] w-[520px] opacity-25" color="#8B5CF6" />
      <SlideShell className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.3fr] lg:gap-10">
          <div>
            <Eyebrow color="#34D399">Active journey & community</Eyebrow>
            <SlideTitle>
              Protected, Even <span className="text-gradient">on the Move.</span>
            </SlideTitle>
            <div className="mt-8 space-y-4 short:mt-5 short:space-y-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.label} variants={rise} className="flex items-center gap-4">
                    <GlowIcon color={f.color} size={52}>
                      <Icon size={23} />
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
          <motion.div variants={rise}>
            <ScaleBox w={660} h={580} heightShare={0.72} maxScale={1.05}>
              <Composition />
            </ScaleBox>
          </motion.div>
        </div>
      </SlideShell>
    </div>
  );
}
