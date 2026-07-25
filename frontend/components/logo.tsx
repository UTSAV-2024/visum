import { useId } from "react";

/**
 * The Visum mark: a pixel-dissolving V with a lens in its notch.
 *
 * The lens is cut out of the V with a mask rather than drawn over it, so the
 * ring stays legible at any size and in a single colour — at 24px a same-colour
 * circle sitting on top of the V would just read as a blob.
 *
 * `variant="brand"` paints it in the brand gradient for standalone placements
 * (auth screens, favicon, share images). The default inherits `currentColor`,
 * which is what keeps it in step with the surrounding UI.
 */
export function Logo({
  className,
  variant = "current",
}: {
  className?: string;
  variant?: "current" | "brand";
}) {
  const uid = useId().replace(/:/g, "");
  const maskId = `visum-lens-${uid}`;
  const gradId = `visum-grad-${uid}`;
  const paint = variant === "brand" ? `url(#${gradId})` : "currentColor";

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {variant === "brand" && (
          <linearGradient
            id={gradId}
            x1="52"
            y1="10"
            x2="20"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#5CC8FF" />
            <stop offset="55%" stopColor="#2A8FE8" />
            <stop offset="100%" stopColor="#1657C4" />
          </linearGradient>
        )}

        {/* Black = removed. Clears a ring of space for the lens and its handle. */}
        <mask id={maskId}>
          <rect width="64" height="64" fill="white" />
          <circle cx="39" cy="34" r="9.5" fill="black" />
          <line
            x1="44"
            y1="39"
            x2="48.8"
            y2="43.8"
            stroke="black"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* The V */}
        <path d="M12 14 H23 L32 41 L41 14 H52 L34.5 56 H29.5 Z" fill={paint} />

        {/* Pixels shedding off the leading edge */}
        <g fill={paint}>
          <rect x="7.5" y="11" width="4" height="4" opacity="0.9" />
          <rect x="3.5" y="13.5" width="3" height="3" opacity="0.6" />
          <rect x="8" y="6" width="3" height="3" opacity="0.7" />
          <rect x="3" y="8.5" width="2.5" height="2.5" opacity="0.45" />
          <rect x="11.5" y="3" width="2.5" height="2.5" opacity="0.5" />
          <rect x="6.5" y="1.5" width="2" height="2" opacity="0.3" />
          <rect x="1" y="3.5" width="2" height="2" opacity="0.25" />
        </g>
      </g>

      {/* The lens, sitting in the gap the mask opened */}
      <circle cx="39" cy="34" r="7" stroke={paint} strokeWidth="3.2" />
      <line
        x1="44"
        y1="39"
        x2="48.8"
        y2="43.8"
        stroke={paint}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Mark plus wordmark, for places where the logo stands on its own rather than
 * sitting next to other page furniture.
 */
export function LogoLockup({
  className,
  tagline = false,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center gap-3 ${className ?? ""}`}>
      <Logo variant="brand" className="h-14 w-14" />
      <span className="flex flex-col items-center">
        <span className="text-2xl font-bold uppercase tracking-[0.28em] text-foreground">
          Visum
        </span>
        {tagline && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            AI visibility. Real impact.
          </span>
        )}
      </span>
    </span>
  );
}
