-- Visum — Supabase schema setup
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor).
-- Idempotent: safe to re-run.
--
-- This mirrors the live schema. Keep it in sync when you change the database.

-- ── scans ────────────────────────────────────────────────────────────
create table if not exists public.scans (
  id            uuid primary key default gen_random_uuid(),
  scan_id       text not null unique,
  url           text not null,
  total_score   integer not null,
  band          text not null,
  checks        jsonb not null,
  scan_time_ms  integer,
  email         text,
  created_at    timestamptz default now(),
  -- Set when a signed-in user runs the scan. Nullable: scans from the public
  -- funnel are anonymous and have no user.
  user_id       uuid references auth.users(id) on delete cascade
);

-- Columns added after the initial release
alter table public.scans
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists scans_url_idx              on public.scans (url);
create index if not exists scans_created_at_idx       on public.scans (created_at);
create index if not exists scans_total_score_idx      on public.scans (total_score);
-- "my scans, newest first"
create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────
-- With RLS on and no policies, the table is deny-all for anon/authenticated.
-- The service_role key bypasses RLS entirely, so the server-side API routes
-- keep working without an explicit policy (never add one for service_role —
-- it is unnecessary and only widens the surface).
alter table public.scans enable row level security;

drop policy if exists "Users can read their own scans" on public.scans;
create policy "Users can read their own scans"
  on public.scans for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can insert their own scans" on public.scans;
create policy "Users can insert their own scans"
  on public.scans for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own scans" on public.scans;
create policy "Users can update their own scans"
  on public.scans for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete their own scans" on public.scans;
create policy "Users can delete their own scans"
  on public.scans for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Superseded: the old service-role-only policy is redundant because the
-- service key bypasses RLS. Removed so it can't be mistaken for the
-- authorization model.
drop policy if exists "Service role access only" on public.scans;
