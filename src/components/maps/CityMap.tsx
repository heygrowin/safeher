"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cross, Hospital, MapPin, Navigation, ShieldCheck, Shield, Store, Lightbulb } from "lucide-react";
import type { Hazard, Point, RouteId, SafeHaven } from "@/types";
import { ROUTES, START_POINT, END_POINT } from "@/data/routes";
import { FACILITIES } from "@/data/locations";
import { HAZARD_ICON } from "@/data/hazards";
import { MAP_H, MAP_W, pct, pointAt, samplePoints, sliceTo, toD } from "./geometry";

const FACILITY_STYLE = {
  shop: { icon: Store, color: "#C084FC" },
  pharmacy: { icon: Cross, color: "#34D399" },
  clinic: { icon: Hospital, color: "#F472B6" },
  police: { icon: Shield, color: "#60A5FA" },
  light: { icon: Lightbulb, color: "#FDE68A" },
} as const;

/* Static street network (illustrative, not real geography) */
const H_ROADS = [40, 78, 150, 230, 310, 360, 400, 440];
const V_ROADS = [24, 58, 88, 124, 160, 196, 230, 266, 304, 330];
const MAIN_H = [150, 230, 400];
const MAIN_V = [88, 230, 304];
const SEA = "M352 0 C 340 80, 372 140, 358 210 S 342 330, 366 400 S 372 440, 368 460 L 400 460 L 400 0 Z";

export interface CityMapProps {
  routes?: RouteId[];
  selected?: RouteId | null;
  onSelect?: (id: RouteId) => void;
  scores?: Partial<Record<RouteId, number>>;
  recommended?: RouteId | null;
  showFacilities?: boolean;
  showLights?: boolean;
  havens?: SafeHaven[];
  highlightHaven?: string | null;
  onHavenClick?: (id: string) => void;
  hazards?: Hazard[];
  highlightHazard?: string | null;
  progress?: number | null;
  deviated?: boolean;
  drawKey?: string | number;
  className?: string;
  dimUnselected?: boolean;
  showEnd?: boolean;
  markerScale?: number;
}

export function CityMap({
  routes = ["A", "B", "C"],
  selected = null,
  onSelect,
  scores,
  recommended = null,
  showFacilities = false,
  showLights = false,
  havens = [],
  highlightHaven = null,
  onHavenClick,
  hazards = [],
  highlightHazard = null,
  progress = null,
  deviated = false,
  drawKey = 0,
  className = "",
  dimUnselected = true,
  showEnd = true,
  markerScale = 1,
}: CityMapProps) {
  const shown = ROUTES.filter((r) => routes.includes(r.id));
  // Selected route drawn last so it sits on top
  const ordered = [...shown].sort((a, b) => (a.id === selected ? 1 : 0) - (b.id === selected ? 1 : 0));
  const sel = shown.find((r) => r.id === selected) ?? null;

  const you = sel && progress !== null ? pointAt(sel.path, progress) : null;
  const youPoint: Point | null = you ? (deviated ? [you.p[0] - 30, you.p[1] + 8] : you.p) : null;
  const ms = markerScale;

  return (
    <div className={`relative w-full select-none overflow-hidden ${className}`} style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="sea" x1="0" x2="1">
            <stop offset="0" stopColor="#0E1F3F" />
            <stop offset="1" stopColor="#0A1630" />
          </linearGradient>
          <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.6" stopColor="#090B1B" stopOpacity="0" />
            <stop offset="1" stopColor="#090B1B" stopOpacity="0.7" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="lampglow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Land */}
        <rect width={MAP_W} height={MAP_H} fill="#12142E" />
        {/* Park areas */}
        <rect x="128" y="88" width="62" height="52" rx="8" fill="#16302C" opacity="0.55" />
        <rect x="30" y="410" width="48" height="26" rx="6" fill="#16302C" opacity="0.45" />

        {/* Minor streets */}
        {H_ROADS.map((y) => (
          <line key={`h${y}`} x1="0" x2={MAP_W} y1={y} y2={y} stroke="#1D2044" strokeWidth={MAIN_H.includes(y) ? 9 : 4} />
        ))}
        {V_ROADS.map((x) => (
          <line key={`v${x}`} y1="0" y2={MAP_H} x1={x} x2={x} stroke="#1D2044" strokeWidth={MAIN_V.includes(x) ? 9 : 4} />
        ))}
        {/* Diagonal avenue + coastal road */}
        <path d="M60 436 L160 310 L230 190 L320 52 L340 20" stroke="#21244B" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M230 400 L330 310 L330 150 L304 78 L296 0" stroke="#21244B" strokeWidth="7" fill="none" strokeLinejoin="round" />
        {/* Road centre highlights */}
        {MAIN_H.map((y) => (
          <line key={`mh${y}`} x1="0" x2={MAP_W} y1={y} y2={y} stroke="#2A2D58" strokeWidth="1" strokeDasharray="6 8" />
        ))}

        {/* Sea */}
        <path d={SEA} fill="url(#sea)" />
        {[60, 140, 220, 300, 380].map((y) => (
          <path key={y} d={`M372 ${y} q 6 -4 12 0 t 12 0`} stroke="#22D3EE" strokeOpacity="0.12" fill="none" />
        ))}
        <text x="386" y="250" fill="#60A5FA" fillOpacity="0.35" fontSize="9" fontWeight="600" letterSpacing="2" transform="rotate(90 386 250)" textAnchor="middle">
          STRETTO DI MESSINA
        </text>
        <text x="80" y="330" fill="#8585A8" fillOpacity="0.55" fontSize="7.5" fontWeight="600" transform="rotate(-90 80 330)" textAnchor="middle">
          Via Garibaldi
        </text>
        <text x="190" y="225" fill="#8585A8" fillOpacity="0.5" fontSize="7.5" fontWeight="600" textAnchor="middle">
          Corso Cavour
        </text>

        {/* Street lighting glows */}
        {showLights &&
          shown.map((r) => {
            const every = r.indicators.lighting === "Good" ? 26 : r.indicators.lighting === "Moderate" ? 46 : 90;
            return samplePoints(r.path, every).map((p, i) => (
              <circle key={`${r.id}-l${i}`} cx={p[0]} cy={p[1]} r="5" fill="#FDE68A" opacity="0.35" filter="url(#lampglow)" />
            ));
          })}

        {/* Routes */}
        {ordered.map((r) => {
          const isSel = r.id === selected;
          const faded = dimUnselected && selected !== null && !isSel;
          const d = toD(r.path);
          return (
            <g key={`${r.id}-${drawKey}`} opacity={faded ? 0.38 : 1} style={{ transition: "opacity .35s" }}>
              <motion.path
                d={d}
                stroke={r.color}
                strokeWidth={isSel ? 14 : 9}
                strokeOpacity={0.22}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: ROUTES.indexOf(r) * 0.15 }}
              />
              <motion.path
                d={d}
                stroke={r.color}
                strokeWidth={isSel ? 5 : 3.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: ROUTES.indexOf(r) * 0.15 }}
              />
              {onSelect && (
                <path
                  d={d}
                  stroke="transparent"
                  strokeWidth="22"
                  fill="none"
                  style={{ cursor: "pointer", pointerEvents: "stroke" }}
                  onClick={() => onSelect(r.id)}
                />
              )}
            </g>
          );
        })}

        {/* Travelled portion */}
        {sel && progress !== null && progress > 0 && (
          <path d={toD(sliceTo(sel.path, progress))} stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
        )}
        {/* Deviation connector */}
        {you && youPoint && deviated && (
          <motion.path
            d={`M${you.p[0]} ${you.p[1]} L${youPoint[0]} ${youPoint[1]}`}
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}

        <rect width={MAP_W} height={MAP_H} fill="url(#vignette)" pointerEvents="none" />
      </svg>

      {/* Facilities */}
      {showFacilities &&
        FACILITIES.map((f, i) => {
          const st = FACILITY_STYLE[f.kind];
          const Icon = st.icon;
          return (
            <motion.span
              key={f.id}
              title={f.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: ms, opacity: 1 }}
              transition={{ delay: 0.6 + (i % 5) * 0.08, type: "spring", stiffness: 400, damping: 22 }}
              className="absolute grid h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border"
              style={{ ...pct(f.at), background: "#0E1029", borderColor: `${st.color}88`, color: st.color }}
            >
              <Icon size={10} strokeWidth={2.6} />
            </motion.span>
          );
        })}

      {/* Safe Havens */}
      {havens.map((h) => {
        const hl = highlightHaven === h.id;
        return (
          <motion.button
            key={h.id}
            onClick={onHavenClick ? () => onHavenClick(h.id) : undefined}
            tabIndex={onHavenClick ? 0 : -1}
            aria-label={`Safe Haven: ${h.name}`}
            initial={{ scale: 0 }}
            animate={{ scale: (hl ? 1.25 : 1) * ms }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.5 }}
            className={`absolute z-10 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border-2 ${onHavenClick ? "cursor-pointer" : "cursor-default"}`}
            style={{
              ...pct(h.at),
              background: hl ? "#34D399" : "#0E2A26",
              borderColor: "#34D399",
              color: hl ? "#062A1F" : "#34D399",
              boxShadow: hl ? "0 0 0 6px rgba(52,211,153,0.2), 0 0 18px rgba(52,211,153,0.6)" : "0 0 10px rgba(52,211,153,0.35)",
            }}
          >
            <ShieldCheck size={13} strokeWidth={2.5} />
          </motion.button>
        );
      })}

      {/* Hazards */}
      <AnimatePresence>
        {hazards.map((h) => {
          const Icon = HAZARD_ICON[h.category];
          const hl = highlightHazard === h.id || h.userSubmitted;
          return (
            <motion.span
              key={h.id}
              title={h.locationLabel}
              initial={{ scale: 0, y: -14 }}
              animate={{ scale: ms, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.3 }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={pct(h.at)}
            >
              {hl && <span className="absolute inset-[-6px] animate-ping rounded-full bg-warn/30" />}
              <span className="relative grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-warn bg-[#2A2110] text-warn shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                <Icon size={11} strokeWidth={2.6} />
              </span>
            </motion.span>
          );
        })}
      </AnimatePresence>

      {/* Destination */}
      {showEnd && (
        <motion.span
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 16 }}
          className="absolute z-20 -translate-x-1/2 -translate-y-full"
          style={pct(END_POINT)}
        >
          <MapPin size={30 * ms} fill="#F472B6" stroke="#fff" strokeWidth={1.6} className="drop-shadow-[0_4px_10px_rgba(244,114,182,0.6)]" />
        </motion.span>
      )}

      {/* Start / you */}
      {!youPoint && (
        <span className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={pct(START_POINT)}>
          <span className="absolute inset-[-8px] animate-ping rounded-full bg-azure/25" />
          <span
            className="relative grid place-items-center rounded-full border-[3px] border-white bg-azure text-white shadow-[0_0_18px_rgba(96,165,250,0.8)]"
            style={{ width: 26 * ms, height: 26 * ms }}
          >
            <Navigation size={12 * ms} fill="#fff" strokeWidth={0} />
          </span>
        </span>
      )}
      {youPoint && (
        <>
          <span className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-azure" style={pct(START_POINT)} />
          <motion.span
            className="absolute z-30"
            initial={false}
            animate={{ left: pct(youPoint).left, top: pct(youPoint).top }}
            transition={{ duration: 0.9, ease: "linear" }}
            style={{ x: "-50%", y: "-50%" }}
          >
            <span className={`absolute inset-[-9px] animate-ping rounded-full ${deviated ? "bg-warn/30" : "bg-azure/30"}`} />
            <span
              className={`relative grid h-[26px] w-[26px] place-items-center rounded-full border-[3px] border-white text-white ${deviated ? "bg-warn shadow-[0_0_18px_rgba(251,191,36,0.8)]" : "bg-azure shadow-[0_0_18px_rgba(96,165,250,0.8)]"}`}
            >
              <Navigation size={12} fill="#fff" strokeWidth={0} style={{ transform: `rotate(${(you?.angle ?? -90) + 45}deg)` }} />
            </span>
          </motion.span>
        </>
      )}

      {/* Score chips */}
      {scores &&
        shown.map((r) => {
          const v = scores[r.id];
          if (v === undefined) return null;
          const isSel = r.id === selected;
          return (
            <motion.button
              key={`chip-${r.id}`}
              onClick={onSelect ? () => onSelect(r.id) : undefined}
              tabIndex={onSelect ? 0 : -1}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: isSel ? 1.08 * ms : ms }}
              transition={{ delay: 1 + ROUTES.indexOf(r) * 0.12, type: "spring", stiffness: 380, damping: 20 }}
              className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-[3px] text-[11px] font-bold ${onSelect ? "cursor-pointer" : "cursor-default"}`}
              style={{
                ...pct(r.labelAt),
                background: isSel ? r.color : "#0E1029E6",
                borderColor: r.color,
                color: isSel ? "#0B0B1E" : r.color,
                boxShadow: isSel ? `0 0 16px ${r.color}99` : "none",
              }}
            >
              {r.id} <span className={isSel ? "" : "text-white"}>{v}%</span>
              {recommended === r.id && <span className="ml-0.5 text-[9px]">★</span>}
            </motion.button>
          );
        })}
    </div>
  );
}

export function MapLegend({ compact = false }: { compact?: boolean }) {
  const items = [
    { label: "Open shops", ...FACILITY_STYLE.shop },
    { label: "Pharmacies", ...FACILITY_STYLE.pharmacy },
    { label: "Hospitals / clinics", ...FACILITY_STYLE.clinic },
    { label: "Police", ...FACILITY_STYLE.police },
    { label: "Street lighting", ...FACILITY_STYLE.light },
    { label: "Safe Havens", icon: ShieldCheck, color: "#34D399" },
    { label: "Reported hazards", icon: HAZARD_ICON.other, color: "#FBBF24" },
  ];
  return (
    <div className={`flex flex-wrap ${compact ? "gap-x-3 gap-y-1.5" : "gap-x-4 gap-y-2"}`}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <span key={it.label} className={`inline-flex items-center gap-1.5 ${compact ? "text-[10px]" : "text-xs"} text-fg2`}>
            <span className="grid h-4 w-4 place-items-center rounded-full border" style={{ borderColor: `${it.color}88`, color: it.color }}>
              <Icon size={9} strokeWidth={2.6} />
            </span>
            {it.label}
          </span>
        );
      })}
    </div>
  );
}
