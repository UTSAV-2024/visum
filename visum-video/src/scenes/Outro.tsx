import { AbsoluteFill, Easing, interpolate, Interactive, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Wordmark } from "../components/Mark";
import { C, EASE } from "../theme";
import { FONT } from "../fonts";

/**
 * Scene 5 — the close.
 *
 * Mark assembles, the promise lands, the URL follows. Nothing overstated: the
 * claim is "free scan", which is true, rather than a growth statistic that
 * would need a citation.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT.sans,
          padding: 120,
        }}
      >
        <Interactive.Div
          name="Outro wordmark"
          style={{
            color: C.fg,
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          <Wordmark color={C.fg} scale={1.35} />
        </Interactive.Div>

        <Interactive.Div
          name="Outro tagline"
          style={{
            fontSize: 46,
            fontWeight: 600,
            color: C.muted,
            marginTop: 34,
            textAlign: "center",
            letterSpacing: -1,
            opacity: interpolate(frame, [24, 48], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
            translate: interpolate(frame, [24, 48], ["0px 18px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          Find out what AI sees on your site.
        </Interactive.Div>

        <Interactive.Div
          name="Outro CTA"
          style={{
            marginTop: 42,
            padding: "20px 44px",
            borderRadius: 16,
            backgroundColor: C.accent,
            color: C.bg,
            fontSize: 27,
            fontWeight: 700,
            opacity: interpolate(frame, [40, 62], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
            scale: interpolate(frame, [40, 62], [0.94, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          Free scan in 20 seconds
        </Interactive.Div>

        <Interactive.Div
          name="Outro URL"
          style={{
            marginTop: 26,
            fontFamily: FONT.mono,
            fontSize: 22,
            color: C.accent,
            opacity: interpolate(frame, [54, 74], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          visum-eight.vercel.app
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
