import type { SafeHaven } from "@/types";

/** Participating community locations — DEMO DATA. */
export const SAFE_HAVENS: SafeHaven[] = [
  {
    id: "blossom-cafe",
    name: "Blossom Café",
    category: "Café",
    distanceM: 230,
    open: true,
    hours: "07:00 – 23:00",
    image: "/images/haven-blossom.png",
    at: [116, 300],
    address: "Via Garibaldi (demo address)",
    verifiedLabel: "Community-verified · reviewed Oct 2026 (demo)",
    support: [
      "You may wait inside while you contact someone",
      "Staff can help you call a trusted contact or 112",
      "Phone charging point at the counter",
    ],
  },
  {
    id: "city-pharmacy",
    name: "City Pharmacy",
    category: "Pharmacy",
    distanceM: 450,
    open: true,
    hours: "08:30 – 22:00",
    image: "/images/haven-pharmacy.png",
    at: [196, 196],
    address: "Corso Cavour (demo address)",
    verifiedLabel: "Community-verified · reviewed Sep 2026 (demo)",
    support: [
      "Well-lit entrance and waiting area",
      "Basic first-aid supplies available",
      "Staff can help you call a trusted contact or 112",
    ],
  },
  {
    id: "nexa-mart",
    name: "Nexa Mart",
    category: "Shop",
    distanceM: 650,
    open: true,
    hours: "08:00 – 21:30",
    image: "/images/haven-nexa.png",
    at: [270, 120],
    address: "Via dei Verdi (demo address)",
    verifiedLabel: "Community-verified · reviewed Oct 2026 (demo)",
    support: ["You may wait inside until a contact arrives", "Staff aware of the Safe Haven programme"],
  },
  {
    id: "home-support",
    name: "Home Support Point",
    category: "Home",
    distanceM: 1100,
    open: false,
    hours: "Evenings 18:00 – 22:00",
    image: "/images/haven-home.png",
    at: [40, 330],
    address: "Residential area (shared on request)",
    verifiedLabel: "Verified resident volunteer · reviewed Aug 2026 (demo)",
    support: ["Resident volunteer during listed hours", "Can help you contact a trusted person"],
  },
];

export const HAVEN_BY_ID: Record<string, SafeHaven> = Object.fromEntries(SAFE_HAVENS.map((h) => [h.id, h]));
