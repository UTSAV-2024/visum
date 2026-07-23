/**
 * Turn a user's real scan rows into the shapes the dashboard, recommendations
 * and reports pages render.
 *
 * The `scans` table is the only real per-user data source, so this is the one
 * place that knows how to read it. Everything is a pure function of the rows —
 * no fetching, no side effects — so it runs safely inside getServerSideProps.
 *
 * Scans arrive newest-first (the queries order by created_at desc).
 */

// ── Check taxonomy ───────────────────────────────────────────────────
// The eight checks, grouped into the three dashboard dimensions. Names must
// match exactly what the backend emits (see backend/app/checks + result.js).
const DIMENSIONS = {
  crawlability: {
    label: "AI Crawlability",
    checks: ["AI Bot Permissions (robots.txt)", "Sitemap.xml", "JavaScript Rendering"],
  },
  readability: {
    label: "AI Readability",
    checks: ["Meta Tags and Open Graph", "llms.txt File", "Page Load Speed"],
  },
  structuredData: {
    label: "Structured Data",
    checks: ["JSON-LD Structured Data", "MCP Endpoint"],
  },
};

// Severity by how many points a failed check costs — matches the result page's
// weighting so the dashboard and the report agree.
function severityOf(check) {
  const max = check.max_score ?? 0;
  if (max >= 15) return "critical";
  if (max >= 10) return "major";
  return "minor";
}

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

/** Percentage earned across a set of checks, counting only measured ones. */
function dimensionScore(checks, names) {
  const relevant = checks.filter((c) => names.includes(c.name) && c.measured !== false);
  const available = relevant.reduce((sum, c) => sum + (c.max_score ?? 0), 0);
  if (available === 0) return null; // nothing measured in this dimension
  const earned = relevant.reduce((sum, c) => sum + (c.score ?? 0), 0);
  return Math.round((earned / available) * 100);
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(iso);
}

/**
 * The full derived view for the dashboard. Returns `hasScans: false` when the
 * account has never scanned, so the page can show a real empty state instead
 * of zeros pretending to be data.
 */
export function deriveDashboard(scans) {
  if (!Array.isArray(scans) || scans.length === 0) {
    return { hasScans: false };
  }

  const latest = scans[0];
  const previous = scans[1] || null;
  const checks = toChecks(latest);

  const dimensions = {};
  for (const [key, def] of Object.entries(DIMENSIONS)) {
    dimensions[key] = dimensionScore(checks, def.checks);
  }

  // Issues = every check the latest scan didn't fully pass, worst first.
  const issues = checks
    .filter((c) => c.measured !== false && !c.passed)
    .map((c) => ({
      id: c.name,
      name: c.finding || c.name,
      severity: severityOf(c),
      category: c.name,
      partial: !!c.partial,
    }))
    .sort((a, b) => {
      const order = { critical: 0, major: 1, minor: 2 };
      return order[a.severity] - order[b.severity];
    });

  // Recently fixed = checks that failed in the previous scan but pass now.
  let recentlyFixed = [];
  if (previous) {
    const prevFailed = new Set(
      toChecks(previous).filter((c) => c.measured !== false && !c.passed).map((c) => c.name)
    );
    recentlyFixed = checks
      .filter((c) => c.passed && prevFailed.has(c.name))
      .map((c) => ({ id: c.name, name: c.name, points: c.max_score ?? 0 }));
  }

  const scanHistory = scans.map((s, i) => {
    const next = scans[i + 1];
    return {
      id: s.id || s.scan_id || String(i),
      date: fmtDateTime(s.created_at),
      score: s.total_score,
      status: s.status === "failed" ? "failed" : "completed",
      change: next ? s.total_score - next.total_score : null,
    };
  });

  // Alerts = the checks that need attention most, phrased for the panel. Only
  // the real, current shortfalls — no "everything's on fire" theatre.
  const alerts = issues.slice(0, 4).map((iss) => ({
    id: iss.id,
    type: iss.severity === "critical" ? "critical" : iss.severity === "major" ? "warning" : "info",
    title: iss.category,
    message: iss.name,
    time: relativeTime(latest.created_at),
  }));

  // Activity = what actually happened, reconstructed from the scan trail:
  // each scan is an event, and any fix between the two most recent scans is one.
  const activity = [];
  scans.slice(0, 6).forEach((s, i) => {
    const next = scans[i + 1];
    const delta = next ? s.total_score - next.total_score : null;
    activity.push({
      id: `scan-${s.id || s.scan_id || i}`,
      type: delta == null ? "scan" : delta > 0 ? "improvement" : delta < 0 ? "degradation" : "scan",
      title: i === 0 ? "Latest scan completed" : "Scan completed",
      description:
        delta == null
          ? `Scored ${s.total_score}/100`
          : `Score ${delta > 0 ? "improved" : delta < 0 ? "dropped" : "held"} ${
              delta > 0 ? "+" : ""
            }${delta} → ${s.total_score}/100`,
      timestamp: relativeTime(s.created_at),
    });
  });
  recentlyFixed.forEach((f) => {
    activity.push({
      id: `fix-${f.id}`,
      type: "fix",
      title: "Issue resolved",
      description: `${f.name} now passes (+${f.points} pts)`,
      timestamp: relativeTime(latest.created_at),
    });
  });

  const delta = previous ? latest.total_score - previous.total_score : null;

  // A one-line summary built from the real numbers — no invented specifics.
  const topIssue = issues[0];
  const executiveSummary =
    issues.length === 0
      ? `${hostOf(latest.url)} passed every measured check, scoring ${latest.total_score}/100. Re-scan after any site change to keep it there.`
      : `${hostOf(latest.url)} scored ${latest.total_score}/100${
          delta != null ? `, ${delta >= 0 ? "up" : "down"} ${Math.abs(delta)} from the previous scan` : ""
        }. The biggest gap is ${topIssue.category}${
          issues.length > 1 ? `, with ${issues.length - 1} more to address` : ""
        }.`;

  // Highlights = the real notable events, fixes first then current problems.
  const highlights = [
    ...recentlyFixed.map((f) => ({
      id: `hl-fix-${f.id}`,
      type: "positive",
      message: `${f.name} now passes (+${f.points} pts)`,
      time: relativeTime(latest.created_at),
      href: "/recommendations",
    })),
    ...issues.slice(0, 5).map((iss) => ({
      id: `hl-iss-${iss.id}`,
      type: "warning",
      message: iss.name,
      time: relativeTime(latest.created_at),
      href: "/recommendations",
    })),
  ].slice(0, 5);

  // Recommended actions = the top score-recovering fixes, richest first.
  const recommendedActions = deriveRecommendations(scans)
    .recommendations.slice(0, 4)
    .map((r) => ({
      id: r.id,
      title: r.title,
      impact: r.scoreImprovement,
      priority: r.priority,
      href: "/recommendations",
      completed: false,
    }));

  return {
    hasScans: true,
    url: latest.url,
    host: hostOf(latest.url),
    score: latest.total_score,
    previousScore: previous ? previous.total_score : null,
    delta,
    band: latest.band,
    health: latest.total_score >= 80 ? "healthy" : latest.total_score >= 55 ? "warning" : "critical",
    lastScanAt: latest.created_at,
    lastScanLabel: fmtDateTime(latest.created_at),
    dimensions,
    issues,
    recentlyFixed,
    scanHistory,
    alerts,
    activity,
    executiveSummary,
    highlights,
    recommendedActions,
    scanCount: scans.length,
  };
}

/**
 * Recommendations are a direct read of the latest scan's shortfalls: every
 * check that didn't fully pass already carries its own finding, fix, and the
 * points it would recover. Sorted by points at stake.
 */
export function deriveRecommendations(scans) {
  if (!Array.isArray(scans) || scans.length === 0) {
    return { hasScans: false, url: null, recommendations: [] };
  }

  const latest = scans[0];
  const previous = scans[1] || null;
  const prevPassed = previous
    ? new Set(toChecks(previous).filter((c) => c.passed).map((c) => c.name))
    : new Set();

  const recommendations = toChecks(latest)
    .filter((c) => c.measured !== false && !c.passed)
    .map((c) => {
      const max = c.max_score ?? 0;
      const recoverable = Math.max(max - (c.score ?? 0), 0);
      return {
        id: c.name,
        title: c.fix || `Fix: ${c.name}`,
        check: c.name,
        priority: severityOf(c) === "critical" ? "critical" : severityOf(c) === "major" ? "high" : "medium",
        scoreImprovement: recoverable,
        difficulty: max >= 15 ? "medium" : "easy",
        description: c.finding || c.description || "",
        fix: c.fix || "",
        partial: !!c.partial,
        // A rec is "completed" if this check passes now but failed before —
        // useful when a user re-scans after applying a fix.
        completed: false,
        wasFixed: c.passed && !prevPassed.has(c.name),
      };
    })
    .sort((a, b) => b.scoreImprovement - a.scoreImprovement);

  return {
    hasScans: true,
    url: latest.url,
    host: hostOf(latest.url),
    scannedAt: latest.created_at,
    currentScore: latest.total_score,
    recommendations,
  };
}

/**
 * Score-over-time and issue history for the reports page. Chronological
 * (oldest first) so trend lines read left-to-right.
 */
export function deriveReports(scans) {
  if (!Array.isArray(scans) || scans.length === 0) {
    return { hasScans: false, timeline: [], scoreSeries: [], issueHistory: [] };
  }

  const chrono = [...scans].reverse();

  const timeline = chrono.map((s, i) => {
    const prev = chrono[i - 1];
    const failed = toChecks(s).filter((c) => c.measured !== false && !c.passed);
    return {
      id: s.id || s.scan_id || String(i),
      date: fmtDate(s.created_at),
      score: s.total_score,
      change: prev ? s.total_score - prev.total_score : 0,
      issues: failed.length,
      url: hostOf(s.url),
    };
  });

  const scoreSeries = timeline.map((t) => ({ label: t.date, score: t.score }));

  // Issue history: for each distinct check, when it was first seen failing and
  // whether the most recent scan has it resolved.
  const firstSeen = new Map();
  for (const s of chrono) {
    for (const c of toChecks(s)) {
      if (c.measured !== false && !c.passed && !firstSeen.has(c.name)) {
        firstSeen.set(c.name, { firstSeen: fmtDate(s.created_at), severity: severityOf(c) });
      }
    }
  }
  const latestChecks = toChecks(scans[0]);
  const passingNow = new Set(latestChecks.filter((c) => c.passed).map((c) => c.name));
  const issueHistory = [...firstSeen.entries()].map(([name, meta]) => ({
    id: name,
    name,
    severity: meta.severity,
    firstSeen: meta.firstSeen,
    resolved: passingNow.has(name),
  }));

  return {
    hasScans: true,
    host: hostOf(scans[0].url),
    timeline: timeline.reverse(), // newest-first for the table
    scoreSeries, // oldest-first for the chart
    issueHistory,
    scanCount: scans.length,
  };
}

export { DIMENSIONS };
