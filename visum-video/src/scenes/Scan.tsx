import {
  AbsoluteFill,
  Easing,
  interpolate,
  Interactive,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { C, EASE } from "../theme";
import { FONT } from "../fonts";

/**
 * Scene 2 — a scan running.
 *
 * A URL types itself into the field, then the eight checks resolve one after
 * another. The staggered resolution is the point: it shows the product doing
 * work rather than cutting straight to a number.
 */

const URL_TEXT = "yourstore.com";

const CHECK_LABELS = [
  "robots.txt",
  "JSON-LD",
  "llms.txt",
  "MCP endpoint",
  "JS rendering",
  "Meta tags",
  "Sitemap",
  "Load speed",
];

const Tick: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={22} height={22} viewBox="0 0 20 20">
    <path
      d="M4 10.5 L8.2 14.5 L16 5.5"
      fill="none"
      stroke={C.pass}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={22}
      strokeDashoffset={22 * (1 - progress)}
    />
  </svg>
);

export const Scan: React.FC = () => {
  const frame = useCurrentFrame();

  // The URL types in, character by character.
  const typed = Math.round(
    interpolate(frame, [6, 34], [0, URL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })
  );

  return (
    <AbsoluteFill>
      <Backdrop intensity={0.7} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT.sans,
          padding: 100,
        }}
      >
        {/* The scan field */}
        <Interactive.Div
          name="Scan field"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            width: 860,
            padding: "30px 34px",
            borderRadius: 18,
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            opacity: interpolate(frame, [0, 16], [0, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
            scale: interpolate(frame, [0, 16], [0.96, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE),
            }),
          }}
        >
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 36,
              color: C.fg,
              flex: 1,
            }}
          >
            {URL_TEXT.slice(0, typed)}
            <span
              style={{
                opacity: frame < 36 && Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                color: C.accent,
              }}
            >
              |
            </span>
          </div>
          <div
            style={{
              padding: "12px 26px",
              borderRadius: 12,
              backgroundColor: C.accent,
              color: C.bg,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            Scan
          </div>
        </Interactive.Div>

        {/* Checks resolving, two columns */}
        <Sequence from={40} layout="none">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 40px",
              width: 760,
              marginTop: 44,
            }}
          >
            {CHECK_LABELS.map((label, i) => {
              const start = i * 7;
              const appear = interpolate(frame - 40, [start, start + 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              });
              const tick = interpolate(frame - 40, [start + 8, start + 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              });

              return (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    borderRadius: 12,
                    backgroundColor: C.secondary,
                    border: `1px solid ${C.border}`,
                    opacity: appear,
                    translate: interpolate(appear, [0, 1], ["-14px 0px", "0px 0px"]),
                  }}
                >
                  <Tick progress={tick} />
                  <span style={{ fontSize: 26, color: C.fg, fontWeight: 500 }}>{label}</span>
                </div>
              );
            })}
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
