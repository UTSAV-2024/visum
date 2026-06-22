import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { event, properties } = req.body;

  try {
    await supabase.from("events").insert({
      event,
      properties,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ ok: true });
}