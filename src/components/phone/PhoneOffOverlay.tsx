"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BatteryCharging, Info, Radio, Smartphone, X } from "lucide-react";
import { useDemo } from "@/hooks/useDemoState";
import { BRAND } from "@/config/brand";
import { CharmVisual } from "@/components/wearable/CharmVisual";
import { Button } from "@/components/ui/primitives";

const DEVICES = [
  { x: -120, y: -90 },
  { x: 118, y: -70 },
  { x: -100, y: 95 },
  { x: 125, y: 105 },
];

/** Shown when the simulated phone battery reaches 0%. */
export function PhoneOffOverlay() {
  const { state, dispatch } = useDemo();
  const on = state.offlineBeacon;

  return (
    <motion.div className="absolute inset-0 z-[55] flex flex-col bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scaleY: 1 }} animate={{ scaleY: 0.004, opacity: [1, 1, 0] }} transition={{ duration: 0.45 }} className="pointer-events-none absolute inset-0 origin-center bg-white/80" />

      <div className="phone-scroll flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-[64px]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Simulated · phone battery 0%</p>
        <h3 className="mt-1 text-center text-[20px] font-extrabold">Phone unavailable</h3>

        {/* Beacon concept */}
        <div className="relative mx-auto mt-4 grid h-[230px] w-full place-items-center">
          {on &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute h-24 w-24 rounded-full border-2 border-aqua/70"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7 }}
              />
            ))}
          {on &&
            DEVICES.map((d, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.25 }}
                className="absolute grid h-8 w-8 place-items-center rounded-lg border border-aqua/50 bg-aqua/10 text-aqua"
                style={{ x: d.x, y: d.y }}
              >
                <Smartphone size={15} />
              </motion.span>
            ))}
          <button onClick={() => dispatch({ type: "OFFLINE_BEACON", on: !on })} aria-label="Press charm (concept)">
            <CharmVisual size={150} waves={false} waveColor={on ? "#22D3EE" : "#A855F7"} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {on ? (
            <motion.div key="on" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-aqua/40 bg-aqua/[0.07] p-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-aqua">
                <Radio size={15} /> Local beacon — future concept
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-fg2">
                Illustrates how a future charm could emit a short-range signal that <b>compatible nearby devices</b> running {BRAND.name} might pick up. It would carry no GPS or
                internet data, and is <b>not available</b> in this demo.
              </p>
              <Button size="sm" variant="ghost" full className="mt-2" icon={X} onClick={() => dispatch({ type: "OFFLINE_BEACON", on: false })}>
                Stop concept animation
              </Button>
            </motion.div>
          ) : (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-line bg-card/60 p-3">
              <p className="flex items-center gap-2 text-[13px] font-bold">
                <Info size={15} className="text-lav" /> What still works?
              </p>
              <Button size="sm" variant="soft" full className="mt-2" icon={Radio} onClick={() => dispatch({ type: "OFFLINE_BEACON", on: true })}>
                Show beacon concept (press charm)
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button full className="mt-4" icon={BatteryCharging} onClick={() => dispatch({ type: "PHONE_BATTERY", value: 100 })}>
          Restore phone to 100%
        </Button>
      </div>
    </motion.div>
  );
}
