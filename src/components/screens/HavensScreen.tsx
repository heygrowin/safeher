"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronRight, Clock, Info, MapPin, Phone, ShieldCheck, X, Check, Navigation } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { SAFE_HAVENS, HAVEN_BY_ID } from "@/data/safeHavens";
import type { HavenCategory } from "@/types";
import { CityMap } from "@/components/maps/CityMap";
import { Button, ScreenHeader, SimTag } from "@/components/ui/primitives";

const FILTERS: ("All" | HavenCategory)[] = ["All", "Café", "Pharmacy", "Shop", "Home"];

export function HavensScreen() {
  const { state, dispatch, back, toast } = useDemo();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [detail, setDetail] = useState<string | null>(state.focusHaven);
  const list = SAFE_HAVENS.filter((h) => filter === "All" || h.category === filter);
  const highlight = detail ?? state.focusHaven;
  const h = detail ? HAVEN_BY_ID[detail] : null;

  const open = (id: string) => {
    dispatch({ type: "FOCUS_HAVEN", id });
    setDetail(id);
  };

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader title="Safe Havens" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Map peek */}
        <div className="relative h-[200px] overflow-hidden rounded-2xl border border-line">
          <div className="absolute inset-x-0 top-[-84px]">
            <CityMap routes={["B"]} selected="B" dimUnselected={false} havens={list} highlightHaven={highlight} onHavenClick={open} showEnd={false} />
          </div>
          <div className="absolute right-2 top-2">
            <SimTag className="bg-bg/70 backdrop-blur">Demo locations</SimTag>
          </div>
        </div>

        {/* Filters */}
        <div className="phone-scroll -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${filter === f ? "bg-brand text-white" : "border border-line bg-card/70 text-fg2 hover:text-fg"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {list.map((hv) => (
              <motion.button
                layout
                key={hv.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                onClick={() => open(hv.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${highlight === hv.id ? "border-ok/50 bg-ok/[0.06]" : "border-line bg-card/70 hover:border-line-strong"}`}
              >
                <img src={hv.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[13px] font-bold">
                    <span className="truncate">{hv.name}</span>
                    <BadgeCheck size={14} className="shrink-0 text-azure" />
                  </p>
                  <p className="text-[11px] text-fg2">
                    {hv.distanceM >= 1000 ? `${(hv.distanceM / 1000).toFixed(1)} km` : `${hv.distanceM} m`} ·{" "}
                    <span className={hv.open ? "text-ok" : "text-muted"}>{hv.open ? "Open" : "Closed"}</span>
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-ok/15 px-2 py-[2px] text-[10px] font-semibold text-ok">
                    <ShieldCheck size={10} /> Safe Haven
                  </span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-muted">
          <Info size={14} className="mt-[1px] shrink-0 text-lav" />
          <p>
            Participating locations are <b className="text-fg2">community-verified support points</b>, not guaranteed safe environments. All entries here are demo
            data.
          </p>
        </div>
      </div>

      {/* Details sheet */}
      <AnimatePresence>
        {h && (
          <>
            <motion.div
              key="scrim"
              className="absolute inset-0 z-30 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetail(null)}
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="phone-scroll absolute inset-x-0 bottom-0 z-40 max-h-[88%] overflow-y-auto rounded-t-[28px] border-t border-line-strong bg-bg2 pb-6"
            >
              <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20" />
              <div className="relative flex items-center gap-3 px-4 pt-4">
                <img src={h.image} alt="" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-ok/40" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-[18px] font-extrabold">{h.name}</h3>
                    <BadgeCheck size={17} className="shrink-0 text-azure" />
                  </div>
                  <p className="text-[11.5px] text-fg2">
                    {h.category} · {h.address}
                  </p>
                </div>
                <button onClick={() => setDetail(null)} aria-label="Close" className="absolute right-3 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/5 hover:bg-white/10">
                  <X size={16} />
                </button>
              </div>
              <div className="px-4">
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-line bg-card/70 py-2">
                    <MapPin size={14} className="mx-auto text-lav" />
                    <p className="mt-0.5 text-[12px] font-bold">{h.distanceM >= 1000 ? `${(h.distanceM / 1000).toFixed(1)} km` : `${h.distanceM} m`}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card/70 py-2">
                    <span className={`mx-auto block h-3.5 w-3.5 rounded-full ${h.open ? "bg-ok" : "bg-muted"}`} />
                    <p className="mt-0.5 text-[12px] font-bold">{h.open ? "Open now" : "Closed"}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-card/70 py-2">
                    <Clock size={14} className="mx-auto text-lav" />
                    <p className="mt-0.5 text-[10.5px] font-bold leading-tight">{h.hours}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl border border-ok/30 bg-ok/10 px-3 py-2 text-[11px] text-ok">
                  <ShieldCheck size={14} /> {h.verifiedLabel}
                </div>

                <p className="mb-1.5 mt-4 text-[12px] font-bold">Agreed support</p>
                <ul className="space-y-1.5">
                  {h.support.map((s) => (
                    <li key={s} className="flex gap-2 text-[12px] text-fg2">
                      <Check size={14} className="mt-[1px] shrink-0 text-ok" /> {s}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-[10.5px] leading-relaxed text-muted">
                  Safe Havens are community-verified support points, not guaranteed safe environments. In an emergency call 112.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    icon={Phone}
                    onClick={() => toast(`Simulated — no call placed to ${h.name}.`, "info")}
                  >
                    Call venue
                  </Button>
                  <Button
                    icon={Navigation}
                    onClick={() => {
                      setDetail(null);
                      toast(`${h.name} highlighted on the map (demo).`, "success");
                    }}
                  >
                    Show on map
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
