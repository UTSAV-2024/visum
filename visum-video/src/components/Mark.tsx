import { Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

/**
 * The real Visum mark, ported from `frontend/components/logo.tsx`: a
 * pixel-dissolving V with a lens cut into its notch.
 *
 * The lens is masked out of the V rather than drawn on top, which is what keeps
 * the ring legible in a single colour. `dissolve` drives the shedding pixels so
 * the mark can assemble itself on screen instead of just fading in.
 */
export const Mark: React.FC<{
  size?: number;
  color?: string;
  /** 0 = pixels scattered and faint, 1 = settled at full opacity. */
  dissolve?: number;
}> = ({ size = 96, color = "currentColor", dissolve = 1 }) => {
  // Each pixel drifts back to place as `dissolve` rises.
  const pixels = [
    { x: 7.5, y: 11, s: 4, o: 0.9, dx: -9, dy: -7 },
    { x: 3.5, y: 13.5, s: 3, o: 0.6, dx: -13, dy: -3 },
    { x: 8, y: 6, s: 3, o: 0.7, dx: -7, dy: -13 },
    { x: 3, y: 8.5, s: 2.5, o: 0.45, dx: -15, dy: -9 },
    { x: 11.5, y: 3, s: 2.5, o: 0.5, dx: -4, dy: -16 },
    { x: 6.5, y: 1.5, s: 2, o: 0.3, dx: -11, dy: -18 },
    { x: 1, y: 3.5, s: 2, o: 0.25, dx: -18, dy: -14 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <mask id="visum-lens-mask">
          <rect width="64" height="64" fill="white" />
          <circle cx="39" cy="34" r="9.5" fill="black" />
          <line x1="44" y1="39" x2="48.8" y2="43.8" stroke="black" strokeWidth="7" strokeLinecap="round" />
        </mask>
      </defs>

      <g mask="url(#visum-lens-mask)">
        <path d="M12 14 H23 L32 41 L41 14 H52 L34.5 56 H29.5 Z" fill={color} />
        <g fill={color}>
          {pixels.map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.s}
              height={p.s}
              opacity={p.o * dissolve}
              style={{
                translate: `${p.dx * (1 - dissolve)}px ${p.dy * (1 - dissolve)}px`,
              }}
            />
          ))}
        </g>
      </g>

      {/* The lens sits in the gap the mask opened. */}
      <circle cx="39" cy="34" r="7" stroke={color} strokeWidth="3.2" />
      <line x1="44" y1="39" x2="48.8" y2="43.8" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
};

/** Mark plus wordmark, letter-spaced to match the site's header. */
export const Wordmark: React.FC<{ color?: string; scale?: number }> = ({
  color = "currentColor",
  scale = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * scale, color }}>
      <Mark
        size={72 * scale}
        color={color}
        dissolve={interpolate(frame, [0, 28], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE),
        })}
      />
      <span
        style={{
          fontSize: 62 * scale,
          fontWeight: 800,
          letterSpacing: -2 * scale,
        }}
      >
        Visum
      </span>
    </div>
  );
};
