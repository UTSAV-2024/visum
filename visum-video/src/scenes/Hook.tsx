import { AbsoluteFill, Easing, interpolate, Interactive, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, EASE } from "../theme";
import { FONT } from "../fonts";

/**
 * Scene 1 — the premise.
 *
 * Two lines that reframe the problem: people ask AI, and AI reads a different
 * web than humans do. The second line lands late so the first has a beat to
 * register.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [4, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const line2 = interpolate(frame, [26, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });

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
          name="Hook line 1"
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: C.muted,
            letterSpacing: -1.5,
            opacity: line1,
            translate: interpolate(line1, [0, 1], ["0px 26px", "0px 0px"]),
          }}
        >
          Your customers stopped Googling.
        </Interactive.Div>

        <Interactive.Div
          name="Hook line 2"
          style={{
            fontSize: 86,
            fontWeight: 800,
            color: C.fg,
            letterSpacing: -3,
            marginTop: 26,
            textAlign: "center",
            opacity: line2,
            translate: interpolate(line2, [0, 1], ["0px 30px", "0px 0px"]),
          }}
        >
          They&rsquo;re asking{" "}
          <span style={{ color: C.accent }}>AI</span> instead.
        </Interactive.Div>

        {/* A rule that draws itself under the statement. */}
        <Interactive.Div
          name="Underline"
          style={{
            height: 3,
            marginTop: 44,
            backgroundColor: C.accent,
            borderRadius: 2,
            width: interpolate(frame, [46, 78], [0, 340], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
            opacity: 0.85,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
