import type { RouteOption } from "@/types";

/**
 * ILLUSTRATIVE DEMO DATA — not measured routes.
 * Coordinates live in the map's 400 × 460 SVG space.
 */
export const START_POINT: [number, number] = [88, 400];
export const END_POINT: [number, number] = [304, 78];

export const ROUTES: RouteOption[] = [
  {
    id: "A",
    name: "Route A",
    minutes: 12,
    km: 2.6,
    baseScore: 78,
    color: "#60A5FA",
    colorName: "blue",
    via: "via Viale San Martino",
    path: [
      [88, 400],
      [160, 310],
      [230, 190],
      [304, 78],
    ],
    labelAt: [124, 352],
    indicators: { openShops: 9, pharmacies: 2, clinics: 1, police: 0, lighting: "Moderate", cctvRefs: 3 },
    havenIds: ["city-pharmacy"],
  },
  {
    id: "B",
    name: "Route B",
    minutes: 17,
    km: 3.2,
    baseScore: 92,
    color: "#A855F7",
    colorName: "purple",
    via: "via Corso Cavour",
    path: [
      [88, 400],
      [88, 230],
      [230, 230],
      [230, 150],
      [304, 150],
      [304, 78],
    ],
    labelAt: [160, 230],
    indicators: { openShops: 14, pharmacies: 3, clinics: 2, police: 1, lighting: "Good", cctvRefs: 5 },
    havenIds: ["blossom-cafe", "city-pharmacy", "nexa-mart"],
  },
  {
    id: "C",
    name: "Route C",
    minutes: 15,
    km: 3.0,
    baseScore: 64,
    color: "#FBBF24",
    colorName: "amber",
    via: "via Via T. Cannizzaro",
    path: [
      [88, 400],
      [230, 400],
      [330, 310],
      [330, 150],
      [304, 78],
    ],
    labelAt: [330, 262],
    indicators: { openShops: 5, pharmacies: 1, clinics: 1, police: 0, lighting: "Limited", cctvRefs: 1 },
    havenIds: [],
  },
];

export const ROUTE_BY_ID = Object.fromEntries(ROUTES.map((r) => [r.id, r])) as Record<
  RouteOption["id"],
  RouteOption
>;

/** Illustrative score reduction applied when a new report lands on a route. */
export const HAZARD_IMPACT = { streetlight: 4, blocked: 6, other: 3 } as const;
