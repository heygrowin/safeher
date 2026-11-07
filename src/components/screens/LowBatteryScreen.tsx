"use client";

import { motion } from "framer-motion";
import { BatteryFull, BatteryLow, BatteryWarning, Check, Info, KeyRound, Power, X } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { Button, ScreenHeader, SimTag, Toggle } from "@/components/ui/primitives";

export const BATTERY_LEVELS = [100, 5, 2, 0];

export function LowBatteryScreen() {
  const { state, dispatch, back } = useDemo();
  const b = state.phoneBattery;
  const low = b <= 5;
  const critical = b <= 2;
  const color = critical ? "#F43F5E" : low ? "#FBBF24" : "#34D399";

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="Battery Saver" onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Gauge */}
        <div className="flex flex-col items-center rounded-3xl border border-line bg-card/70 py-5" style={{ background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 70%)` }}>
          <div className="relative h-[86px] w-[150px] rounded-2xl border-[3px] p-1.5" style={{ borderColor: color }}>
            <motion.div className="h-full rounded-lg" style={{ background: color }} initial={false} animate={{ width: `${Math.max(3, b)}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
            <span className="absolute -right-[9px] top-1/2 h-7 w-[6px] -translate-y-1/2 rounded-r-md" style={{ background: color }} />
            {low && <motion.span className="absolute inset-0 rounded-xl" animate={{ opacity: [0, 0.25, 0] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ background: color }} />}
          </div>
          <p className="mt-3 text-[34px] font-extrabold tabular-nums" style={{ color }}>
            {b}%
          </p>
          <p className="text-[12px] text-fg2">{critical ? "Critical — phone may shut down soon" : low ? "Low battery" : "Battery healthy"}</p>
          <SimTag className="mt-2">Simulated phone battery</SimTag>
        </div>

        {/* Quick set */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[100, 5, 2, 0].map((v) => (
            <button
              key={v}
              onClick={() => dispatch({ type: "PHONE_BATTERY", value: v })}
              className={`rounded-xl py-2 text-[12px] font-bold transition-colors ${b === v ? "bg-brand text-white" : "border border-line bg-card/70 text-fg2 hover:text-fg"}`}
            >
              {v}%
            </button>
          ))}
        </div>

        {low ? (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex gap-3 rounded-2xl border border-warn/40 bg-warn/[0.08] p-3">
              <BatteryWarning size={20} className="shrink-0 text-warn" />
              <div>
                <p className="text-[13px] font-bold">Low battery warning</p>
                <p className="text-[11.5px] leading-relaxed text-fg2">Your phone may turn off during this journey. Consider switching your charm to companion mode now.</p>
              </div>
            </motion.div>

            <div className={`mt-2 rounded-2xl border p-3 ${state.companionMode ? "border-lav/50 bg-brand/10" : "border-line bg-card/70"}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/20 text-lav">
                  <KeyRound size={17} />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-bold">Charm low-power companion mode</p>
                  <p className="text-[10.5px] text-muted">{state.charm.connected ? `${BRAND.wearable} · ${state.charm.battery}%` : "Charm disconnected"}</p>
                </div>
                <Toggle on={state.companionMode} onChange={() => dispatch({ type: "TOGGLE_COMPANION" })} label="Companion mode" />
              </div>
              <ul className="mt-3 space-y-1.5 text-[11.5px] text-fg2">
                <li className="flex gap-2">
                  <Check size={13} className="mt-[2px] shrink-0 text-ok" /> Previously delivered turn instructions may remain available locally on supported hardware.
                </li>
                <li className="flex gap-2">
                  <Check size={13} className="mt-[2px] shrink-0 text-ok" /> Phone map animations and background refresh are reduced.
                </li>
                <li className="flex gap-2">
                  <X size={13} className="mt-[2px] shrink-0 text-sos" /> The charm cannot send GPS or internet alerts on its own.
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="mt-3 flex gap-3 rounded-2xl border border-line bg-card/70 p-3">
            <BatteryFull size={20} className="shrink-0 text-ok" />
            <p className="text-[11.5px] leading-relaxed text-fg2">
              Battery is fine. Use the buttons above (or the demo controls) to simulate 5%, 2% or 0% and see how {BRAND.name} responds.
            </p>
          </div>
        )}

        <div className="mt-3 flex gap-2 rounded-xl bg-white/[0.03] p-3 text-[11px] leading-relaxed text-muted">
          <Info size={14} className="mt-[1px] shrink-0 text-lav" />
          <p>
            A BLE-only charm depends on the phone for location and connectivity. When the phone is off, nothing can be relayed through it.
          </p>
        </div>

        {critical && (
          <Button full variant="ghost" className="mt-3" icon={Power} onClick={() => dispatch({ type: "PHONE_BATTERY", value: 0 })}>
            Simulate phone shutdown (0%)
          </Button>
        )}
        {low && !critical && (
          <Button full variant="ghost" className="mt-3" icon={BatteryLow} onClick={() => dispatch({ type: "PHONE_BATTERY", value: 2 })}>
            Drain to 2%
          </Button>
        )}
      </div>
    </div>
  );
}
