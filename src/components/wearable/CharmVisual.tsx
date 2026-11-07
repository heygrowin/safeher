"use client";

import { motion } from "framer-motion";

/** Product render of the SafeNet Charm with optional BLE signal waves. */
export function CharmVisual({
  size = 180,
  waves = false,
  dim = false,
  float = true,
  waveColor = "#A855F7",
}: {
  size?: number;
  waves?: boolean;
  dim?: boolean;
  float?: boolean;
  waveColor?: string;
}) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full blur-2xl transition-opacity duration-500"
        style={{ inset: size * 0.18, background: `radial-gradient(circle, ${waveColor}88, transparent 70%)`, opacity: dim ? 0.15 : 0.9 }}
      />
      {waves &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border-2"
            style={{ width: size * 0.55, height: size * 0.55, borderColor: waveColor, top: "52%", left: "44%", x: "-50%", y: "-50%" }}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
      <motion.img
        src="/images/charm-render.png"
        alt="SafeNet Charm keychain"
        draggable={false}
        className="blend-edges relative w-full select-none"
        style={{ filter: dim ? "grayscale(0.7) brightness(0.6)" : "none", transition: "filter .5s" }}
        animate={float ? { y: [0, -6, 0], rotate: [0, -1.5, 0] } : undefined}
        transition={float ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
    </div>
  );
}
