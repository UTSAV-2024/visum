import { AbsoluteFill, Easing, interpolate, Interactive, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, CRAWLERS, EASE } from "../theme";
import { FONT } from "../fonts";

/**
 * Scene 4 — AI Analytics.
 *
 * Which crawlers actually reached the site. Bars grow from the left on a
 * stagger; the vendor sits under each name because "GPTBot" means more to a
 * viewer once they read "OpenAI" beside it.
 */
export const Crawlers: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.6} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT.sans,
          padding: 120,
        }}
      >
        <Interactive.Div
          name="Crawlers heading"
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: C.fg,
            letterSpacing: -2,
            marginBottom: 10,
            opacity: interpolate(frame, [2, 24], [0, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
            translate: interpolate(frame, [2, 24], ["0px 20px", "0px 0px"], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          See exactly who&rsquo;s reading you
        </Interactive.Div>

        <Interactive.Div
          name="Crawlers subheading"
          style={{
            fontSize: 29,
            color: C.muted,
            marginBottom: 54,
            opacity: interpolate(frame, [12, 34], [0, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          Real crawler traffic, reported by your own server
        </Interactive.Div>

        <div style={{ width: 860 }}>
          {CRAWLERS.map((bot, i) => {
            const start = 20 + i * 8;
            const grow = interpolate(frame, [start, start + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            });

            return (
              <div
                key={bot.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  marginBottom: 24,
                  opacity: grow,
                  translate: interpolate(grow, [0, 1], ["-20px 0px", "0px 0px"]),
                }}
              >
                <div style={{ width: 268, flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontSize: 29, fontWeight: 600, color: C.fg }}>{bot.name}</div>
                  <div style={{ fontSize: 19, color: C.muted }}>{bot.vendor}</div>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: C.secondary,
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${bot.value * 100 * grow}%`,
                      borderRadius: 13,
                      background: `linear-gradient(90deg, ${C.accent}, ${C.accent}cc)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
