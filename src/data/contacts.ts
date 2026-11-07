import type { Contact, TravelBuddy } from "@/types";

/** Demo trusted contacts — fictional people. */
export const TRUSTED_CONTACTS: Contact[] = [
  { id: "c1", name: "Mamma", relation: "Family", initials: "M", color: "#C084FC" },
  { id: "c2", name: "Giulia R.", relation: "Friend", initials: "GR", color: "#60A5FA" },
];

/** Demo travel buddies — fictional, no real profiles or locations. */
export const TRAVEL_BUDDIES: TravelBuddy[] = [
  {
    id: "b1",
    alias: "Sofia M.",
    initials: "SM",
    color: "#C084FC",
    routeMatch: "Via Garibaldi → Piazza del Duomo",
    overlap: 85,
    departs: "Leaving in ~5 min",
    verified: true,
    note: "Student · University of Messina",
  },
  {
    id: "b2",
    alias: "Elena T.",
    initials: "ET",
    color: "#22D3EE",
    routeMatch: "Corso Cavour → Messina Centrale",
    overlap: 62,
    departs: "Leaving in ~12 min",
    verified: true,
    note: "Commutes this route on weekdays",
  },
  {
    id: "b3",
    alias: "Chiara L.",
    initials: "CL",
    color: "#FBBF24",
    routeMatch: "Via Garibaldi → Piazza del Duomo",
    overlap: 54,
    departs: "Leaving in ~20 min",
    verified: false,
    note: "Verification pending",
  },
];
