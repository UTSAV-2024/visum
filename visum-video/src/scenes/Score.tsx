import { AbsoluteFill, Easing, interpolate, Interactive, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, CHECKS, EASE } from "../theme";
import { FONT } from "../fonts";

/**
 * Scene 3 — the score.
 *
 * The number counts up while a ring traces around it, then the eight weighted
 * bars stack in underneath. Counting rather than cutting to the final figure is
 * deliberate: it reads as measurement, not as a claim.
 */
const RADIUS = 132;
const CIRC = 2 * Math.PI * RADIUS;
const TARGET = 86;

export const Score: React.FC = () => {
  const frame = useCurrentFrame();

  const t = interpolate(frame, [8, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE),
  });
  const value = Math.round(t * TARGET);

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.6} />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 72,
          fontFamily: FONT.sans,
          padding: 110,
        }}
      >
        {/* The dial */}
        <Interactive.Div
          name="Score dial"
          style={{
            position: "relative",
            width: 320,
            height: 320,
            flexShrink: 0,
            scale: interpolate(frame, [0, 22], [0.9, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          <svg width={320} height={320} style={{ rotate: "-90deg" }}>
            <circle cx={160} cy={160} r={RADIUS} fill="none" stroke={C.border} strokeWidth={16} />
            <circle
              cx={160}
              cy={160}
              r={RADIUS}
              fill="none"
              stroke={C.accent}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - t * (TARGET / 100))}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 108,
                fontWeight: 800,
                color: C.fg,
                letterSpacing: -4,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 6 }}>out of 100</div>
          </div>
        </Interactive.Div>

        {/* Weighted bars */}
        <div style={{ width: 760 }}>
          <Interactive.Div
            name="Score heading"
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: C.fg,
              marginBottom: 28,
              opacity: interpolate(frame, [10, 30], [0, 1], {
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
            }}
          >
            Eight checks, every one measured
          </Interactive.Div>

          {CHECKS.map((check, i) => {
            const start = 18 + i * 5;
            const grow = interpolate(frame, [start, start + 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            });
            const full = check.score === check.weight;

            return (
              <div
                key={check.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 14,
                  opacity: grow,
                }}
              >
                <span
                  style={{
                    width: 300,
                    fontSize: 23,
                    color: C.muted,
                    textAlign: "right",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {check.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: C.secondary,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 8,
                      backgroundColor: full ? C.accent : C.warn,
                      width: `${(check.score / 20) * 100 * grow}%`,
                    }}
                  />
                </div>
                <span
                  style={{
                    width: 60,
                    fontFamily: FONT.mono,
                    fontSize: 21,
                    color: full ? C.accent : C.warn,
                    flexShrink: 0,
                  }}
                >
                  {check.score}/{check.weight}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
