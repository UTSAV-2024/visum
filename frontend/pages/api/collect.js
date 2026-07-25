/**
 * Ingest endpoint for AI-crawler hits on a customer's site.
 *
 * This is called from the *customer's* server (middleware, a Cloudflare
 * Worker, or a log shipper) — never from a browser. That is not a style
 * preference: most AI crawlers do not execute JavaScript, which is the very
 * thing Visum's JS-rendering check measures, so a client-side pixel would
 * record almost none of the traffic this page is about.
 *
 * Authentication is the site's ingest key, which grants exactly one power:
 * appending visits for its own site. It cannot read anything.
 */
import { getSupabaseAdminClient } from "../../lib/supabase/admin";
import { identifyBot } from "../../lib/server/bot-detection";
import { createHash } from "node:crypto";

// One report can carry a batch, so a busy site isn't one request per hit.
const MAX_BATCH = 200;
const MAX_UA_LENGTH = 512;
const MAX_PATH_LENGTH = 2048;

/**
 * Salted so the table never holds anything that reverses to an address. Falls
 * back to the service key (already server-only) when no dedicated salt is set,
 * so hashing is never silently skipped.
 */
const IP_SALT =
  process.env.BOT_IP_SALT || process.env.SUPABASE_SERVICE_KEY || "visum-fallback-salt";

function hashIp(ip) {
  if (!ip) return null;
  return createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex").slice(0, 32);
}

function trim(value, max) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  return v.length > max ? v.slice(0, max) : v;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = trim(
    req.headers["x-visum-key"] || req.body?.key,
    128
  );
  if (!key) {
    return res.status(401).json({ error: "Missing ingest key." });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return res.status(503).json({ error: "Collection is temporarily unavailable." });
  }

  const { data: site, error: siteError } = await admin
    .from("tracked_sites")
    .select("id, user_id")
    .eq("ingest_key", key)
    .maybeSingle();

  if (siteError) {
    console.error("[api/collect] site lookup failed:", siteError.message);
    return res.status(503).json({ error: "Collection is temporarily unavailable." });
  }
  if (!site) {
    // Deliberately identical shape to a missing key: a caller probing keys
    // learns nothing about which ones exist.
    return res.status(401).json({ error: "Invalid ingest key." });
  }

  // Accept either a single hit or a batch.
  const body = req.body || {};
  const rawHits = Array.isArray(body.hits) ? body.hits : [body];
  if (rawHits.length === 0) {
    return res.status(400).json({ error: "No hits supplied." });
  }
  if (rawHits.length > MAX_BATCH) {
    return res.status(413).json({ error: `Send at most ${MAX_BATCH} hits per request.` });
  }

  const rows = [];
  let skipped = 0;

  for (const hit of rawHits) {
    const userAgent = trim(hit?.ua || hit?.userAgent, MAX_UA_LENGTH);
    const bot = identifyBot(userAgent);

    // Not an AI crawler — the customer's ordinary traffic is none of our
    // business and storing it would be both noise and a privacy liability.
    if (!bot) {
      skipped += 1;
      continue;
    }

    const status = Number.isInteger(hit?.status) ? hit.status : null;

    rows.push({
      site_id: site.id,
      user_id: site.user_id,
      bot: bot.name,
      user_agent: userAgent,
      path: trim(hit?.path, MAX_PATH_LENGTH),
      status,
      ip_hash: hashIp(trim(hit?.ip, 64)),
      // The user-agent alone is a claim, not proof. Until the source IP is
      // checked against the vendor's published ranges, this stays false.
      verified: false,
    });
  }

  if (rows.length === 0) {
    return res.status(200).json({ recorded: 0, skipped });
  }

  const { error: insertError } = await admin.from("bot_visits").insert(rows);
  if (insertError) {
    console.error("[api/collect] insert failed:", insertError.message);
    return res.status(503).json({ error: "Could not record visits." });
  }

  return res.status(200).json({ recorded: rows.length, skipped });
}
