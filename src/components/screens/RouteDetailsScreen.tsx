"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Cross, Hospital, Lightbulb, Ruler, Shield, ShieldCheck, Store, Cctv, Tag, ChevronRight, Info } from "lucide-react";
import { useDemo, routeScore, recommendedRoute } from "@/hooks/useDemoState";
import { ROUTE_BY_ID } from "@/data/routes";
import { HAVEN_BY_ID } from "@/data/safeHavens";
import { HAZARD_LABEL } from "@/data/hazards";
import { Button, ScreenHeader, ScoreRing, SimTag, scoreColor, scoreWord } from "@/components/ui/primitives";

export function RouteDetailsScreen() {
  const { state, dispatch, go, back, destinationName } = useDemo();
  const r = ROUTE_BY_ID[state.selectedRoute];
  const score = routeScore(r.id, state.hazards);
  const rec = recommendedRoute(state.hazards);
  const newReports = state.hazards.filter((h) => h.userSubmitted && h.routeId === r.id);
  const color = scoreColor(score);
  const ind = r.indicators;

  const rows = [
    { icon: Store, label: "Open shops", value: ind.openShops, color: "#C084FC" },
    { icon: Cross, label: "Pharmacies", value: ind.pharmacies, color: "#34D399" },
    { icon: Hospital, label: "Hospitals / Clinics", value: ind.clinics, color: "#F472B6" },
    { icon: Shield, label: "Police stations", value: ind.police, color: "#60A5FA" },
    { icon: Lightbulb, label: "Street lighting", value: ind.lighting, color: "#FDE68A" },
    { icon: Cctv, label: "Public CCTV references", value: ind.cctvRefs, color: "#22D3EE", note: "Public map references only — not live feeds" },
  ];

  const start = () => {
    dispatch({ type: "JOURNEY_START", fresh: true });
    go("journey");
  };

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={`${r.name} – Details`} onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border p-4"
          style={{ borderColor: `${color}55`, background: `linear-gradient(135deg, ${color}1c, rgba(27,29,58,0.8))` }}
        >
          <div className="relative">
            <ScoreRing value={score} color={color} size={70} />
            <ShieldCheck size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color }} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-fg2">Route Support Score</p>
            <p className="flex items-baseline gap-2">
              <span className="text-[32px] font-extrabold leading-none">{score}%</span>
              <span className="rounded-full px-2 py-[2px] text-[10px] font-bold" style={{ background: `${color}26`, color }}>
                {scoreWord(score)}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-muted">
              {r.id === rec ? "Recommended · " : ""}to {destinationName}
            </p>
          </div>
        </motion.div>

        {newReports.length > 0 && (
          <div className="mt-2 rounded-xl border border-warn/30 bg-warn/10 px-3 py-2 text-[11px] text-warn">
            Adjusted from {r.baseScore}% after {newReports.length} new report{newReports.length > 1 ? "s" : ""} (
            {newReports.map((h) => HAZARD_LABEL[h.category]).join(", ")}) — illustrative.
          </div>
        )}

        {/* Time & distance */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-card/70 px-3 py-2.5">
            <Clock size={16} className="text-lav" />
            <div>
              <p className="text-[10px] text-muted">Est. travel time</p>
              <p className="text-[14px] font-bold">{r.minutes} min walk</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-card/70 px-3 py-2.5">
            <Ruler size={16} className="text-lav" />
            <div>
              <p className="text-[10px] text-muted">Distance</p>
              <p className="text-[14px] font-bold">{r.km.toFixed(1)} km</p>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="mt-3 rounded-2xl border border-line bg-card/70 px-3 py-1">
          <div className="flex items-center justify-between py-2">
            <p className="text-[12px] font-bold">Support indicators</p>
            <SimTag>Demo data</SimTag>
          </div>
          {rows.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 border-t border-line/60 py-2.5"
              >
                <Icon size={16} style={{ color: row.color }} />
                <div className="flex-1">
                  <p className="text-[13px]">{row.label}</p>
                  {row.note && <p className="text-[10px] text-muted">{row.note}</p>}
                </div>
                <p className="text-[13px] font-bold">{row.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Havens */}
        <div className="mt-3">
          <p className="mb-2 text-[12px] font-bold">Nearby Safe Havens on this route</p>
          {r.havenIds.length ? (
            <div className="phone-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {r.havenIds.map((id) => {
                const h = HAVEN_BY_ID[id];
                return (
                  <button
                    key={id}
                    onClick={() => {
                      dispatch({ type: "FOCUS_HAVEN", id });
                      go("havens");
                    }}
                    className="flex w-[150px] shrink-0 items-center gap-2 rounded-xl border border-line bg-card/70 p-2 text-left hover:border-ok/40"
                  >
                    <img src={h.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-bold">{h.name}</span>
                      <span className={`block text-[10px] ${h.open ? "text-ok" : "text-muted"}`}>
                        {h.distanceM} m · {h.open ? "Open" : "Closed"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-line bg-card/50 px-3 py-2.5 text-[12px] text-muted">No participating Safe Havens along this route.</p>
          )}
        </div>

        {/* Local offer — sponsorship never affects scores */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-gradient-to-r from-warn/10 to-transparent p-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-warn/15 text-warn">
            <Tag size={16} />
          </span>
          <div className="flex-1">
            <p className="text-[12px] font-bold">
              Local offer <span className="ml-1 rounded bg-white/10 px-1 py-[1px] text-[9px] font-semibold uppercase text-muted">Sponsored · demo</span>
            </p>
            <p className="text-[11px] text-fg2">10% off at Blossom Café this evening</p>
          </div>
          <button
            onClick={() => dispatch({ type: "TOAST", text: "Promotions are optional and never influence routes or scores.", tone: "info" })}
            aria-label="About sponsored offers"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-fg"
          >
            <Info size={15} />
          </button>
        </div>

        <Button full size="lg" className="mt-4" iconRight={ArrowRight} onClick={start}>
          Start Navigation
        </Button>
        <button onClick={() => go("routes")} className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-[12px] font-semibold text-fg2 hover:text-fg">
          Compare other routes <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
