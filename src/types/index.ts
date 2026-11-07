export type Point = [number, number];

export type RouteId = "A" | "B" | "C";

export interface RouteIndicators {
  openShops: number;
  pharmacies: number;
  clinics: number;
  police: number;
  lighting: "Good" | "Moderate" | "Limited";
  cctvRefs: number;
}

export interface RouteOption {
  id: RouteId;
  name: string;
  minutes: number;
  km: number;
  /** Illustrative Route Support Score (0–100) before any new user reports */
  baseScore: number;
  color: string;
  colorName: "purple" | "blue" | "amber";
  via: string;
  path: Point[];
  labelAt: Point;
  indicators: RouteIndicators;
  havenIds: string[];
}

export interface Destination {
  id: string;
  name: string;
  area: string;
}

export type FacilityKind = "shop" | "pharmacy" | "clinic" | "police" | "light";

export interface Facility {
  id: string;
  kind: FacilityKind;
  at: Point;
  label: string;
}

export type HavenCategory = "Café" | "Pharmacy" | "Shop" | "Home";

export interface SafeHaven {
  id: string;
  name: string;
  category: HavenCategory;
  distanceM: number;
  open: boolean;
  hours: string;
  image: string;
  at: Point;
  address: string;
  verifiedLabel: string;
  support: string[];
}

export type HazardCategory = "streetlight" | "blocked" | "other";

export interface Hazard {
  id: string;
  category: HazardCategory;
  details: string;
  at: Point;
  routeId: RouteId | null;
  locationLabel: string;
  hasPhoto: boolean;
  createdLabel: string;
  /** true for reports submitted during this demo session */
  userSubmitted: boolean;
}

export interface HazardSpot {
  id: string;
  label: string;
  routeId: RouteId;
  at: Point;
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  initials: string;
  color: string;
}

export interface TravelBuddy {
  id: string;
  alias: string;
  initials: string;
  color: string;
  routeMatch: string;
  overlap: number;
  departs: string;
  verified: boolean;
  note: string;
}

export type ScreenId =
  | "onboarding"
  | "home"
  | "routes"
  | "routeDetails"
  | "havens"
  | "journey"
  | "hazard"
  | "buddy"
  | "charm"
  | "lowBattery"
  | "sos"
  | "profile";

export type JourneyStatus = "idle" | "active" | "paused" | "ended";
export type JourneyAlert = null | "deviation" | "stop";

export interface JourneyState {
  status: JourneyStatus;
  progress: number; // 0..1 along the selected route
  sharing: boolean;
  checkInSeconds: number;
  alert: JourneyAlert;
  deviated: boolean;
  reviewing: boolean;
  log: string[];
}

export type GestureAction = "sos" | "checkin" | "voice" | "none";

export interface CharmState {
  connected: boolean;
  connecting: boolean;
  battery: number;
  voiceNav: boolean;
  beacon: boolean;
  gestures: { doubleClick: GestureAction; hold3s: GestureAction };
}

export type SosStage = "idle" | "confirm" | "alerting" | "active";

export interface SosState {
  stage: SosStage;
  source: "app" | "charm";
  step: number; // 0..4 simulated progress steps when active
}

export interface BuddyState {
  selectedId: string | null;
  request: "none" | "pending" | "confirmed";
  virtualCheckIn: boolean;
}

export interface Toast {
  id: number;
  text: string;
  tone: "info" | "success" | "warn" | "sos";
}
