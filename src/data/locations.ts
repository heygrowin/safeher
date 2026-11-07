import type { Destination, Facility } from "@/types";

export const CURRENT_LOCATION = "Via Garibaldi, Messina";

export const DESTINATIONS: Destination[] = [
  { id: "duomo", name: "Piazza del Duomo", area: "Centro Storico" },
  { id: "unime", name: "University of Messina", area: "Piazza Pugliatti" },
  { id: "centrale", name: "Messina Centrale", area: "Railway station" },
  { id: "garibaldi-n", name: "Via Garibaldi (north)", area: "Waterfront" },
];

/** Support indicators drawn on the demo map (illustrative positions). */
export const FACILITIES: Facility[] = [
  { id: "s1", kind: "shop", at: [88, 352], label: "Open shop" },
  { id: "s2", kind: "shop", at: [124, 230], label: "Open shop" },
  { id: "s3", kind: "shop", at: [206, 230], label: "Open shop" },
  { id: "s4", kind: "shop", at: [266, 150], label: "Open shop" },
  { id: "s5", kind: "shop", at: [180, 280], label: "Open shop" },
  { id: "p1", kind: "pharmacy", at: [58, 268], label: "Pharmacy" },
  { id: "p2", kind: "pharmacy", at: [304, 112], label: "Pharmacy" },
  { id: "p3", kind: "pharmacy", at: [262, 400], label: "Pharmacy" },
  { id: "c1", kind: "clinic", at: [256, 186], label: "Clinic" },
  { id: "c2", kind: "clinic", at: [360, 210], label: "Hospital" },
  { id: "pol", kind: "police", at: [58, 186], label: "Police station" },
];
