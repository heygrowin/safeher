"use client";

import { motion } from "framer-motion";
import { ArrowRight, BellRing, Check, KeyRound, ShieldCheck, Users, X, HeartHandshake } from "lucide-react";
import { BRAND } from "@/config/brand";
import { TRUSTED_CONTACTS } from "@/data/contacts";
import { CharmVisual } from "@/components/wearable/CharmVisual";
import { Avatar } from "@/components/ui/primitives";
import { LogoMark } from "@/components/ui/Logo";
import { SlideShell, SlideTitle, Eyebrow, rise, Glow } from "../SlideParts";
import { ScaleBox, MockPhone, GlowIcon } from "../SlideVisuals";

const HIGHLIGHTS = [
  { icon: KeyRound, label: "Emergency trigger", color: "#F43F5E" },
  { icon: HeartHandshake, label: "Trusted contacts", color: "#C084FC" },
  { icon: Users, label: "Community support", color: "#34D399" },
];

const HUB: [number, number] = [325, 280];
const LINKS: { to: [number, number]; color: string; delay: number }[] = [
  { to: [100, 415], color: "#F43F5E", delay: 0.6 }, // charm
  { to: [560, 95], color: "#C084FC", delay: 0.9 }, // contact 1
  { to: [585, 215], color: "#C084FC", delay: 1.0 }, // contact 2
  { to: [80, 115], color: "#34D399", delay: 1.2 }, // nearby users
  { to: [575, 435], color: "#34D399", delay: 1.3 }, // safe haven
];

function SosPhone() {
  return (
    <MockPhone width={250} height={500} tone="sos">
      <div className="flex h-full flex-col items-center px-3 text-center">
        <p className="mt-1 text-[14px] font-bold tracking-wide">SOS</p>
        <div className="relative mt-4 grid h-[118px] w-[118px] place-items-center">
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-2 rounded-full bg-sos/35"
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i }}
            />
          ))}
          <span
            className="relative grid h-[96px] w-[96px] place-items-center rounded-full text-white"
            style={{ background: "radial-gradient(circle at 35% 30%, #FB7185, #F43F5E 45%, #BE123C)", boxShadow: "0 0 50px rgba(244,63,94,0.6)" }}
          >
            <BellRing size={38} />
          </span>
        </div>
        <p className="mt-3 text-[16px] font-extrabold">Emergency Alert</p>
        <p className="text-[10px] text-fg2">Sending to your trusted contacts</p>
        <div className="mt-3 w-full space-y-2 rounded-2xl border border-sos/30 bg-[#1f0d1c]/80 p-2.5 text-left">
          {["Sharing your location", "Notifying trusted contacts (2)", "Nearby community alert"].map((t) => (
            <p key={t} className="flex items-center gap-2 text-[10.5px] font-semibold">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ok text-bg">
                <Check size={10} strokeWidth={3.5} />
              </span>
              {t}
            </p>
          ))}
        </div>
        <span className="mt-auto mb-6 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-sos to-[#E11D48] py-2.5 text-[12px] font-bold">
          <X size={14} /> Cancel SOS
        </span>
      </div>
    </MockPhone>
  );
}

function Node({ x, y, children, label, delay }: { x: number; y: number; children: React.ReactNode; label?: string; delay: number }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5"
      style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.3, type: "spring", stiffness: 220, damping: 16 }}
    >
      {children}
      {label && <span className="whitespace-nowrap rounded-full border border-line bg-bg/70 px-2.5 py-1 text-[12px] font-semibold text-fg2 backdrop-blur">{label}</span>}
    </motion.div>
  );
}

function Network() {
  return (
    <div className="relative h-[560px] w-[660px]">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.22),transparent_65%)] blur-2xl" />
      <svg className="absolute inset-0" width="660" height="560" aria-hidden>
        {LINKS.map((l, i) => (
          <g key={i}>
            <motion.line x1={HUB[0]} y1={HUB[1]} x2={l.to[0]} y2={l.to[1]} stroke={l.color} strokeOpacity="0.25" strokeWidth="6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: l.delay }} />
            <motion.line
              x1={HUB[0]}
              y1={HUB[1]}
              x2={l.to[0]}
              y2={l.to[1]}
              stroke={l.color}
              strokeWidth="2"
              strokeDasharray="3 9"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, strokeDashoffset: [0, -48] }}
              transition={{ opacity: { delay: l.delay + 0.6 }, strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: "linear" } }}
            />
          </g>
        ))}
      </svg>

      {/* Charm → emergency trigger */}
      <Node x={100} y={415} label="Emergency trigger" delay={0.6}>
        <CharmVisual size={150} float={false} />
      </Node>

      {/* Trusted contacts */}
      {TRUSTED_CONTACTS.map((c, i) => (
        <Node key={c.id} x={i === 0 ? 560 : 585} y={i === 0 ? 95 : 215} delay={0.9 + i * 0.1} label={i === 1 ? "Trusted contacts" : undefined}>
          <span className="rounded-full bg-bg p-1 shadow-[0_0_24px_rgba(192,132,252,0.6)] ring-2 ring-lav/60">
            <Avatar initials={c.initials} color={c.color} size={52} />
          </span>
        </Node>
      ))}

      {/* Community */}
      <Node x={80} y={115} delay={1.2}>
        <span className="rounded-2xl bg-bg">
          <GlowIcon color="#34D399" size={60}>
            <Users size={26} />
          </GlowIcon>
        </span>
      </Node>
      <Node x={575} y={435} label="Community support" delay={1.3}>
        <span className="rounded-2xl bg-bg">
          <GlowIcon color="#34D399" size={60}>
            <ShieldCheck size={26} />
          </GlowIcon>
        </span>
      </Node>

      {/* Phone hub */}
      <motion.div
        className="absolute left-[200px] top-[30px]"
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <SosPhone />
      </motion.div>
    </div>
  );
}

export function CommunitySlide({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Glow className="-right-40 bottom-0 h-[560px] w-[560px] opacity-25" color="#F43F5E" />
      <Glow className="-left-40 top-0 h-[480px] w-[480px] opacity-20" />
      <SlideShell className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <div>
            <Eyebrow color="#FB7185">Emergency & community impact</Eyebrow>
            <SlideTitle>
              A Community That <span className="text-gradient">Looks Out for You.</span>
            </SlideTitle>

            <motion.div variants={rise} className="mt-7 flex flex-wrap gap-2.5 short:mt-5">
              {HIGHLIGHTS.map((h) => {
                const Icon = h.icon;
                return (
                  <span key={h.label} className="flex items-center gap-2.5 rounded-full border border-line bg-card/50 py-1.5 pl-1.5 pr-4 text-[14px] font-bold">
                    <GlowIcon color={h.color} size={34}>
                      <Icon size={16} />
                    </GlowIcon>
                    {h.label}
                  </span>
                );
              })}
            </motion.div>

            {/* Brand ending */}
            <motion.div variants={rise} className="mt-10 flex items-center gap-4 short:mt-6">
              <LogoMark size={54} className="drop-shadow-[0_0_24px_rgba(192,132,252,0.7)]" />
              <div>
                <p className="text-[38px] font-extrabold leading-none tracking-tight">
                  Safe<span className="text-gradient">Her</span>
                </p>
                <p className="mt-1.5 text-[18px] font-semibold text-lav">{BRAND.tagline}</p>
              </div>
            </motion.div>

            <motion.div variants={rise} className="mt-8 short:mt-5">
              <motion.button
                onClick={onLaunch}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary group relative flex h-14 items-center gap-3 overflow-hidden rounded-2xl px-7 text-[17px] font-extrabold"
              >
                <motion.span
                  className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)]"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative">Experience the App</span>
                <ArrowRight size={20} className="relative transition-transform group-hover:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>

          <motion.div variants={rise}>
            <ScaleBox w={660} h={560} heightShare={0.74} maxScale={1.05}>
              <Network />
            </ScaleBox>
          </motion.div>
        </div>
      </SlideShell>
    </div>
  );
}
