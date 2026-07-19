# Design

## Theme

"The reading room" — a diagnostic instrument in a dark imaging lab. Near-black cool surround, patina-teal phosphor readouts (the machine's voice), one copper counterpoint for previews/warnings. Color strategy: **Committed** (teal carries the identity). Dark is earned by the scene: a technician's room where scans are read under low light.

## Color (OKLCH, defined in `frontend/styles/globals.css` @theme)

| Role | Token | Value |
|---|---|---|
| Background | `--color-background` | `oklch(0.135 0.01 195)` |
| Card | `--color-card` | `oklch(0.17 0.012 195)` |
| Ink | `--color-foreground` | `oklch(0.94 0.008 185)` |
| Muted ink | `--color-muted-foreground` | `oklch(0.72 0.018 186)` |
| Primary (patina teal) | `--color-primary` / `--color-accent` | `oklch(0.78 0.115 180)` |
| Deep teal | `--color-brand-600` | `oklch(0.55 0.095 180)` (the seed) |
| Copper counterpoint | `--color-copper` | `oklch(0.74 0.11 55)` — sparingly: preview banners, warnings |
| Pass / Warn / Fail | `--color-pass/warn/fail` | teal-green / amber / oxidized red — never color alone, always with a text label |

Legacy `green/orange/red-500` and `navy-*` aliases are remapped so older components retheme without edits.

## Typography

- **Bricolage Grotesque** (variable, via next/font in `_app.js`) — everything; voice comes from weight contrast (extrabold display → regular body), not a second family.
- **Fragment Mono** — machine output only: URLs, check names, scores, readouts. Mono is earned here; the product displays crawler data.
- Fluid scale: `--text-display` clamp ≤5.2rem, `--text-h1/h2/h3` ≈1.3 ratio. Display tracking −0.025em.

## Motion

- Library: framer-motion. Easing: ease-out expo `[0.16, 1, 0.3, 1]` only — no bounce.
- Primitives in `frontend/components/motion.jsx`: `Reveal`, `Stagger`, `StaggerItem` — all render final state under `prefers-reduced-motion`.
- Signature moments:
  - **Machine's-eye view** (hero): crawler readout types in line by line under a `scan-sweep` beam.
  - **Score reveal** (results): gauge draws in band color while the number counts up (ease-out-expo), verdict bars follow.
- CSS utilities: `.scan-sweep` (phosphor beam), `.phosphor-pulse`, `.instrument-grid` (faint teal grid, radial-masked). All disabled under reduced motion.

## Components & patterns

- Ledgers over card grids: lists of checks render as bordered rows with mono keys (see landing `#checks`, results readout) — no identical icon-card grids.
- Numbered steps only where a real sequence exists (how-it-works).
- `Container`: max-w-7xl. Semantic z-index scale in tokens (`--z-dropdown` … `--z-tooltip`).
- Preview banner (`app-layout.tsx`): copper-toned strip on any route showing sample data — demo pages never impersonate live ones.

## Voice

Diagnostic candor. Findings stated plainly ("json-ld ... none"), severity earned by evidence. No fearmongering, no fabricated statistics, no unverifiable claims.
