/**
 * Competitor comparison, derived from real scans.
 *
 * "Your site" is your latest primary scan; "competitors" are scans you ran of
 * other sites (kind = 'competitor'), one row kept per competitor host. Every
 * number here comes from an actual scan — there is no industry average, no
 * traffic estimate, and no "reliability" score, because none of those has a
 * data source.
 */

const CHECK_ORDER = [
  "AI Bot Permissions (robots.txt)",
  "JSON-LD Structured Data",
  "llms.txt File",
  "MCP Endpoint",
  "JavaScript Rendering",
  "Meta Tags and Open Graph",
  "Sitemap.xml",
  "Page Load Speed",
];

// Short labels for the per-check comparison table.
const CHECK_LABEL = {
  "AI Bot Permissions (robots.txt)": "Robots.txt AI access",
  "JSON-LD Structured Data": "JSON-LD structured data",
  "llms.txt File": "llms.txt file",
  "MCP Endpoint": "MCP endpoint",
  "JavaScript Rendering": "JS-free content",
  "Meta Tags and Open Graph": "Meta & Open Graph",
  "Sitemap.xml": "Sitemap.xml",
  "Page Load Speed": "Page speed",
};

// The three measurable dimensions, shared with the dashboard.
const DIMENSIONS = {
  crawlability: ["AI Bot Permissions (robots.txt)", "Sitemap.xml", "JavaScript Rendering"],
  readability: ["Meta Tags and Open Graph", "llms.txt File", "Page Load Speed"],
  structuredData: ["JSON-LD Structured Data", "MCP Endpoint"],
};

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
}

function toChecks(scan) {
  return Array.isArray(scan?.checks) ? scan.checks : [];
}

function dimensionScore(checks, names) {
  const relevant = checks.filter((c) => names.includes(c.name) && c.measured !== false);
  const available = relevant.reduce((s, c) => s + (c.max_score ?? 0), 0);
  if (available === 0) return null;
  const earned = relevant.reduce((s, c) => s + (c.score ?? 0), 0);
  return Math.round((earned / available) * 100);
}

/** Which checks a scan passes, as a name→bool map. */
function passMap(scan) {
  const map = {};
  for (const c of toChecks(scan)) map[c.name] = !!c.passed;
  return map;
}

function toEntry(scan, isYou) {
  const checks = toChecks(scan);
  return {
    id: scan.id || scan.scan_id,
    scanId: scan.scan_id,
    host: hostOf(scan.url),
    url: scan.url,
    score: scan.total_score,
    band: scan.band,
    isYou,
    scannedAt: scan.created_at,
    dimensions: {
      crawlability: dimensionScore(checks, DIMENSIONS.crawlability),
      readability: dimensionScore(checks, DIMENSIONS.readability),
      structuredData: dimensionScore(checks, DIMENSIONS.structuredData),
    },
    passes: passMap(scan),
  };
}

/**
 * @param {object|null} ownScan  the user's latest primary scan
 * @param {object[]} competitorScans  one scan per competitor (newest kept)
 */
export function deriveCompetitors(ownScan, competitorScans) {
  const you = ownScan ? toEntry(ownScan, true) : null;

  // Keep only the newest scan per competitor host, and never the user's own host.
  const seen = new Set(you ? [you.host] : []);
  const competitors = [];
  for (const s of competitorScans || []) {
    const host = hostOf(s.url);
    if (seen.has(host)) continue;
    seen.add(host);
    competitors.push(toEntry(s, false));
  }

  const all = [...(you ? [you] : []), ...competitors].sort((a, b) => b.score - a.score);
  const leaderboard = all.map((e, i) => ({ ...e, rank: i + 1 }));

  const yourRank = you ? leaderboard.findIndex((e) => e.isYou) + 1 : null;
  const leader = leaderboard[0] || null;
  const gapToLeader = you && leader && !leader.isYou ? leader.score - you.score : 0;

  // Per-check comparison across you + every competitor.
  const featureComparison = CHECK_ORDER.map((name) => ({
    check: name,
    label: CHECK_LABEL[name] || name,
    yours: you ? !!you.passes[name] : null,
    competitors: competitors.map((c) => ({ host: c.host, passes: !!c.passes[name] })),
  }));

  // Gaps: checks a competitor passes that you don't (where you're losing).
  const gaps = you
    ? CHECK_ORDER.filter(
        (name) => !you.passes[name] && competitors.some((c) => c.passes[name])
      ).map((name) => ({
        check: name,
        label: CHECK_LABEL[name] || name,
        passedBy: competitors.filter((c) => c.passes[name]).map((c) => c.host),
      }))
    : [];

  // Wins: checks you pass that a competitor doesn't (where you're ahead).
  const wins = you
    ? CHECK_ORDER.filter(
        (name) => you.passes[name] && competitors.some((c) => !c.passes[name])
      ).map((name) => ({
        check: name,
        label: CHECK_LABEL[name] || name,
        missedBy: competitors.filter((c) => !c.passes[name]).map((c) => c.host),
      }))
    : [];

  return {
    hasOwnScan: !!you,
    you,
    competitors,
    leaderboard,
    yourRank,
    competitorCount: competitors.length,
    gapToLeader,
    featureComparison,
    gaps,
    wins,
  };
}

export { CHECK_ORDER, CHECK_LABEL };
