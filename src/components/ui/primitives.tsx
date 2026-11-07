"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ChevronLeft, FlaskConical, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* Small "Simulated" / "Demo data" label used throughout the app */
export function SimTag({ children = "Simulated", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.04] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-muted ${className}`}
    >
      <FlaskConical size={10} strokeWidth={2.4} />
      {children}
    </span>
  );
}

type BtnProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  variant?: "primary" | "ghost" | "danger" | "soft";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  full?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  icon: Icon,
  iconRight: IconRight,
  full,
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: BtnProps) {
  const sizes = { sm: "h-9 px-3 text-[12px] gap-1.5", md: "h-11 px-4 text-[13px] gap-2", lg: "h-12 px-5 text-sm gap-2" };
  const variants = {
    primary: "btn-primary text-white",
    ghost: "border border-line bg-white/[0.03] text-fg hover:bg-white/[0.07]",
    soft: "bg-brand/15 text-lav border border-brand/30 hover:bg-brand/25",
    danger: "bg-gradient-to-br from-sos to-[#E11D48] text-white shadow-[0_8px_24px_-8px_rgba(244,63,94,0.8)]",
  };
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -1 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} strokeWidth={2.2} />}
      {children}
      {IconRight && <IconRight size={size === "sm" ? 14 : 16} strokeWidth={2.2} />}
    </motion.button>
  );
}

export function Toggle({ on, onChange, label, tone = "brand" }: { on: boolean; onChange: () => void; label: string; tone?: "brand" | "ok" }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? (tone === "ok" ? "bg-ok" : "bg-brand") : "bg-white/15"}`}
    >
      <motion.span
        initial={false}
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 600, damping: 34 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
      />
    </button>
  );
}

export function Card({ className = "", children, ...rest }: Omit<HTMLMotionProps<"div">, "children"> & { children?: ReactNode }) {
  return (
    <motion.div className={`rounded-2xl border border-line bg-card/90 ${className}`} {...rest}>
      {children}
    </motion.div>
  );
}

export function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="relative flex h-11 items-center justify-center px-4">
      {onBack && (
        <button onClick={onBack} aria-label="Back" className="absolute left-2 grid h-9 w-9 place-items-center rounded-full text-fg hover:bg-white/5">
          <ChevronLeft size={22} />
        </button>
      )}
      <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>
      {right && <div className="absolute right-3">{right}</div>}
    </div>
  );
}

export function IconBadge({ icon: Icon, color = "#C084FC", size = 36 }: { icon: LucideIcon; color?: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, background: `${color}1f`, color, boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      <Icon size={size * 0.5} strokeWidth={2.1} />
    </span>
  );
}

export function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-[11px] font-bold text-bg"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, #ffffff99)` }}
    >
      {initials}
    </span>
  );
}

export function ScoreRing({ value, size = 64, color = "#34D399" }: { value: number; size?: number; color?: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={6} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}

export const scoreColor = (v: number) => (v >= 85 ? "#34D399" : v >= 72 ? "#60A5FA" : "#FBBF24");
export const scoreWord = (v: number) => (v >= 85 ? "High" : v >= 72 ? "Moderate" : "Lower");
