"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Info, MapPin, Navigation, Search, Pencil, Check } from "lucide-react";
import { useDemo, routeScore, recommendedRoute } from "@/hooks/useDemoState";
import { ROUTES } from "@/data/routes";
import { CURRENT_LOCATION, DESTINATIONS } from "@/data/locations";
import { CityMap } from "@/components/maps/CityMap";
import { Button, ScreenHeader, SimTag, scoreColor } from "@/components/ui/primitives";

const LOADING_STEPS = ["Comparing route alternatives", "Counting open businesses & pharmacies", "Checking street lighting data", "Locating verified Safe Havens"];

export function RoutesScreen() {
  const { state, dispatch, go, back } = useDemo();
  const [query, setQuery] = useState("");
  const [step, setStep] = useState(0);
  const dest = DESTINATIONS.find((d) => d.id === state.destinationId);

  useEffect(() => {
    if (!dest || state.routesReady) return;
    setStep(0);
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 420);
    const t = setTimeout(() => dispatch({ type: "ROUTES_READY", ready: true }), 1800);
    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
  }, [dest, state.routesReady, dispatch]);

  const rec = recommendedRoute(state.hazards);
  const scores = Object.fromEntries(ROUTES.map((r) => [r.id, routeScore(r.id, state.hazards)]));
  const sorted = [...ROUTES].sort((a, b) => (a.id === rec ? -1 : b.id === rec ? 1 : 0));

  /* Destination picker ---------------------------------------------------- */
  if (!dest) {
    const list = DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Choose Destination" onBack={back} />
        <div className="px-4 pb-6">
          <div className="rounded-2xl border border-line bg-card/80 px-3 py-2.5">
            <p className="flex items-center gap-2 text-[12px] text-fg2">
              <Navigation size={12} className="text-azure" fill="currentColor" /> From {CURRENT_LOCATION}
            </p>
          </div>
          <label className="mt-3 flex items-center gap-2 rounded-2xl border border-line-strong bg-bg2 px-3">
            <Search size={15} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to go?"
              className="h-12 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted"
            />
          </label>
          <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Demo destinations · Messina</p>
          <div className="space-y-2">
            {list.map((d, i) => (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => dispatch({ type: "SET_DESTINATION", id: d.id })}
                className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card/70 px-3 py-3 text-left hover:border-line-strong"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F472B6]/15 text-[#F472B6]">
                  <MapPin size={16} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13px] font-bold">{d.name}</span>
                  <span className="block text-[11px] text-muted">{d.area}</span>
                </span>
                <ChevronRight size={16} className="text-muted" />
              </motion.button>
            ))}
            {!list.length && <p className="text-[12px] text-muted">No demo destination matches “{query}”.</p>}
          </div>
        </div>
      </div>
    );
  }

  /* Loading ---------------------------------------------------------------- */
  if (!state.routesReady) {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Choose a Route" onBack={back} />
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 rounded-full border border-line" />
            <div className="absolute inset-5 rounded-full border border-line" />
            <div className="absolute inset-10 rounded-full border border-line" />
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "conic-gradient(from 0deg, rgba(168,85,247,0.55), transparent 30%)", animation: "scan 1.4s linear infinite" }}
            />
            <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-[0_0_24px_#A855F7]">
              <Navigation size={18} fill="#fff" strokeWidth={0} />
            </span>
          </div>
          <p className="mt-6 text-[15px] font-bold">Finding supported routes…</p>
          <p className="mt-1 text-[12px] text-fg2">to {dest.name}</p>
          <div className="mt-5 w-full space-y-2 text-left">
            {LOADING_STEPS.map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: i <= step ? 1 : 0.3 }} className="flex items-center gap-2 text-[12px] text-fg2">
                <span className={`grid h-4 w-4 place-items-center rounded-full ${i < step ? "bg-ok text-bg" : i === step ? "border-2 border-lav border-t-transparent animate-spin" : "border border-line"}`}>
                  {i < step && <Check size={10} strokeWidth={3.4} />}
                </span>
                {s}
              </motion.div>
            ))}
          </div>
          <SimTag className="mt-5">Mock data</SimTag>
        </div>
      </div>
    );
  }

  /* Comparison ------------------------------------------------------------- */
  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Choose a Route" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-card/70 px-3 py-2 text-[12px]">
          <span className="h-2 w-2 rounded-full bg-azure" />
          <span className="truncate text-fg2">Via Garibaldi</span>
          <span className="text-muted">→</span>
          <span className="h-2 w-2 rounded-full bg-[#F472B6]" />
          <span className="flex-1 truncate font-semibold">{dest.name}</span>
          <button
            onClick={() => {
              dispatch({ type: "SET_DESTINATION", id: "" });
            }}
            aria-label="Change destination"
            className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-fg"
          >
            <Pencil size={13} />
          </button>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-2xl border border-line">
          <CityMap
            selected={state.selectedRoute}
            onSelect={(id) => dispatch({ type: "SELECT_ROUTE", id })}
            scores={scores}
            recommended={rec}
            hazards={state.hazards}
            drawKey={state.destinationId ?? 0}
          />
          <div className="absolute left-2 top-2">
            <SimTag className="bg-bg/70 backdrop-blur">Illustrative routes</SimTag>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {sorted.map((r, i) => {
            const sel = r.id === state.selectedRoute;
            const sc = scores[r.id];
            const adjusted = sc !== r.baseScore;
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${sel ? "border-lav/70 bg-brand/10" : "border-line bg-card/70"}`}
              >
                <button onClick={() => dispatch({ type: "SELECT_ROUTE", id: r.id })} className="flex flex-1 items-center gap-3 text-left">
                  <span className="h-9 w-1.5 rounded-full" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }} />
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold">
                      {r.name}
                      {r.id === rec && <span className="rounded-full bg-brand/30 px-1.5 py-[1px] text-[9px] font-bold uppercase text-lav">Recommended</span>}
                    </span>
                    <span className="block text-[11.5px] text-fg2">
                      {r.minutes} min ({r.km.toFixed(1)} km) ·{" "}
                      <span className="font-semibold" style={{ color: scoreColor(sc) }}>
                        {sc}% support
                      </span>
                      {adjusted && <span className="text-warn"> (was {r.baseScore}%)</span>}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: "SELECT_ROUTE", id: r.id });
                    go("routeDetails");
                  }}
                  aria-label={`${r.name} details`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-fg"
                >
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>

        <Button full className="mt-3" onClick={() => go("routeDetails")} iconRight={ChevronRight}>
          View Route {state.selectedRoute} Details
        </Button>

        <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-muted">
            <Info size={14} className="mt-[1px] shrink-0 text-lav" />
            <p>
              Route Support Score is an <b className="text-fg2">illustrative index</b> built from mock support indicators (open businesses, lighting, Safe Havens,
              reports). It is not a guarantee that any route is safe.
            </p>
        </div>
      </div>
    </div>
  );
}
