import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scan_id, url, email, total_score, band, checks, scan_time_ms } = req.body;

  if (!email || !url || typeof total_score !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Update or insert scan record by scan_id
  const { error } = await supabase.from("scans").upsert(
    {
      scan_id,
      url,
      email: email.toLowerCase().trim(),
      total_score,
      band,
      checks,
      scan_time_ms,
      created_at: new Date().toISOString(),
    },
    { onConflict: "scan_id" }
  );

  if (error) {
    console.error("Supabase save-scan error:", error);
    return res.status(500).json({ error: "Failed to save scan data" });
  }

  res.status(200).json({ ok: true });
}
