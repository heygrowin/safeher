"use client";

import { useState } from "react";
import { BatteryWarning, ChevronRight, KeyRound, Lock, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { TRUSTED_CONTACTS } from "@/data/contacts";
import { Avatar, ScreenHeader, SimTag, Toggle } from "@/components/ui/primitives";
import type { ScreenId } from "@/types";

export function ProfileScreen() {
  const { state, go, back } = useDemo();
  const [prefs, setPrefs] = useState({ autoShare: true, checkIns: true, hazardAlerts: true });
  const reports = state.hazards.filter((h) => h.userSubmitted).length;

  const links: { icon: typeof ShieldCheck; label: string; to: ScreenId; color: string }[] = [
    { icon: ShieldCheck, label: "Safe Havens", to: "havens", color: "#34D399" },
    { icon: Users, label: "Travel Buddy", to: "buddy", color: "#60A5FA" },
    { icon: KeyRound, label: BRAND.wearable, to: "charm", color: "#C084FC" },
    { icon: BatteryWarning, label: "Battery Saver", to: "lowBattery", color: "#FBBF24" },
  ];

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Profile" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-brand/20 to-card p-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-lav to-vio text-[22px] font-extrabold">A</span>
          <div className="flex-1">
            <p className="text-[17px] font-extrabold">{BRAND.userName}</p>
            <p className="text-[11.5px] text-fg2">{BRAND.city} · demo profile</p>
          </div>
          <SimTag>Demo</SimTag>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { v: state.journey.log.length ? 1 : 0, l: "Journeys" },
            { v: reports, l: "Reports" },
            { v: TRUSTED_CONTACTS.length, l: "Contacts" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-line bg-card/70 py-2.5">
              <p className="text-[18px] font-extrabold">{s.v}</p>
              <p className="text-[10.5px] text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Trusted contacts</p>
        <div className="space-y-2">
          {TRUSTED_CONTACTS.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card/70 px-3 py-2.5">
              <Avatar initials={c.initials} color={c.color} size={34} />
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{c.name}</p>
                <p className="text-[10.5px] text-muted">{c.relation} · receives journey shares & SOS</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Preferences</p>
        <div className="divide-y divide-line/60 rounded-2xl border border-line bg-card/70">
          {(
            [
              ["autoShare", "Share journeys by default", "Temporary, ends on arrival"],
              ["checkIns", "Automatic check-ins", "On deviation or unexpected stop"],
              ["hazardAlerts", "Hazard updates on my route", "From community reports"],
            ] as const
          ).map(([k, l, sub]) => (
            <div key={k} className="flex items-center gap-3 px-3 py-3">
              <div className="flex-1">
                <p className="text-[13px]">{l}</p>
                <p className="text-[10.5px] text-muted">{sub}</p>
              </div>
              <Toggle on={prefs[k]} onChange={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} label={l} />
            </div>
          ))}
        </div>

        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Shortcuts</p>
        <div className="divide-y divide-line/60 rounded-2xl border border-line bg-card/70">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <button key={l.label} onClick={() => go(l.to)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.02]">
                <Icon size={17} style={{ color: l.color }} />
                <span className="flex-1 text-[13px]">{l.label}</span>
                <ChevronRight size={16} className="text-muted" />
              </button>
            );
          })}
          <button onClick={() => go("hazard")} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.02]">
            <TriangleAlert size={17} className="text-warn" />
            <span className="flex-1 text-[13px]">Report a hazard</span>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted">
          <Lock size={12} className="mt-[1px] shrink-0" /> Hackathon demo build. All data is local mock data held in this browser tab — nothing is sent to any server.
        </p>
      </div>
    </div>
  );
}
