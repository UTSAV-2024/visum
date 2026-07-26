/**
 * The site's two typefaces, loaded for the video.
 *
 * Without these the compositions silently fall back to a system sans and the
 * result stops looking like Visum — the wordmark in particular depends on
 * Bricolage's tight display weights.
 */
import { loadFont as loadSans } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadMono } from "@remotion/google-fonts/FragmentMono";

const sans = loadSans();
const mono = loadMono();

export const FONT = {
  sans: sans.fontFamily,
  mono: mono.fontFamily,
} as const;

export const waitForFonts = () => Promise.all([sans.waitUntilDone(), mono.waitUntilDone()]);
