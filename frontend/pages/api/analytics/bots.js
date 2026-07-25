/**
 * Real AI-crawler analytics for the signed-in user.
 *
 * Everything here is counted from rows the customer's own server reported.
 * When nothing has been reported the response says so explicitly rather than
 * returning zeroes, because "no data yet" and "zero visits" mean very
 * different things and the UI must not present the first as the second.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { KNOWN_BOTS } from "../../../lib/server/bot-detection";

const MAX_DAYS = 365;
const DEFAULT_DAYS = 30;
// Guards the page against unbounded reads on a busy site.
const ROW_CAP = 10000;

function dayKey(iso) {
  return iso.slice(0, 10);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Sign in first.", code: "unauthenticated" });
  }

  const requested = Number.parseInt(req.query.days, 10);
  const days = Number.isFinite(requested)
    ? Math.min(Math.max(requested, 1), MAX_DAYS)
    : DEFAULT_DAYS;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return res.status(503).json({ error: "Analytics are temporarily unavailable." });
  }

  const since = new Date(Date.now() - days * 86400_000).toISOString();

  const [sitesRes, visitsRes] = await Promise.all([
    admin.from("tracked_sites").select("id, domain, created_at").eq("user_id", user.id),
    admin
      .from("bot_visits")
      .select("bot, path, created_at, verified")
      .eq("user_id", user.id)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(ROW_CAP),
  ]);

  if (sitesRes.error || visitsRes.error) {
    console.error(
      "[api/analytics/bots] query failed:",
      sitesRes.error?.message || visitsRes.error?.message
    );
    return res.status(503).json({ error: "Could not load analytics." });
  }

  const sites = sitesRes.data || [];
  const visits = visitsRes.data || [];

  // Two distinct empty states the UI has to tell apart.
  if (sites.length === 0) {
    return res.status(200).json({
      state: "no_site",
      days,
      sites: [],
      totals: { visits: 0, verified: 0, bots: 0 },
      byBot: [],
      timeline: [],
      topPaths: [],
      knownBots: KNOWN_BOTS,
    });
  }

  const byBot = new Map();
  const byDay = new Map();
  const byPath = new Map();
  let verified = 0;

  for (const v of visits) {
    byBot.set(v.bot, (byBot.get(v.bot) || 0) + 1);
    const day = dayKey(v.created_at);
    byDay.set(day, (byDay.get(day) || 0) + 1);
    if (v.path) byPath.set(v.path, (byPath.get(v.path) || 0) + 1);
    if (v.verified) verified += 1;
  }

  // A continuous series, so a quiet day reads as a gap in traffic rather than
  // vanishing from the chart.
  const timeline = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    timeline.push({ date: d, visits: byDay.get(d) || 0 });
  }

  const meta = new Map(KNOWN_BOTS.map((b) => [b.name, b]));

  return res.status(200).json({
    state: visits.length === 0 ? "no_data" : "ok",
    days,
    // Flagged so the UI can say the count is a floor, not a total.
    truncated: visits.length >= ROW_CAP,
    sites: sites.map((s) => ({ id: s.id, domain: s.domain })),
    totals: {
      visits: visits.length,
      verified,
      bots: byBot.size,
    },
    byBot: [...byBot.entries()]
      .map(([name, count]) => ({
        name,
        count,
        vendor: meta.get(name)?.vendor || "Unknown",
        purpose: meta.get(name)?.purpose || "unknown",
      }))
      .sort((a, b) => b.count - a.count),
    timeline,
    topPaths: [...byPath.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    knownBots: KNOWN_BOTS,
  });
}
