"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, BellRing, Check, Footprints, Lock, MapPin, Route as RouteIcon, Users, X } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { TRAVEL_BUDDIES, TRUSTED_CONTACTS } from "@/data/contacts";
import { Avatar, Button, ScreenHeader, SimTag } from "@/components/ui/primitives";

export function BuddyScreen() {
  const { state, dispatch, back } = useDemo();
  const b = state.buddy;
  const selected = TRAVEL_BUDDIES.find((x) => x.id === b.selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Travel Buddy" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto pb-6">
        {/* Hero */}
        <div className="relative h-[210px]">
          <img src="/images/travel-buddies.png" alt="Two women walking together at night" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
          <div className="absolute inset-x-4 bottom-1">
            <h3 className="text-[22px] font-extrabold leading-tight">
              Walk Together,
              <br />
              Safer Together
            </h3>
          </div>
        </div>

        <div className="px-4">
          <p className="mt-1 text-[12px] text-fg2">Find people on a similar route or set a virtual check-in. Only route overlap is shown — never exact locations.</p>

          <div className="mb-2 mt-4 flex items-center justify-between">
            <p className="text-[12px] font-bold">Nearby on a similar route</p>
            <SimTag>Demo profiles</SimTag>
          </div>
          <div className="space-y-2">
            {TRAVEL_BUDDIES.map((t, i) => {
              const on = t.id === b.selectedId;
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => dispatch({ type: "BUDDY_SELECT", id: on ? null : t.id })}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${on ? "border-lav bg-brand/10" : "border-line bg-card/70 hover:border-line-strong"}`}
                >
                  <Avatar initials={t.initials} color={t.color} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[13px] font-bold">
                      {t.alias}
                      {t.verified ? <BadgeCheck size={13} className="text-azure" /> : <span className="text-[9.5px] font-semibold text-muted">· unverified</span>}
                    </p>
                    <p className="flex items-center gap-1 truncate text-[11px] text-fg2">
                      <RouteIcon size={10} /> {t.routeMatch}
                    </p>
                    <p className="text-[10.5px] text-muted">
                      {t.departs} · {t.note}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-extrabold text-lav">{t.overlap}%</p>
                    <p className="text-[9.5px] text-muted">overlap</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Request flow */}
          <AnimatePresence mode="wait">
            {b.request === "confirmed" && selected ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-2xl border border-ok/40 bg-ok/[0.08] p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-bg">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold">{selected.alias} accepted your shared commute</p>
                    <p className="text-[11px] text-fg2">Simulated confirmation</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-[11.5px] text-fg2">
                  <MapPin size={13} className="text-ok" /> Meet at <b className="text-fg">Blossom Café</b> (Safe Haven) · 21:46
                </div>
                <Button size="sm" variant="ghost" full className="mt-2" icon={X} onClick={() => dispatch({ type: "BUDDY_CANCEL" })}>
                  Cancel shared commute
                </Button>
              </motion.div>
            ) : (
              <motion.div key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
                <Button full size="lg" icon={b.request === "pending" ? undefined : Footprints} disabled={!selected || b.request === "pending"} onClick={() => dispatch({ type: "BUDDY_REQUEST" })}>
                  {b.request === "pending" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Waiting for {selected?.alias}…
                    </span>
                  ) : selected ? (
                    `Request Shared Commute with ${selected.alias.split(" ")[0]}`
                  ) : (
                    "Select a buddy to request"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Virtual check-in */}
          <div className={`mt-3 rounded-2xl border p-3 transition-colors ${b.virtualCheckIn ? "border-lav/50 bg-brand/10" : "border-line bg-card/70"}`}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-azure/15 text-azure">
                <BellRing size={17} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-bold">Virtual check-in</p>
                <p className="text-[11px] text-muted">
                  {b.virtualCheckIn
                    ? `Active · ${selected ? selected.alias + " and " : ""}${TRUSTED_CONTACTS.map((c) => c.name).join(" & ")} will be asked to confirm you arrived`
                    : "Someone virtually walks with you until you arrive"}
                </p>
              </div>
            </div>
            <Button size="sm" full className="mt-2.5" variant={b.virtualCheckIn ? "ghost" : "soft"} icon={b.virtualCheckIn ? X : Users} onClick={() => dispatch({ type: "BUDDY_VIRTUAL" })}>
              {b.virtualCheckIn ? "End virtual check-in" : "Set Virtual Check-in"}
            </Button>
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted">
            <Lock size={12} className="mt-[1px] shrink-0" /> Demo profiles only. A real version would require verification and never expose exact live locations.
          </p>
        </div>
      </div>
    </div>
  );
}
