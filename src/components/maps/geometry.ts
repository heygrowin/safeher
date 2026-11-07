import type { Point } from "@/types";

export const MAP_W = 400;
export const MAP_H = 460;

export const toD = (pts: Point[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

export const pct = (p: Point) => ({ left: `${(p[0] / MAP_W) * 100}%`, top: `${(p[1] / MAP_H) * 100}%` });

function segLengths(pts: Point[]) {
  const out: number[] = [];
  for (let i = 1; i < pts.length; i++) out.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return out;
}

/** Point at fraction t (0..1) of a polyline, plus the heading in degrees. */
export function pointAt(pts: Point[], t: number): { p: Point; angle: number } {
  const lens = segLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const f = lens[i] ? Math.min(1, d / lens[i]) : 0;
      const a = pts[i];
      const b = pts[i + 1];
      return {
        p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
        angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI,
      };
    }
    d -= lens[i];
  }
  return { p: pts[pts.length - 1], angle: 0 };
}

/** The sub-polyline from the start to fraction t (for the "travelled" overlay). */
export function sliceTo(pts: Point[], t: number): Point[] {
  const lens = segLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  const out: Point[] = [pts[0]];
  for (let i = 0; i < lens.length; i++) {
    if (d >= lens[i]) {
      out.push(pts[i + 1]);
      d -= lens[i];
    } else {
      const f = lens[i] ? d / lens[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]);
      break;
    }
  }
  return out;
}

/** Evenly spaced points along a polyline (used for streetlight glows). */
export function samplePoints(pts: Point[], every: number): Point[] {
  const lens = segLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  const out: Point[] = [];
  for (let d = every / 2; d < total; d += every) out.push(pointAt(pts, d / total).p);
  return out;
}
