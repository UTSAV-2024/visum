-- Create scans table for email-gated results
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS scans (
  scan_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  email TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  band TEXT,
  checks JSONB,
  scan_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up scans by email
CREATE INDEX IF NOT EXISTS idx_scans_email ON scans (email);

-- Enable Row Level Security (recommended)
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Policy: only service_role can access scans (API routes use service key)
CREATE POLICY "Service role access only"
  ON scans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
