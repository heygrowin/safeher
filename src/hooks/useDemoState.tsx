"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import type {
  BuddyState,
  CharmState,
  GestureAction,
  Hazard,
  HazardCategory,
  JourneyState,
  RouteId,
  ScreenId,
  SosState,
  Toast,
} from "@/types";
import { SEED_HAZARDS, HAZARD_SPOTS } from "@/data/hazards";
import { ROUTES, HAZARD_IMPACT } from "@/data/routes";
import { DESTINATIONS } from "@/data/locations";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export const CHECK_IN_INTERVAL = 600; // seconds (10 min)
const JOURNEY_DURATION_TICKS = 120; // a simulated journey completes in ~2 minutes

export interface DemoState {
  screen: ScreenId;
  history: ScreenId[];
  destinationId: string | null;
  routesReady: boolean;
  selectedRoute: RouteId;
  journey: JourneyState;
  hazards: Hazard[];
  hazardView: "form" | "success";
  lastHazardId: string | null;
  charm: CharmState;
  phoneBattery: number;
  companionMode: boolean;
  offlineBeacon: boolean;
  sos: SosState;
  buddy: BuddyState;
  focusHaven: string | null;
  toasts: Toast[];
}

const initialJourney: JourneyState = {
  status: "idle",
  progress: 0,
  sharing: true,
  checkInSeconds: CHECK_IN_INTERVAL,
  alert: null,
  deviated: false,
  reviewing: false,
  log: [],
};

export const initialState: DemoState = {
  screen: "onboarding",
  history: [],
  destinationId: null,
  routesReady: false,
  selectedRoute: "B",
  journey: initialJourney,
  hazards: SEED_HAZARDS,
  hazardView: "form",
  lastHazardId: null,
  charm: {
    connected: true,
    connecting: false,
    battery: 87,
    voiceNav: true,
    beacon: true,
    gestures: { doubleClick: "checkin", hold3s: "sos" },
  },
  phoneBattery: 100,
  companionMode: false,
  offlineBeacon: false,
  sos: { stage: "idle", source: "app", step: 0 },
  buddy: { selectedId: null, request: "none", virtualCheckIn: false },
  focusHaven: null,
  toasts: [],
};

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

type Action =
  | { type: "NAV"; screen: ScreenId }
  | { type: "BACK" }
  | { type: "SET_DESTINATION"; id: string }
  | { type: "ROUTES_READY"; ready: boolean }
  | { type: "SELECT_ROUTE"; id: RouteId }
  | { type: "JOURNEY_START"; fresh?: boolean }
  | { type: "JOURNEY_PAUSE" }
  | { type: "JOURNEY_END" }
  | { type: "JOURNEY_TICK" }
  | { type: "TOGGLE_SHARING" }
  | { type: "SIM_DEVIATION" }
  | { type: "SIM_STOP" }
  | { type: "CHECKIN_OK" }
  | { type: "REVIEW_ROUTE"; open: boolean }
  | { type: "SWITCH_ROUTE"; id: RouteId }
  | { type: "ADD_HAZARD"; category: HazardCategory; details: string; spotId: string; hasPhoto: boolean }
  | { type: "HAZARD_VIEW"; view: "form" | "success" }
  | { type: "CHARM_CONNECT_START" }
  | { type: "CHARM_CONNECTED" }
  | { type: "CHARM_DISCONNECT" }
  | { type: "CHARM_BATTERY"; value: number }
  | { type: "TOGGLE_VOICE" }
  | { type: "TOGGLE_BEACON" }
  | { type: "SET_GESTURE"; gesture: "doubleClick" | "hold3s"; action: GestureAction }
  | { type: "PHONE_BATTERY"; value: number }
  | { type: "TOGGLE_COMPANION" }
  | { type: "OFFLINE_BEACON"; on: boolean }
  | { type: "SOS_REQUEST"; source: "app" | "charm" }
  | { type: "SOS_CONFIRM" }
  | { type: "SOS_STEP" }
  | { type: "SOS_CANCEL" }
  | { type: "BUDDY_SELECT"; id: string | null }
  | { type: "BUDDY_REQUEST" }
  | { type: "BUDDY_CONFIRMED" }
  | { type: "BUDDY_CANCEL" }
  | { type: "BUDDY_VIRTUAL" }
  | { type: "FOCUS_HAVEN"; id: string | null }
  | { type: "TOAST"; text: string; tone?: Toast["tone"] }
  | { type: "DISMISS_TOAST"; id: number }
  | { type: "RESET" };

let toastSeq = 1;
const withToast = (s: DemoState, text: string, tone: Toast["tone"] = "info"): DemoState => ({
  ...s,
  toasts: [...s.toasts.slice(-1), { id: toastSeq++, text, tone }],
});

const nav = (s: DemoState, screen: ScreenId): DemoState =>
  s.screen === screen ? s : { ...s, screen, history: [...s.history, s.screen].slice(-20) };

const logLine = (j: JourneyState, line: string): JourneyState => ({ ...j, log: [line, ...j.log].slice(0, 6) });

function reducer(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "NAV":
      return nav(s, a.screen);
    case "BACK": {
      if (!s.history.length) return { ...s, screen: "home" };
      const history = [...s.history];
      const screen = history.pop()!;
      return { ...s, screen, history };
    }
    case "SET_DESTINATION":
      return { ...s, destinationId: a.id, routesReady: false };
    case "ROUTES_READY":
      return { ...s, routesReady: a.ready };
    case "SELECT_ROUTE":
      return { ...s, selectedRoute: a.id };

    /* Journey ------------------------------------------------------- */
    case "JOURNEY_START": {
      const fresh = a.fresh || s.journey.status === "ended" || s.journey.status === "idle";
      const j: JourneyState = fresh
        ? { ...initialJourney, sharing: s.journey.sharing, status: "active", log: [] }
        : { ...s.journey, status: "active" };
      return withToast(
        { ...s, journey: logLine(j, fresh ? "Journey started (simulated)" : "Journey resumed") },
        fresh ? "Journey started — progress is simulated" : "Journey resumed",
        "success",
      );
    }
    case "JOURNEY_PAUSE":
      return { ...s, journey: logLine({ ...s.journey, status: "paused" }, "Journey paused") };
    case "JOURNEY_END":
      return withToast(
        {
          ...s,
          journey: logLine({ ...s.journey, status: "ended", alert: null, deviated: false, reviewing: false }, "Journey ended · sharing stopped"),
        },
        "Journey ended — temporary sharing stopped",
        "info",
      );
    case "JOURNEY_TICK": {
      const j = s.journey;
      if (j.status !== "active" || j.alert) return s;
      const progress = Math.min(1, j.progress + 1 / JOURNEY_DURATION_TICKS);
      const checkInSeconds = j.checkInSeconds <= 1 ? CHECK_IN_INTERVAL : j.checkInSeconds - 1;
      if (progress >= 1) {
        return withToast(
          { ...s, journey: logLine({ ...j, progress: 1, status: "ended" }, "Arrived at destination") },
          "Arrived — journey sharing ended automatically (simulated)",
          "success",
        );
      }
      return { ...s, journey: { ...j, progress, checkInSeconds } };
    }
    case "TOGGLE_SHARING": {
      const sharing = !s.journey.sharing;
      return withToast(
        { ...s, journey: logLine({ ...s.journey, sharing }, sharing ? "Temporary sharing on" : "Temporary sharing off") },
        sharing ? "Temporary location sharing on (simulated)" : "Location sharing paused",
        "info",
      );
    }
    case "SIM_DEVIATION": {
      const base = s.journey.status === "active" ? s.journey : { ...s.journey, status: "active" as const, progress: Math.max(s.journey.progress, 0.35) };
      return nav({ ...s, journey: logLine({ ...base, alert: "deviation", deviated: true }, "Route deviation detected (simulated)") }, "journey");
    }
    case "SIM_STOP": {
      const base = s.journey.status === "active" ? s.journey : { ...s.journey, status: "active" as const, progress: Math.max(s.journey.progress, 0.35) };
      return nav({ ...s, journey: logLine({ ...base, alert: "stop" }, "Unexpected stop detected (simulated)") }, "journey");
    }
    case "CHECKIN_OK":
      return withToast(
        {
          ...s,
          journey: logLine({ ...s.journey, alert: null, deviated: false, reviewing: false, checkInSeconds: CHECK_IN_INTERVAL }, "Check-in: “I’m okay”"),
        },
        "Check-in confirmed — contacts see “All good” (simulated)",
        "success",
      );
    case "REVIEW_ROUTE":
      return { ...s, journey: { ...s.journey, reviewing: a.open, alert: a.open ? null : s.journey.alert } };
    case "SWITCH_ROUTE":
      return withToast(
        {
          ...s,
          selectedRoute: a.id,
          journey: logLine({ ...s.journey, reviewing: false, alert: null, deviated: false }, `Switched to Route ${a.id}`),
        },
        `Now following Route ${a.id}`,
        "success",
      );

    /* Hazards ------------------------------------------------------- */
    case "ADD_HAZARD": {
      const spot = HAZARD_SPOTS.find((p) => p.id === a.spotId) ?? HAZARD_SPOTS[0];
      const count = s.hazards.filter((h) => h.userSubmitted).length;
      const jitter = count * 10;
      const h: Hazard = {
        id: `h-user-${Date.now()}`,
        category: a.category,
        details: a.details.trim(),
        at: [spot.at[0] + (spot.routeId === "B" ? 0 : -jitter * 0.3), spot.at[1] - jitter],
        routeId: spot.routeId,
        locationLabel: spot.label,
        hasPhoto: a.hasPhoto,
        createdLabel: "Just now",
        userSubmitted: true,
      };
      return { ...s, hazards: [...s.hazards, h], hazardView: "success", lastHazardId: h.id };
    }
    case "HAZARD_VIEW":
      return { ...s, hazardView: a.view };

    /* Charm --------------------------------------------------------- */
    case "CHARM_CONNECT_START":
      return { ...s, charm: { ...s.charm, connecting: true } };
    case "CHARM_CONNECTED":
      return withToast({ ...s, charm: { ...s.charm, connecting: false, connected: true } }, "SafeNet Charm connected (simulated BLE)", "success");
    case "CHARM_DISCONNECT":
      return withToast({ ...s, charm: { ...s.charm, connecting: false, connected: false } }, "SafeNet Charm disconnected", "warn");
    case "CHARM_BATTERY":
      return { ...s, charm: { ...s.charm, battery: Math.max(0, Math.min(100, a.value)) } };
    case "TOGGLE_VOICE":
      return { ...s, charm: { ...s.charm, voiceNav: !s.charm.voiceNav } };
    case "TOGGLE_BEACON":
      return { ...s, charm: { ...s.charm, beacon: !s.charm.beacon } };
    case "SET_GESTURE":
      return { ...s, charm: { ...s.charm, gestures: { ...s.charm.gestures, [a.gesture]: a.action } } };

    /* Phone battery ------------------------------------------------- */
    case "PHONE_BATTERY": {
      const next = { ...s, phoneBattery: a.value, offlineBeacon: false };
      if (a.value === 100) return withToast({ ...next, companionMode: false }, "Phone battery restored to 100%", "success");
      if (a.value === 0) return next;
      return nav(next, "lowBattery");
    }
    case "TOGGLE_COMPANION":
      return withToast(
        { ...s, companionMode: !s.companionMode },
        s.companionMode ? "Charm companion mode off" : "Charm low-power companion mode on (simulated)",
        "info",
      );
    case "OFFLINE_BEACON":
      return { ...s, offlineBeacon: a.on };

    /* SOS ----------------------------------------------------------- */
    case "SOS_REQUEST": {
      if (s.phoneBattery === 0) return { ...s, offlineBeacon: true };
      if (a.source === "charm" && !s.charm.connected)
        return withToast(s, "Charm is disconnected — connect it to use the physical trigger", "warn");
      if (s.sos.stage === "alerting" || s.sos.stage === "active") return nav(s, "sos");
      return nav({ ...s, sos: { stage: "confirm", source: a.source, step: 0 } }, "sos");
    }
    case "SOS_CONFIRM":
      return { ...s, sos: { ...s.sos, stage: "alerting", step: 0 } };
    case "SOS_STEP": {
      if (s.sos.stage !== "alerting") return s;
      const step = s.sos.step + 1;
      return { ...s, sos: { ...s.sos, step, stage: step >= 4 ? "active" : "alerting" } };
    }
    case "SOS_CANCEL":
      return withToast(
        { ...s, sos: { stage: "idle", source: "app", step: 0 } },
        s.sos.stage === "confirm" ? "SOS cancelled — nothing was sent" : "SOS cancelled — contacts told you are safe (simulated)",
        "info",
      );

    /* Travel buddy -------------------------------------------------- */
    case "BUDDY_SELECT":
      return { ...s, buddy: { ...s.buddy, selectedId: a.id, request: a.id === s.buddy.selectedId ? s.buddy.request : "none" } };
    case "BUDDY_REQUEST":
      return { ...s, buddy: { ...s.buddy, request: "pending" } };
    case "BUDDY_CONFIRMED":
      return s.buddy.request === "pending"
        ? withToast({ ...s, buddy: { ...s.buddy, request: "confirmed" } }, "Shared commute confirmed (simulated)", "success")
        : s;
    case "BUDDY_CANCEL":
      return { ...s, buddy: { ...s.buddy, request: "none" } };
    case "BUDDY_VIRTUAL": {
      const on = !s.buddy.virtualCheckIn;
      return withToast(
        { ...s, buddy: { ...s.buddy, virtualCheckIn: on } },
        on ? "Virtual check-in started (simulated)" : "Virtual check-in ended",
        on ? "success" : "info",
      );
    }

    case "FOCUS_HAVEN":
      return { ...s, focusHaven: a.id };

    /* Toasts -------------------------------------------------------- */
    case "TOAST":
      return withToast(s, a.text, a.tone);
    case "DISMISS_TOAST":
      return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) };

    case "RESET":
      return { ...initialState, hazards: SEED_HAZARDS, toasts: [{ id: toastSeq++, text: "Demo reset to default state", tone: "info" }] };
    default:
      return s;
  }
}

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export function routeScore(routeId: RouteId, hazards: Hazard[]) {
  const base = ROUTES.find((r) => r.id === routeId)!.baseScore;
  const penalty = hazards
    .filter((h) => h.userSubmitted && h.routeId === routeId)
    .reduce((sum, h) => sum + HAZARD_IMPACT[h.category], 0);
  return Math.max(0, base - penalty);
}

export function recommendedRoute(hazards: Hazard[]): RouteId {
  return [...ROUTES].sort((a, b) => routeScore(b.id, hazards) - routeScore(a.id, hazards))[0].id;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

interface Ctx {
  state: DemoState;
  dispatch: React.Dispatch<Action>;
  go: (screen: ScreenId) => void;
  back: () => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
  connectCharm: () => void;
  destinationName: string;
}

const DemoContext = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const connectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Journey ticker
  const journeyRunning = state.journey.status === "active" && !state.journey.alert && state.phoneBattery > 0;
  useEffect(() => {
    if (!journeyRunning) return;
    const t = setInterval(() => dispatch({ type: "JOURNEY_TICK" }), 1000);
    return () => clearInterval(t);
  }, [journeyRunning]);

  // SOS simulated progress
  useEffect(() => {
    if (state.sos.stage !== "alerting") return;
    const t = setTimeout(() => dispatch({ type: "SOS_STEP" }), 900);
    return () => clearTimeout(t);
  }, [state.sos.stage, state.sos.step]);

  // Buddy request auto-acceptance (simulated)
  useEffect(() => {
    if (state.buddy.request !== "pending") return;
    const t = setTimeout(() => dispatch({ type: "BUDDY_CONFIRMED" }), 2200);
    return () => clearTimeout(t);
  }, [state.buddy.request]);

  // Toast expiry
  useEffect(() => {
    if (!state.toasts.length) return;
    const first = state.toasts[0];
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST", id: first.id }), state.toasts.length > 1 ? 1600 : 2800);
    return () => clearTimeout(t);
  }, [state.toasts]);

  const connectCharm = useCallback(() => {
    dispatch({ type: "CHARM_CONNECT_START" });
    if (connectTimer.current) clearTimeout(connectTimer.current);
    connectTimer.current = setTimeout(() => dispatch({ type: "CHARM_CONNECTED" }), 1400);
  }, []);

  useEffect(() => () => {
    if (connectTimer.current) clearTimeout(connectTimer.current);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      go: (screen) => dispatch({ type: "NAV", screen }),
      back: () => dispatch({ type: "BACK" }),
      toast: (text, tone) => dispatch({ type: "TOAST", text, tone }),
      connectCharm,
      destinationName: DESTINATIONS.find((d) => d.id === state.destinationId)?.name ?? DESTINATIONS[0].name,
    }),
    [state, connectCharm],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}
