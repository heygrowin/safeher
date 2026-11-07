import { BRAND } from "@/config/brand";

const MARK_SRC = "/images/logo-mark.png";
const MASK = `url(${MARK_SRC}) center / contain no-repeat`;

/**
 * SafeHer mark: location pin with a woman's profile.
 * The artwork (public/images/logo-mark.png) is used as a mask and filled with
 * the brand gradient, so it stays crisp on the dark UI at any size.
 * Outer span carries className (e.g. drop-shadow glow); inner span is masked.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const height = Math.round(size * 1.17);
  return (
    <span className={`relative block shrink-0 ${className}`} style={{ width: size, height }} role="img" aria-label={`${BRAND.name} logo`}>
      <span
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #E9D5FF 0%, #C084FC 45%, #8B5CF6 100%)",
          WebkitMask: MASK,
          mask: MASK,
        }}
      />
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-extrabold tracking-tight ${className}`}>{BRAND.name}</span>;
}
