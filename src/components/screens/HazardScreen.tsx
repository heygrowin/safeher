"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, ImagePlus, Info, MapPin, Plus, Send, X, ArrowRight, EyeOff } from "lucide-react";
import { useDemo, routeScore } from "@/hooks/useDemoState";
import { HAZARD_CATEGORIES, HAZARD_ICON, HAZARD_LABEL, HAZARD_SPOTS } from "@/data/hazards";
import { ROUTE_BY_ID, HAZARD_IMPACT } from "@/data/routes";
import type { HazardCategory } from "@/types";
import { CityMap } from "@/components/maps/CityMap";
import { Button, ScreenHeader, SimTag, scoreColor } from "@/components/ui/primitives";

export function HazardScreen() {
  const { state, dispatch, go, back } = useDemo();
  const [cat, setCat] = useState<HazardCategory | null>(null);
  const [spot, setSpot] = useState(HAZARD_SPOTS[0].id);
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (!cat) return;
    setSending(true);
    setTimeout(() => {
      dispatch({ type: "ADD_HAZARD", category: cat, details, spotId: spot, hasPhoto: photo });
      setSending(false);
      setCat(null);
      setDetails("");
      setPhoto(false);
    }, 900);
  };

  const last = state.hazards.find((h) => h.id === state.lastHazardId);

  if (state.hazardView === "success" && last) {
    const route = last.routeId ? ROUTE_BY_ID[last.routeId] : null;
    const after = route ? routeScore(route.id, state.hazards) : 0;
    const before = route ? after + HAZARD_IMPACT[last.category] : 0;
    const Icon = HAZARD_ICON[last.category];
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="Report a Hazard" onBack={back} />
        <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
          <div className="flex flex-col items-center pt-1 text-center">
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="grid h-16 w-16 place-items-center rounded-full bg-ok/15 text-ok ring-8 ring-ok/5"
            >
              <Check size={32} strokeWidth={3} />
            </motion.span>
            <h3 className="mt-3 text-[18px] font-extrabold">Thanks — report added</h3>
            <p className="mt-1 text-[12px] text-fg2">Saved to the local demo hazard list. Nothing was sent anywhere.</p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-warn/30 bg-warn/[0.07] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-warn/15 text-warn">
              <Icon size={18} />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-bold">{HAZARD_LABEL[last.category]}</p>
              <p className="text-[11px] text-fg2">
                {last.locationLabel} · {last.createdLabel}
                {last.hasPhoto ? " · photo attached" : ""}
              </p>
              {last.details && <p className="mt-0.5 text-[11px] italic text-muted">“{last.details}”</p>}
            </div>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-2xl border border-line">
            <CityMap selected={last.routeId} hazards={state.hazards} highlightHazard={last.id} drawKey={last.id} />
            <div className="absolute left-2 top-2">
              <SimTag className="bg-bg/70 backdrop-blur">New marker added</SimTag>
            </div>
          </div>

          {route && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-3 rounded-2xl border border-line bg-card/70 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Route impact preview</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full" style={{ background: route.color }} />
                <p className="flex-1 text-[13px] font-bold">{route.name}</p>
                <span className="text-[14px] font-bold text-muted line-through">{before}%</span>
                <ArrowRight size={14} className="text-muted" />
                <span className="text-[16px] font-extrabold" style={{ color: scoreColor(after) }}>
                  {after}%
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Illustrative: in a future version, verified reports could lower a segment’s support score so route suggestions adapt.
              </p>
            </motion.div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="ghost" icon={Plus} onClick={() => dispatch({ type: "HAZARD_VIEW", view: "form" })}>
              Report another
            </Button>
            <Button
              iconRight={ArrowRight}
              onClick={() => {
                if (!state.destinationId) dispatch({ type: "SET_DESTINATION", id: "duomo" });
                go("routes");
              }}
            >
              View routes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Report a Hazard" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        <p className="text-[18px] font-extrabold leading-tight">Help Improve the Route for Everyone.</p>
        <p className="mt-1 text-[12px] text-fg2">Flag a place-based issue. Reports describe places, never people.</p>

        {/* Categories */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {HAZARD_CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            const on = cat === c.id;
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCat(on ? null : c.id)}
                aria-pressed={on}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3.5 text-center transition-colors ${i === 2 ? "col-span-2 flex-row justify-center gap-3" : ""} ${on ? "border-lav bg-brand/15 shadow-[0_0_20px_-6px_#A855F7]" : "border-line bg-card/70 hover:border-line-strong"}`}
              >
                {on && (
                  <motion.span layoutId="haz-check" className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-lav text-bg">
                    <Check size={10} strokeWidth={3.5} />
                  </motion.span>
                )}
                <Icon size={22} className={on ? "text-lav" : "text-fg2"} />
                <span className={i === 2 ? "text-left" : ""}>
                  <span className="block text-[12.5px] font-bold">{c.label}</span>
                  <span className="block text-[10.5px] text-muted">{c.hint}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Location */}
        <p className="mb-1.5 mt-4 flex items-center gap-1.5 text-[12px] font-bold">
          <MapPin size={13} className="text-lav" /> Location <SimTag>Demo pin</SimTag>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {HAZARD_SPOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSpot(s.id)}
              className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${spot === s.id ? "bg-brand text-white" : "border border-line bg-card/70 text-fg2 hover:text-fg"}`}
            >
              {s.label} <span className="opacity-70">· Route {s.routeId}</span>
            </button>
          ))}
        </div>

        {/* Details */}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value.slice(0, 160))}
          placeholder="Add details (optional) — describe the place, not people"
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl border border-line bg-card/70 px-3 py-2.5 text-[13px] outline-none placeholder:text-muted focus:border-line-strong"
        />
        <p className="-mt-1 text-right text-[10px] text-muted">{details.length}/160</p>

        {/* Photo */}
        <div className="mt-1 flex gap-2">
          <AnimatePresence>
            {photo && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="relative h-[72px] w-[100px] overflow-hidden rounded-xl border border-line bg-gradient-to-br from-[#2b2350] via-[#3a2a1a] to-[#121230]"
              >
                <span className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full bg-[#FDE68A]/40 blur-md" />
                <Camera size={16} className="absolute bottom-2 left-2 text-white/60" />
                <span className="absolute bottom-1.5 right-2 text-[9px] text-white/60">demo.jpg</span>
                <button onClick={() => setPhoto(false)} aria-label="Remove photo" className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60">
                  <X size={11} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {!photo && (
            <button
              onClick={() => setPhoto(true)}
              className="flex h-[72px] w-[100px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong text-muted hover:text-fg"
            >
              <ImagePlus size={18} />
              <span className="text-[10px] font-semibold">Attach photo</span>
            </button>
          )}
          <p className="flex flex-1 items-center gap-1.5 text-[10.5px] leading-snug text-muted">
            <EyeOff size={14} className="shrink-0" /> Photo is a simulated placeholder. Avoid capturing faces or identifying people.
          </p>
        </div>

        <Button full size="lg" className="mt-4" icon={sending ? undefined : Send} disabled={!cat || sending} onClick={submit}>
          {sending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Submitting…
            </span>
          ) : (
            "Submit Report"
          )}
        </Button>
        {!cat && <p className="mt-1.5 text-center text-[11px] text-muted">Select a category to continue</p>}

        {/* Existing reports */}
        <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted">Recent reports nearby ({state.hazards.length})</p>
        <div className="space-y-1.5">
          {[...state.hazards].reverse().map((h) => {
            const Icon = HAZARD_ICON[h.category];
            return (
              <div key={h.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-card/50 px-3 py-2">
                <Icon size={15} className="text-warn" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold">{HAZARD_LABEL[h.category]}</p>
                  <p className="truncate text-[10.5px] text-muted">
                    {h.locationLabel} · {h.createdLabel}
                  </p>
                </div>
                {h.userSubmitted && <span className="rounded-full bg-brand/20 px-1.5 py-[1px] text-[9px] font-bold uppercase text-lav">You</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-muted">
          <Info size={14} className="mt-[1px] shrink-0 text-lav" />
          <p>Reports are user-submitted, place-based and never publicly identify individuals. No automated person detection is used.</p>
        </div>
      </div>
    </div>
  );
}
