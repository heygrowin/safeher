"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpDown, ChevronRight, MapPin, Navigation, Search, Send, ShieldCheck, Siren, TriangleAlert, Users, Bluetooth, BluetoothOff, Check } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { CURRENT_LOCATION, DESTINATIONS } from "@/data/locations";
import { SAFE_HAVENS } from "@/data/safeHavens";
import { Button } from "@/components/ui/primitives";

export function HomeScreen() {
  const { state, dispatch, go, destinationName } = useDemo();
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState("");
  const dest = DESTINATIONS.find((d) => d.id === state.destinationId);
  const filtered = DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
  const j = state.journey;
  const journeyLabel =
    j.status === "active" ? `Live · ${Math.round(j.progress * 100)}% complete` : j.status === "paused" ? "Paused" : j.status === "ended" ? "Last journey ended" : "Live tracking";

  const findRoute = () => {
    if (!state.destinationId) dispatch({ type: "SET_DESTINATION", id: DESTINATIONS[0].id });
    else dispatch({ type: "ROUTES_READY", ready: false });
    go("routes");
  };

  const choose = (id: string) => {
    dispatch({ type: "SET_DESTINATION", id });
    setPicker(false);
    setQuery("");
  };

  const openHavens = SAFE_HAVENS.filter((h) => h.open).length;

  const tiles = [
    { title: "My Journey", sub: journeyLabel, icon: Send, color: "#C084FC", to: () => go("journey"), live: j.status === "active" },
    { title: "Safe Havens", sub: `${openHavens} open nearby`, icon: ShieldCheck, color: "#34D399", to: () => go("havens") },
    { title: "Travel Buddy", sub: "Walk together", icon: Users, color: "#60A5FA", to: () => go("buddy") },
    { title: "Report Hazard", sub: "Flag an issue", icon: TriangleAlert, color: "#FBBF24", to: () => go("hazard") },
  ];

  return (
    <div className="px-4 pb-6">
      {/* Greeting */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight">
            Hello, {BRAND.userName} <span className="inline-block origin-bottom-right animate-[wave_2s_ease-in-out_1]">👋</span>
          </h1>
          <p className="text-[13px] text-fg2">Plan your safer journey</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => dispatch({ type: "SOS_REQUEST", source: "app" })}
            className="flex h-9 items-center gap-1 rounded-full border border-sos/50 bg-sos/15 px-3 text-[12px] font-bold text-sos"
          >
            <Siren size={14} /> SOS
          </motion.button>
          <button onClick={() => go("profile")} aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lav to-vio text-[13px] font-bold">
            A
          </button>
        </div>
      </div>

      {/* Location + destination */}
      <div className="relative mt-4 rounded-2xl border border-line bg-card/80 p-1.5">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-azure/15 text-azure">
            <Navigation size={13} fill="currentColor" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Your location</p>
            <p className="truncate text-[13px] font-semibold">{CURRENT_LOCATION}</p>
          </div>
        </div>
        <div className="mx-3 h-px bg-line" />
        <button onClick={() => setPicker((v) => !v)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/[0.03]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#F472B6]/15 text-[#F472B6]">
            <MapPin size={14} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Destination</p>
            <p className={`truncate text-[13px] font-semibold ${dest ? "" : "text-fg2"}`}>{dest ? dest.name : "Where do you want to go?"}</p>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-line text-fg2">
            <ArrowUpDown size={14} />
          </span>
        </button>

        <AnimatePresence>
          {picker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2 pt-1">
                <label className="flex items-center gap-2 rounded-xl border border-line bg-bg2 px-3">
                  <Search size={14} className="text-muted" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search demo destinations in Messina"
                    className="h-10 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted"
                  />
                </label>
                <div className="mt-1.5 space-y-0.5">
                  {filtered.map((d) => (
                    <button key={d.id} onClick={() => choose(d.id)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-white/5">
                      <MapPin size={14} className="text-lav" />
                      <span className="flex-1">
                        <span className="block text-[13px] font-semibold">{d.name}</span>
                        <span className="block text-[11px] text-muted">{d.area}</span>
                      </span>
                      {d.id === state.destinationId && <Check size={14} className="text-ok" />}
                    </button>
                  ))}
                  {!filtered.length && <p className="px-3 py-2 text-[12px] text-muted">No demo destination matches “{query}”.</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button full size="lg" className="mt-3" iconRight={ArrowRight} onClick={findRoute}>
        Find Safer Route
      </Button>
      {!dest && <p className="mt-1.5 text-center text-[11px] text-muted">Tip: defaults to {destinationName} if none is chosen</p>}

      {/* Feature tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={t.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              onClick={t.to}
              className="relative flex flex-col items-center gap-2 rounded-2xl border border-line bg-gradient-to-b from-elev/80 to-card px-3 py-4 text-center"
            >
              {t.live && <span className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-ok" />}
              <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${t.color}1c`, color: t.color }}>
                <Icon size={21} strokeWidth={2.1} />
              </span>
              <span>
                <span className="block text-[13px] font-bold">{t.title}</span>
                <span className="block text-[11px] text-muted">{t.sub}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Charm status */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => go("charm")}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-card/80 p-3 text-left"
      >
        <img src="/images/charm-render.png" alt="" className="blend-edges h-12 w-12 object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold">{BRAND.wearable}</p>
          <p className={`flex items-center gap-1 text-[11px] font-semibold ${state.charm.connected ? "text-ok" : state.charm.connecting ? "text-azure" : "text-warn"}`}>
            {state.charm.connected ? <Bluetooth size={11} /> : <BluetoothOff size={11} />}
            {state.charm.connected ? `Connected · ${state.charm.battery}% battery` : state.charm.connecting ? "Connecting…" : "Disconnected"}
          </p>
        </div>
        <ChevronRight size={18} className="text-muted" />
      </motion.button>
    </div>
  );
}
