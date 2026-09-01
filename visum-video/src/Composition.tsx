import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Hook } from "./scenes/Hook";
import { Scan } from "./scenes/Scan";
import { Score } from "./scenes/Score";
import { Crawlers } from "./scenes/Crawlers";
import { Outro } from "./scenes/Outro";
import { C } from "./theme";

const FPS = 30;

/**
 * Two cuts of the same material.
 *
 * `LaunchTimeline` is the ~23s walkthrough, with the hook and the CTA.
 * `HeroTimeline` is a ~14s silent cut for the top of the marketing site: same
 * scenes, no hook, no CTA. They share scene components rather than duplicating
 * them, so editing a scene updates both cuts.
 *
 * To stretch the launch cut toward 45-60s, raise the per-scene constants below
 * rather than adding scenes — the animations are all frame-relative, so they
 * simply play slower and hold longer.
 */

// ── Launch video ──────────────────────────────────────────────────
const HOOK = 95;
const SCAN = 150;
const SCORE = 165;
const CRAWLERS = 140;
const OUTRO = 130;

export const LaunchTimeline: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence name="Hook" durationInFrames={HOOK}>
      <Hook />
    </Sequence>
    <Sequence name="Scan" from={HOOK} durationInFrames={SCAN}>
      <Scan />
    </Sequence>
    <Sequence name="Score" from={HOOK + SCAN} durationInFrames={SCORE}>
      <Score />
    </Sequence>
    <Sequence name="Crawlers" from={HOOK + SCAN + SCORE} durationInFrames={CRAWLERS}>
      <Crawlers />
    </Sequence>
    <Sequence name="Outro" from={HOOK + SCAN + SCORE + CRAWLERS} durationInFrames={OUTRO}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
);

export const LAUNCH_DURATION = HOOK + SCAN + SCORE + CRAWLERS + OUTRO;

// ── Hero loop: no hook, no CTA — just the product working ─────────
const L_SCAN = 140;
const L_SCORE = 150;
const L_CRAWL = 130;

export const HeroTimeline: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence name="Scan" durationInFrames={L_SCAN}>
      <Scan />
    </Sequence>
    <Sequence name="Score" from={L_SCAN} durationInFrames={L_SCORE}>
      <Score />
    </Sequence>
    <Sequence name="Crawlers" from={L_SCAN + L_SCORE} durationInFrames={L_CRAWL}>
      <Crawlers />
    </Sequence>
  </AbsoluteFill>
);

export const HERO_DURATION = L_SCAN + L_SCORE + L_CRAWL;

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchTimeline}
        durationInFrames={LAUNCH_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroLoop"
        component={HeroTimeline}
        durationInFrames={HERO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Vertical cut for Reels / Shorts / TikTok. */}
      <Composition
        id="LaunchVertical"
        component={LaunchTimeline}
        durationInFrames={LAUNCH_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
