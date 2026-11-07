"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Battery, BatteryLow, Bluetooth, BluetoothOff, ChevronDown, ChevronRight, Hand, Radio, Volume2, BatteryWarning, Pointer, Info } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import type { GestureAction } from "@/types";
import { CharmVisual } from "@/components/wearable/CharmVisual";
import { Button, ScreenHeader, SimTag, Toggle } from "@/components/ui/primitives";

const ACTIONS: { id: GestureAction; label: string }[] = [
  { id: "sos", label: "Send SOS" },
  { id: "checkin", label: "“I’m okay” check-in" },
  { id: "voice", label: "Repeat direction" },
  { id: "none", label: "No action" },
];
const ACTION_LABEL = Object.fromEntries(ACTIONS.map((a) => [a.id, a.label])) as Record<GestureAction, string>;
const HOLD_MS = 3000;

export function CharmScreen() {
  const { state, dispatch, go, back, toast, connectCharm } = useDemo();
  const c = state.charm;
  const [gestOpen, setGestOpen] = useState(false);
  const [hold, setHold] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const holdStart = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const lastTap = useRef(0);
  const singleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (singleTimer.current) clearTimeout(singleTimer.current);
    },
    [],
  );

  const perform = (action: GestureAction, gesture: string) => {
    setFlash(`${gesture} → ${ACTION_LABEL[action]}`);
    setTimeout(() => setFlash(null), 1800);
    if (action === "sos") dispatch({ type: "SOS_REQUEST", source: "charm" });
    else if (action === "checkin") {
      if (state.journey.alert) dispatch({ type: "CHECKIN_OK" });
      else toast("Check-in “I’m okay” sent to trusted contacts (simulated)", "success");
    } else if (action === "voice") toast("Voice: “In 200 m, turn right onto Corso Cavour” (simulated)", "info");
    else toast(`${gesture}: no action assigned`, "info");
  };

  const tick = () => {
    if (holdStart.current === null) return;
    const p = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS);
    setHold(p);
    if (p >= 1 && !fired.current) {
      fired.current = true;
      holdStart.current = null;
      setHold(0);
      perform(c.gestures.hold3s, "3-second hold");
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const onDown = () => {
    if (!c.connected) {
      toast("Charm is disconnected — connect it first", "warn");
      return;
    }
    fired.current = false;
    holdStart.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const onUp = () => {
    if (holdStart.current === null) return;
    const dur = performance.now() - holdStart.current;
    holdStart.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);
    setHold(0);
    if (fired.current || dur > 600) return;
    const now = performance.now();
    if (now - lastTap.current < 420) {
      lastTap.current = 0;
      if (singleTimer.current) clearTimeout(singleTimer.current);
      perform(c.gestures.doubleClick, "Double-click");
    } else {
      lastTap.current = now;
      singleTimer.current = setTimeout(() => setFlash("Single press · ignored to prevent accidental triggers"), 440);
      setTimeout(() => setFlash((f) => (f?.startsWith("Single") ? null : f)), 2200);
    }
  };

  const status = c.connecting ? "Connecting…" : c.connected ? "Connected" : "Disconnected";

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={BRAND.wearable} onBack={back} />
      <div className="phone-scroll flex-1 overflow-y-auto px-4 pb-6">
        {/* Device */}
        <div className="relative flex flex-col items-center">
          <button
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Press the charm: double-click or hold for 3 seconds"
            className="relative touch-none"
          >
            <motion.div animate={{ scale: hold > 0 ? 0.96 : 1 }}>
              <CharmVisual size={190} waves={c.connected} dim={!c.connected} waveColor={hold > 0 ? "#F43F5E" : "#A855F7"} />
            </motion.div>
            {hold > 0 && (
              <svg className="pointer-events-none absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="52" r="34" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - hold)} />
              </svg>
            )}
          </button>
          <AnimatePresence mode="wait">
            <motion.p
              key={flash ?? (hold > 0 ? "hold" : "hint")}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`-mt-2 flex h-5 items-center gap-1 text-[11px] font-semibold ${flash ? "text-lav" : hold > 0 ? "text-sos" : "text-muted"}`}
            >
              {flash ?? (hold > 0 ? `Keep holding… ${Math.ceil((1 - hold) * 3)}s` : (
                <>
                  <Pointer size={11} /> Tap the charm: double-click or hold 3s to test
                </>
              ))}
            </motion.p>
          </AnimatePresence>

          <motion.span
            layout
            className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold ${c.connected ? "border-ok/40 bg-ok/10 text-ok" : c.connecting ? "border-azure/40 bg-azure/10 text-azure" : "border-warn/40 bg-warn/10 text-warn"}`}
          >
            {c.connecting ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-azure border-t-transparent" /> : c.connected ? <Bluetooth size={13} /> : <BluetoothOff size={13} />}
            {status}
          </motion.span>
        </div>

        <Button
          full
          className="mt-3"
          variant={c.connected ? "ghost" : "primary"}
          icon={c.connected ? BluetoothOff : Bluetooth}
          disabled={c.connecting}
          onClick={() => (c.connected ? dispatch({ type: "CHARM_DISCONNECT" }) : connectCharm())}
        >
          {c.connected ? "Disconnect charm" : c.connecting ? "Pairing over BLE…" : "Connect charm"}
        </Button>

        {/* Settings list */}
        <div className="mt-3 divide-y divide-line/60 rounded-2xl border border-line bg-card/70">
          {/* Battery */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-3">
              {c.battery <= 15 ? <BatteryLow size={17} className="text-sos" /> : <Battery size={17} className="text-ok" />}
              <p className="flex-1 text-[13px]">Charm battery</p>
              <p className={`text-[13px] font-bold tabular-nums ${c.battery <= 15 ? "text-sos" : ""}`}>{c.battery}%</p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={c.battery}
              onChange={(e) => dispatch({ type: "CHARM_BATTERY", value: Number(e.target.value) })}
              aria-label="Simulated charm battery"
              className="mt-2 w-full accent-[#A855F7]"
            />
            <p className="text-[10px] text-muted">Drag to simulate battery level</p>
          </div>

          {/* BLE */}
          <div className="flex items-center gap-3 px-3 py-3">
            <Bluetooth size={17} className={c.connected ? "text-azure" : "text-muted"} />
            <div className="flex-1">
              <p className="text-[13px]">Bluetooth LE link</p>
              <p className="text-[10.5px] text-muted">{c.connected ? "Signal strong · simulated" : "No link"}</p>
            </div>
            <span className="flex items-end gap-[2px]">
              {[6, 9, 12, 15].map((h, i) => (
                <span key={h} className={`w-[3px] rounded-sm ${c.connected && i < 4 ? "bg-azure" : "bg-white/15"}`} style={{ height: h }} />
              ))}
            </span>
          </div>

          {/* Voice */}
          <div className="flex items-center gap-3 px-3 py-3">
            <Volume2 size={17} className="text-lav" />
            <div className="flex-1">
              <p className="text-[13px]">Voice navigation</p>
              <p className="text-[10.5px] text-muted">Turn prompts via your earphones</p>
            </div>
            <Toggle on={c.voiceNav} onChange={() => dispatch({ type: "TOGGLE_VOICE" })} label="Voice navigation" />
          </div>

          {/* Gestures */}
          <div className="px-3 py-3">
            <button onClick={() => setGestOpen((v) => !v)} className="flex w-full items-center gap-3 text-left">
              <Hand size={17} className="text-lav" />
              <div className="flex-1">
                <p className="text-[13px]">Gesture control</p>
                <p className="text-[10.5px] text-muted">
                  Double-click: {ACTION_LABEL[c.gestures.doubleClick]} · Hold 3s: {ACTION_LABEL[c.gestures.hold3s]}
                </p>
              </div>
              <ChevronDown size={16} className={`text-muted transition-transform ${gestOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {gestOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  {(["doubleClick", "hold3s"] as const).map((g) => (
                    <div key={g} className="mt-3">
                      <p className="mb-1.5 text-[11px] font-semibold text-fg2">{g === "doubleClick" ? "Double-click" : "3-second hold"}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {ACTIONS.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => dispatch({ type: "SET_GESTURE", gesture: g, action: a.id })}
                            className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors ${c.gestures[g] === a.id ? (a.id === "sos" ? "bg-sos text-white" : "bg-brand text-white") : "border border-line text-fg2 hover:text-fg"}`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="mt-2 text-[10px] text-muted">Single presses are ignored to reduce accidental triggers.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Beacon */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-3">
              <Radio size={17} className="text-aqua" />
              <div className="flex-1">
                <p className="text-[13px]">Emergency beacon</p>
                <p className="text-[10.5px] text-muted">{c.beacon ? "Enabled · concept feature" : "Disabled"}</p>
              </div>
              <Toggle on={c.beacon} onChange={() => dispatch({ type: "TOGGLE_BEACON" })} label="Emergency beacon" />
            </div>
            <p className="mt-2 flex gap-1.5 rounded-lg bg-white/[0.03] p-2 text-[10.5px] leading-relaxed text-muted">
              <Info size={12} className="mt-[1px] shrink-0 text-aqua" />
              Concept: alert nearby compatible devices. Future capability — not an independent communication system.
            </p>
          </div>

          {/* Low-power */}
          <button onClick={() => go("lowBattery")} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.02]">
            <BatteryWarning size={17} className="text-warn" />
            <div className="flex-1">
              <p className="text-[13px]">Low-battery companion mode</p>
              <p className="text-[10.5px] text-muted">{state.companionMode ? "On" : "Off"} · phone battery {state.phoneBattery}%</p>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>

        <Button full variant="danger" className="mt-3" icon={Hand} onClick={() => perform("sos", "Test trigger")} disabled={!c.connected}>
          Test emergency trigger
        </Button>
        <div className="mt-2 flex justify-center">
          <SimTag>No real Bluetooth hardware is accessed</SimTag>
        </div>
      </div>
    </div>
  );
}
