"use client";

import { Bluetooth, BluetoothOff, Hourglass, KeyRound, RotateCcw, Shuffle, TriangleAlert, SlidersHorizontal } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { HAZARD_SPOTS } from "@/data/hazards";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted">{title}</p>
      {children}
    </div>
  );
}

function Ctl({ icon: Icon, label, onClick, tone = "default", active = false }: { icon: typeof Shuffle; label: string; onClick: () => void; tone?: "default" | "sos"; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-[12.5px] font-semibold transition-all active:scale-[0.98] ${
        tone === "sos"
          ? "border-sos/40 bg-sos/10 text-[#fda4af] hover:bg-sos/20"
          : active
            ? "border-lav/60 bg-brand/15 text-fg"
            : "border-line bg-white/[0.03] text-fg2 hover:border-line-strong hover:text-fg"
      }`}
    >
      <Icon size={15} className="shrink-0" />
      {label}
    </button>
  );
}

export function DemoControls({ onAction }: { onAction?: () => void }) {
  const { state, dispatch, connectCharm } = useDemo();
  const act = (fn: () => void) => () => {
    fn();
    onAction?.();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-lav" />
        <p className="text-[13px] font-bold">Demo controls</p>
        <span className="ml-auto rounded-full bg-white/5 px-2 py-[2px] text-[10px] text-muted">for judges</span>
      </div>

      <Section title="Phone battery">
        <div className="grid grid-cols-4 gap-1.5">
          {[100, 5, 2, 0].map((v) => (
            <button
              key={v}
              onClick={act(() => dispatch({ type: "PHONE_BATTERY", value: v }))}
              className={`rounded-lg py-1.5 text-[12px] font-bold transition-colors ${
                state.phoneBattery === v ? (v <= 5 ? "bg-sos text-white" : "bg-brand text-white") : "border border-line text-fg2 hover:text-fg"
              }`}
            >
              {v}%
            </button>
          ))}
        </div>
      </Section>

      <Section title="Wearable">
        <Ctl
          icon={state.charm.connected ? BluetoothOff : Bluetooth}
          label={state.charm.connected ? "Disconnect charm" : state.charm.connecting ? "Connecting…" : "Connect charm"}
          active={state.charm.connected}
          onClick={act(() => (state.charm.connected ? dispatch({ type: "CHARM_DISCONNECT" }) : connectCharm()))}
        />
      </Section>

      <Section title="Journey events">
        <div className="space-y-1.5">
          <Ctl icon={Shuffle} label="Trigger route deviation" onClick={act(() => dispatch({ type: "SIM_DEVIATION" }))} />
          <Ctl icon={Hourglass} label="Trigger unexpected stop" onClick={act(() => dispatch({ type: "SIM_STOP" }))} />
          <Ctl
            icon={TriangleAlert}
            label="Simulate hazard report"
            onClick={act(() => {
              dispatch({ type: "ADD_HAZARD", category: "streetlight", details: "Streetlight out at the corner (demo control)", spotId: HAZARD_SPOTS[0].id, hasPhoto: false });
              dispatch({ type: "NAV", screen: "hazard" });
            })}
          />
        </div>
      </Section>

      <Section title="Emergency">
        <Ctl icon={KeyRound} label="Trigger charm SOS" tone="sos" onClick={act(() => dispatch({ type: "SOS_REQUEST", source: "charm" }))} />
      </Section>

      <button
        onClick={act(() => dispatch({ type: "RESET" }))}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.02] py-2.5 text-[12.5px] font-semibold text-fg2 hover:text-fg"
      >
        <RotateCcw size={14} /> Reset demo
      </button>
    </div>
  );
}
