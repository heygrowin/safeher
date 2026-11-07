import type { ScreenId } from "@/types";

export interface ScreenInfo {
  tier: "Pre-Journey" | "Active Journey" | "Emergency & Offline" | "Getting Started" | "Account";
  title: string;
  body: string;
  tryThis: string[];
}

export const SCREEN_INFO: Record<ScreenId, ScreenInfo> = {
  onboarding: {
    tier: "Getting Started",
    title: "Onboarding",
    body: "Introduces the app’s purpose. No sign-up or authentication — the demo goes straight in.",
    tryThis: ["Tap the page dots", "Press “Get Started”"],
  },
  home: {
    tier: "Pre-Journey",
    title: "Home dashboard",
    body: "Start a journey or jump to any feature. The charm status card reflects the simulated BLE connection.",
    tryThis: ["Pick a destination", "Tap “Find Safer Route”", "Open the SOS pill (top right)"],
  },
  routes: {
    tier: "Pre-Journey",
    title: "Route comparison",
    body: "Three alternatives scored with an illustrative Route Support Score built from mock indicators — never a safety guarantee.",
    tryThis: ["Tap a route line, chip or card", "Open the chevron for details"],
  },
  routeDetails: {
    tier: "Pre-Journey",
    title: "Route details",
    body: "Breaks the score down into support indicators: open shops, pharmacies, clinics, police, lighting and public CCTV references (not live feeds).",
    tryThis: ["Tap a Safe Haven card", "Start Navigation"],
  },
  havens: {
    tier: "Pre-Journey",
    title: "Safe Havens",
    body: "Participating local businesses and verified residents that agree to offer basic support. Community-verified, not guaranteed safe.",
    tryThis: ["Filter by category", "Open a location’s details"],
  },
  journey: {
    tier: "Active Journey",
    title: "Live journey monitoring",
    body: "Simulated progress along the chosen route with temporary sharing to trusted contacts and discreet automatic check-ins.",
    tryThis: ["Start / pause / end", "Simulate a route deviation", "Simulate an unexpected stop"],
  },
  hazard: {
    tier: "Active Journey",
    title: "Hazard reporting",
    body: "One-tap, place-based reports. New reports appear on the map and illustrate how route scores could adapt.",
    tryThis: ["Pick a category + location", "Submit and view routes"],
  },
  buddy: {
    tier: "Pre-Journey",
    title: "Travel Buddy",
    body: "Community travel coordination with demo profiles. Only route overlap is shown — never exact locations.",
    tryThis: ["Select a buddy", "Request a shared commute", "Set a virtual check-in"],
  },
  charm: {
    tier: "Emergency & Offline",
    title: "SafeNet Charm",
    body: "Companion controls for the wearable. Connection, battery and gestures are simulated — no Bluetooth hardware is accessed.",
    tryThis: ["Double-click the charm", "Hold it for 3 seconds", "Reassign gestures"],
  },
  lowBattery: {
    tier: "Emergency & Offline",
    title: "Low-battery mode",
    body: "Shows what happens as the phone runs out: warnings, charm companion mode, and the honest limits of a BLE-only device.",
    tryThis: ["Set 5%, then 2%", "Enable companion mode", "Simulate 0%"],
  },
  sos: {
    tier: "Emergency & Offline",
    title: "SOS emergency flow",
    body: "A confirmation countdown reduces accidental triggers, then a simulated alert runs. No calls or messages are ever sent.",
    tryThis: ["Press and hold the SOS button", "Cancel during countdown", "Open the 112 info"],
  },
  profile: {
    tier: "Account",
    title: "Profile",
    body: "Trusted contacts and preferences for the demo user Aanya.",
    tryThis: ["Toggle preferences", "Use shortcuts"],
  },
};

export const TIER_COLOR: Record<ScreenInfo["tier"], string> = {
  "Pre-Journey": "#A855F7",
  "Active Journey": "#60A5FA",
  "Emergency & Offline": "#F43F5E",
  "Getting Started": "#C084FC",
  Account: "#8585A8",
};
