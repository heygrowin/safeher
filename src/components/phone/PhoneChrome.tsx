"use client";

import { AnimatePresence, motion } from "framer-motion";
import { House, Map as MapIcon, Route, User, Wifi, Signal, CheckCircle2, Info, TriangleAlert, Siren, KeyRound } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import type { ScreenId } from "@/types";

export function StatusBar({ tone = "default" }: { tone?: "default" | "sos" }) {
  const { state } = useDemo();
  const b = state.phoneBattery;
  const low = b <= 5;
  return (
    <div className={`relative z-50 flex h-[48px] shrink-0 items-center justify-between pl-8 pr-7 pt-1 text-[14px] font-semibold ${tone === "sos" ? "text-white" : "text-fg"}`}>
      <span className="flex w-[92px] items-center gap-1.5 tabular-nums">
        21:41
        {state.charm.connected && (
          <span title="Charm connected (simulated)" className="grid h-4 w-4 place-items-center rounded-full bg-brand/40 text-white">
            <KeyRound size={9} strokeWidth={2.8} />
          </span>
        )}
      </span>
      <div className="flex w-[92px] items-center justify-end gap-1.5">
        <Signal size={14} strokeWidth={2.6} />
        <Wifi size={14} strokeWidth={2.6} />
        <span className={`relative grid h-[13px] w-[27px] place-items-center rounded-[4px] text-[9px] font-extrabold leading-none tabular-nums ${low ? "bg-sos/25 text-sos ring-1 ring-sos" : "bg-white/90 text-bg"}`}>
          {low && <span className="absolute inset-y-0 left-0 rounded-[3px] bg-sos/70" style={{ width: `${b * 4}%` }} />}
          <span className="relative">{b}</span>
          <span className={`absolute -right-[3px] top-[4px] h-[5px] w-[2px] rounded-r ${low ? "bg-sos" : "bg-white/70"}`} />
        </span>
      </div>
    </div>
  );
}

const TABS: { id: string; label: string; icon: typeof House; to: ScreenId; match: ScreenId[] }[] = [
  { id: "home", label: "Home", icon: House, to: "home", match: ["home", "hazard", "buddy", "sos"] },
  { id: "map", label: "Map", icon: MapIcon, to: "routes", match: ["routes", "routeDetails", "havens"] },
  { id: "journey", label: "Journey", icon: Route, to: "journey", match: ["journey"] },
  { id: "charm", label: "Charm", icon: KeyRound, to: "charm", match: ["charm", "lowBattery"] },
  { id: "profile", label: "Profile", icon: User, to: "profile", match: ["profile"] },
];

export function BottomNav() {
  const { state, go } = useDemo();
  const journeyLive = state.journey.status === "active" || state.journey.status === "paused";
  return (
    <nav className="relative z-40 flex h-[78px] shrink-0 items-start justify-around border-t border-line bg-bg2/95 px-2 pt-2 backdrop-blur-xl">
      {TABS.map((t) => {
        const active = t.match.includes(state.screen);
        const Icon = t.icon;
        return (
          <button key={t.id} onClick={() => go(t.to)} className="relative flex w-14 flex-col items-center gap-1 py-1" aria-current={active ? "page" : undefined}>
            {active && <motion.span layoutId="tab-pill" className="absolute -top-2 h-[3px] w-8 rounded-full bg-lav shadow-[0_0_12px_#C084FC]" />}
            <span className="relative">
              <Icon size={21} strokeWidth={active ? 2.4 : 1.9} className={active ? "text-lav" : "text-muted"} />
              {t.id === "journey" && journeyLive && <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-ok ring-2 ring-bg2" />}
              {t.id === "charm" && !state.charm.connected && <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-warn ring-2 ring-bg2" />}
            </span>
            <span className={`text-[10px] font-semibold ${active ? "text-lav" : "text-muted"}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const TONE = {
  info: { icon: Info, cls: "text-azure" },
  success: { icon: CheckCircle2, cls: "text-ok" },
  warn: { icon: TriangleAlert, cls: "text-warn" },
  sos: { icon: Siren, cls: "text-sos" },
};

export function PhoneToasts() {
  const { state, dispatch } = useDemo();
  return (
    <div className="pointer-events-none absolute inset-x-3 top-[50px] z-[70] flex flex-col items-center gap-2">
      <AnimatePresence>
        {state.toasts.map((t) => {
          const T = TONE[t.tone];
          return (
            <motion.button
              layout
              key={t.id}
              onClick={() => dispatch({ type: "DISMISS_TOAST", id: t.id })}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="pointer-events-auto flex w-full items-start gap-2 rounded-2xl border border-line bg-[#1d1f3d]/95 px-3 py-2.5 text-left text-[12px] font-medium text-fg shadow-xl backdrop-blur-xl"
            >
              <T.icon size={16} className={`mt-[1px] shrink-0 ${T.cls}`} />
              <span className="leading-snug">{t.text}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
