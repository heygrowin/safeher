import type { Hazard, HazardCategory, HazardSpot } from "@/types";
import { Lightbulb, Construction, TriangleAlert, type LucideIcon } from "lucide-react";

export const HAZARD_CATEGORIES: { id: HazardCategory; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "streetlight", label: "Broken Streetlight", hint: "Light out or flickering", icon: Lightbulb },
  { id: "blocked", label: "Blocked Path", hint: "Works or obstruction", icon: Construction },
  { id: "other", label: "Other Local Hazard", hint: "Any place-based issue", icon: TriangleAlert },
];

export const HAZARD_LABEL: Record<HazardCategory, string> = {
  streetlight: "Broken Streetlight",
  blocked: "Blocked Path",
  other: "Other Local Hazard",
};

export const HAZARD_ICON: Record<HazardCategory, LucideIcon> = {
  streetlight: Lightbulb,
  blocked: Construction,
  other: TriangleAlert,
};

/** Preset demo pin locations a report can be attached to. */
export const HAZARD_SPOTS: HazardSpot[] = [
  { id: "garibaldi", label: "Via Garibaldi", routeId: "B", at: [88, 290] },
  { id: "sanmartino", label: "Viale San Martino", routeId: "A", at: [267, 134] },
  { id: "cannizzaro", label: "Via T. Cannizzaro", routeId: "C", at: [330, 196] },
];

/** Reports already in the demo dataset (already reflected in base scores). */
export const SEED_HAZARDS: Hazard[] = [
  {
    id: "h-seed-1",
    category: "streetlight",
    details: "Two lamps out near the waterfront stretch.",
    at: [290, 346],
    routeId: "C",
    locationLabel: "Via T. Cannizzaro",
    hasPhoto: false,
    createdLabel: "Reported yesterday",
    userSubmitted: false,
  },
  {
    id: "h-seed-2",
    category: "blocked",
    details: "Pavement works — narrow passage on one side.",
    at: [195, 250],
    routeId: "A",
    locationLabel: "Viale San Martino",
    hasPhoto: false,
    createdLabel: "Reported 2 days ago",
    userSubmitted: false,
  },
];
