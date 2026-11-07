"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Clock, Pause, Play, Square, Shuffle, Hourglass, ShieldCheck, ShieldAlert, Route as RouteIcon, MapPin, Siren, ChevronRight, X } from "lucide-react";
import { useDemo, routeScore, recommendedRoute } from "@/hooks/useDemoState";
import { ROUTE_BY_ID, ROUTES } from "@/data/routes";
import { TRUSTED_CONTACTS } from "@/data/contacts";
import { CityMap } from "@/components/maps/CityMap";
import { Avatar, Button, ScreenHeader, SimTag, Toggle, scoreColor } from "@/components/ui/primitives";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function JourneyScreen() {
  const { state, dispatch, go, back, destinationName } = useDemo();
  const j = state.journey;
  const r = ROUTE_BY_ID[state.selectedRoute];
  const remaining = Math.max(0, Math.ceil(r.minutes * (1 - j.progress)));
  const arrival = (() => {
    const total = 21 * 60 + 41 + remaining;
    return `${Math.floor(total / 60) % 24}:${String(total % 60).padStart(2, "0")}`;
  })();
  const rec = recommendedRoute(state.hazards);

  const status = {
    idle: { label: "Ready to start", sub: `${r.name} to ${destinationName}`, dot: "bg-muted", tone: "border-line bg-card/80" },
    active: j.deviated
      ? { label: "Off route", sub: `Check-in requested · ${r.name}`, dot: "bg-warn animate-pulse", tone: "border-warn/40 bg-[#2a2210]/90" }
      : { label: "Live Journey", sub: `You're on ${r.name}`, dot: "bg-ok animate-pulse", tone: "border-ok/40 bg-[#0f2a24]/90" },
    paused: { label: "Journey paused", sub: "Progress is on hold", dot: "bg-warn", tone: "border-warn/40 bg-[#2a2210]/90" },
    ended: { label: j.progress >= 1 ? "Arrived" : "Journey ended", sub: "Temporary sharing stopped", dot: "bg-azure", tone: "border-azure/40 bg-[#0f1d36]/90" },
  }[j.status];

  return (
    <div className="relative flex h-full flex-col">
      <ScreenHeader title="My Journey" onBack={back} right={<SimTag>Sim</SimTag>} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Status + map */}
          <motion.div layout className={`mb-2 flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${status.tone}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
            <div className="flex-1">
              <p className="text-[13px] font-bold">{status.label}</p>
              <p className="text-[11px] text-fg2">{status.sub}</p>
            </div>
            {(j.status === "active" || j.status === "paused") && (
              <div className="text-right">
                <p className="text-[13px] font-bold tabular-nums">{remaining} min</p>
                <p className="text-[10px] text-fg2">ETA {arrival}</p>
              </div>
            )}
          </motion.div>
        <div className="relative overflow-hidden rounded-2xl border border-line">
          <CityMap
            routes={[state.selectedRoute]}
            selected={state.selectedRoute}
            hazards={state.hazards.filter((h) => h.routeId === state.selectedRoute)}
            progress={j.status === "idle" ? null : j.progress}
            deviated={j.deviated}
            showLights
            drawKey={state.selectedRoute}
          />
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-muted">
            <span>Via Garibaldi</span>
            <span className="tabular-nums">{Math.round(j.progress * 100)}%</span>
            <span>{destinationName}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${r.color}, #C084FC)` }} animate={{ width: `${j.progress * 100}%` }} transition={{ ease: "linear", duration: 0.9 }} />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button
            size="sm"
            icon={Play}
            variant={j.status === "active" ? "ghost" : "primary"}
            disabled={j.status === "active"}
            onClick={() => dispatch({ type: "JOURNEY_START" })}
          >
            {j.status === "paused" ? "Resume" : "Start"}
          </Button>
          <Button size="sm" icon={Pause} variant="ghost" disabled={j.status !== "active"} onClick={() => dispatch({ type: "JOURNEY_PAUSE" })}>
            Pause
          </Button>
          <Button size="sm" icon={Square} variant="ghost" disabled={j.status === "idle" || j.status === "ended"} onClick={() => dispatch({ type: "JOURNEY_END" })}>
            End
          </Button>
        </div>

        {/* Sharing */}
        <div className="mt-3 rounded-2xl border border-line bg-card/70 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold">Temporary location sharing</p>
              <p className="text-[11px] text-muted">{j.sharing ? "Shared until journey ends" : "Not sharing"} · simulated</p>
            </div>
            <Toggle on={j.sharing} onChange={() => dispatch({ type: "TOGGLE_SHARING" })} label="Toggle location sharing" tone="ok" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-fg2">Sharing with ({TRUSTED_CONTACTS.length})</span>
            <div className="flex -space-x-2">
              {TRUSTED_CONTACTS.map((c) => (
                <span key={c.id} className={`rounded-full ring-2 ring-card transition-opacity ${j.sharing ? "" : "opacity-40"}`}>
                  <Avatar initials={c.initials} color={c.color} size={26} />
                </span>
              ))}
            </div>
            <span className="ml-auto text-[11px] text-muted">{TRUSTED_CONTACTS.map((c) => c.name).join(", ")}</span>
          </div>
        </div>

        {/* Safety + check-in */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-line bg-card/70 p-3">
            {j.deviated ? <ShieldAlert size={18} className="text-warn" /> : <ShieldCheck size={18} className="text-ok" />}
            <p className="mt-1.5 text-[12px] font-bold">{j.deviated ? "Off route" : "On supported route"}</p>
            <p className="text-[11px] text-muted">
              {r.name} · <span style={{ color: scoreColor(routeScore(r.id, state.hazards)) }}>{routeScore(r.id, state.hazards)}%</span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card/70 p-3">
            <Clock size={18} className="text-lav" />
            <p className="mt-1.5 text-[12px] font-bold">Auto check-in</p>
            <p className="text-[11px] text-muted tabular-nums">{j.status === "active" ? `Next in ${fmt(j.checkInSeconds)}` : "Starts with journey"}</p>
          </div>
        </div>

        {/* Simulations */}
        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-muted">Simulate journey events</p>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="soft" icon={Shuffle} onClick={() => dispatch({ type: "SIM_DEVIATION" })}>
            Route deviation
          </Button>
          <Button size="sm" variant="soft" icon={Hourglass} onClick={() => dispatch({ type: "SIM_STOP" })}>
            Unexpected stop
          </Button>
        </div>

        {/* Log */}
        {j.log.length > 0 && (
          <div className="mt-3 rounded-2xl border border-line bg-card/50 p-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Journey log</p>
            <ul className="space-y-1">
              {j.log.map((l, i) => (
                <motion.li key={`${l}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[11.5px] text-fg2">
                  <span className="h-1 w-1 rounded-full bg-lav" /> {l}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Check-in prompt */}
      <AnimatePresence>
        {j.alert && (
          <motion.div key="checkin" className="absolute inset-0 z-30 flex items-end bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="m-3 w-full rounded-3xl border border-line-strong bg-bg2/95 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-warn/15 text-warn">
                  {j.alert === "deviation" ? <RouteIcon size={20} /> : <Hourglass size={20} />}
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-bold">{j.alert === "deviation" ? "Quick check-in" : "Still there?"}</p>
                  <p className="text-[12px] text-fg2">
                    {j.alert === "deviation" ? `You seem to have left ${r.name}. Everything okay?` : "You’ve stopped unexpectedly for a while. Everything okay?"}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[10.5px] text-muted">Simulated event · if unanswered, a real version could notify your trusted contacts.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button icon={CircleCheck} onClick={() => dispatch({ type: "CHECKIN_OK" })}>
                  I&apos;m Okay
                </Button>
                {j.alert === "deviation" ? (
                  <Button variant="ghost" icon={RouteIcon} onClick={() => dispatch({ type: "REVIEW_ROUTE", open: true })}>
                    Review Route
                  </Button>
                ) : (
                  <Button variant="danger" icon={Siren} onClick={() => dispatch({ type: "SOS_REQUEST", source: "app" })}>
                    Get help
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {j.reviewing && (
          <motion.div key="review" className="absolute inset-0 z-30 flex items-end bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="w-full rounded-t-[28px] border-t border-line-strong bg-bg2 p-4 pb-8"
            >
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold">Review route from here</p>
                <button onClick={() => dispatch({ type: "CHECKIN_OK" })} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/5">
                  <X size={16} />
                </button>
              </div>
              <p className="text-[11px] text-muted">Alternatives from your current simulated position</p>
              <div className="mt-3 space-y-2">
                {ROUTES.map((rt) => {
                  const sc = routeScore(rt.id, state.hazards);
                  const cur = rt.id === state.selectedRoute;
                  return (
                    <button
                      key={rt.id}
                      onClick={() => dispatch({ type: "SWITCH_ROUTE", id: rt.id })}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left ${cur ? "border-lav/60 bg-brand/10" : "border-line bg-card/70 hover:border-line-strong"}`}
                    >
                      <span className="h-8 w-1.5 rounded-full" style={{ background: rt.color }} />
                      <span className="flex-1">
                        <span className="block text-[13px] font-bold">
                          {rt.name} {rt.id === rec && <span className="ml-1 text-[9px] font-bold uppercase text-lav">Recommended</span>}
                          {cur && <span className="ml-1 text-[9px] font-bold uppercase text-muted">Current</span>}
                        </span>
                        <span className="block text-[11px] text-fg2">
                          ~{Math.max(2, Math.round(rt.minutes * (1 - j.progress) + 2))} min ·{" "}
                          <span style={{ color: scoreColor(sc) }}>{sc}% support</span>
                        </span>
                      </span>
                      <ChevronRight size={16} className="text-muted" />
                    </button>
                  );
                })}
              </div>
              <Button full variant="ghost" className="mt-3" icon={MapPin} onClick={() => {
                  dispatch({ type: "REVIEW_ROUTE", open: false });
                  go("havens");
                }}>
                Show nearby Safe Havens
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
