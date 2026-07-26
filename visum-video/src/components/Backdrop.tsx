import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_SOFT } from "../theme";

/**
 * The scene backdrop: the product's near-black field, a slow accent bloom, and
 * a faint grid. The bloom drifts rather than sitting still so a static frame
 * never looks like a dead screenshot.
 */
export const Backdrop: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Grid — sits under everything, barely there. */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.28 * intensity,
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 100%)",
        }}
      />

      {/* Accent bloom, drifting slowly across the whole scene. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 42%, ${C.accent}22, transparent 70%)`,
          opacity: interpolate(frame, [0, 90, 180], [0.55, 0.9, 0.55], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE_SOFT),
          }) * intensity,
          translate: interpolate(frame, [0, 180], ["-3% 0%", "3% 0%"], {
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE_SOFT),
          }),
        }}
      />

      {/* Vignette, to keep the eye centred. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
