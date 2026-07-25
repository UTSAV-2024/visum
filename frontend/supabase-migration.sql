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

-- Per-scan storage cost and outcome. storage_bytes is what makes storage
-- usage a measurement rather than a guess.
alter table public.scans
  add column if not exists storage_bytes bigint not null default 0,
  add column if not exists status        text   not null default 'completed';

alter table public.scans drop constraint if exists scans_status_ck;
alter table public.scans add constraint scans_status_ck
  check (status in ('completed', 'failed'));

-- Distinguish a user's own-site scans from scans they run of competitors.
-- Existing rows default to 'primary', so nothing changes for them.
alter table public.scans
  add column if not exists kind text not null default 'primary';

alter table public.scans drop constraint if exists scans_kind_ck;
alter table public.scans add constraint scans_kind_ck
  check (kind in ('primary', 'competitor'));

create index if not exists scans_user_kind_created_idx
  on public.scans (user_id, kind, created_at desc);

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

-- Scans are written exclusively by /api/scan under the service key, which is
-- also what stamps storage_bytes. Client insert/update policies would let a
-- signed-in user fabricate scan history and move their own storage figure, so
-- there are none. Reading and deleting your own scans stay: those are things
-- the owner is entitled to do.
drop policy if exists "Users can insert their own scans" on public.scans;
drop policy if exists "Users can update their own scans" on public.scans;

drop policy if exists "Users can delete their own scans" on public.scans;
create policy "Users can delete their own scans"
  on public.scans for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Superseded: the old service-role-only policy is redundant because the
-- service key bypasses RLS. Removed so it can't be mistaken for the
-- authorization model.
drop policy if exists "Service role access only" on public.scans;


-- ═════════════════════════════════════════════════════════════════════
-- Accounts: profiles, subscriptions, usage, payments
-- ═════════════════════════════════════════════════════════════════════

-- ── profiles ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── subscriptions ────────────────────────────────────────────────────
-- One row per user. `period_days` is null on Free, whose 3 scans are a
-- lifetime allowance that never resets; paid tiers carry a 7-day window.
create table if not exists public.subscriptions (
  user_id                  uuid primary key references auth.users(id) on delete cascade,
  tier                     text not null default 'free'
                             check (tier in ('free', 'pro', 'ultimate')),
  status                   text not null default 'active'
                             check (status in ('active', 'canceled', 'past_due', 'incomplete')),
  scan_limit               integer not null default 3 check (scan_limit >= 0),
  storage_limit_bytes      bigint  not null default 52428800 check (storage_limit_bytes >= 0),
  period_days              integer check (period_days is null or period_days > 0),
  period_start             timestamptz not null default now(),
  renewal_date             timestamptz,
  provider                 text,
  provider_customer_id     text,
  provider_subscription_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  -- A plan either recurs (both fields set) or is lifetime (neither is).
  constraint subscriptions_recurring_fields_ck
    check ((period_days is null) = (renewal_date is null))
);

-- ── usage ────────────────────────────────────────────────────────────
-- The scan counter is a reservation ledger, not a copy of the scans table:
-- it is claimed before a scan runs and released if the scan fails, which is
-- what makes the quota check race-safe. Storage is never stored here — it is
-- derived from scans by the storage_usage view below.
create table if not exists public.usage (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  scans_used   integer not null default 0 check (scans_used >= 0),
  period_start timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── payments (future-ready) ──────────────────────────────────────────
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  tier                text not null check (tier in ('pro', 'ultimate')),
  amount_cents        integer not null check (amount_cents >= 0),
  currency            text not null default 'usd',
  status              text not null default 'pending'
                        check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  provider            text,
  provider_payment_id text unique,
  created_at          timestamptz not null default now()
);

create index if not exists payments_user_id_created_at_idx
  on public.payments (user_id, created_at desc);

-- ── storage_usage ────────────────────────────────────────────────────
-- A view, not a table: storage is the sum of what each scan actually stored,
-- so there is exactly one source of truth. security_invoker makes it inherit
-- the caller's RLS on scans.
create or replace view public.storage_usage
  with (security_invoker = true) as
select
  user_id,
  sum(storage_bytes)::bigint as storage_used_bytes,
  count(*)::integer          as scan_count,
  max(created_at)            as last_scan_at
from public.scans
where user_id is not null
group by user_id;

grant select on public.storage_usage to authenticated, service_role;


-- ═════════════════════════════════════════════════════════════════════
-- Account provisioning
-- ═════════════════════════════════════════════════════════════════════

-- Every new account gets a profile, a Free plan and a counter. Google
-- sign-ins carry name/picture in raw_user_meta_data under different keys than
-- email sign-ups, so both spellings are read.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.usage (user_id)         values (new.id) on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the profile fresh when the identity provider updates it, without ever
-- overwriting a value the user has set with a null.
create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set email      = new.email,
         full_name  = coalesce(
                        new.raw_user_meta_data ->> 'full_name',
                        new.raw_user_meta_data ->> 'name',
                        profiles.full_name
                      ),
         avatar_url = coalesce(
                        new.raw_user_meta_data ->> 'avatar_url',
                        new.raw_user_meta_data ->> 'picture',
                        profiles.avatar_url
                      ),
         updated_at = now()
   where profiles.id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_user_updated();


-- ═════════════════════════════════════════════════════════════════════
-- Quota
-- ═════════════════════════════════════════════════════════════════════

-- Claims one scan for the user, or refuses. Everything happens inside one
-- transaction under a row lock, so two simultaneous requests can never both
-- spend the same last scan. Returns the fresh quota state either way.
create or replace function public.consume_scan_quota(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now     timestamptz := now();
  v_sub     public.subscriptions%rowtype;
  v_usage   public.usage%rowtype;
  v_periods integer;
  v_limit   integer;
begin
  if p_user_id is null then
    raise exception 'p_user_id is required';
  end if;

  -- Self-heal for accounts created before this schema existed.
  insert into public.subscriptions (user_id) values (p_user_id) on conflict (user_id) do nothing;
  insert into public.usage (user_id)         values (p_user_id) on conflict (user_id) do nothing;

  select * into v_sub   from public.subscriptions where user_id = p_user_id for update;
  select * into v_usage from public.usage         where user_id = p_user_id for update;

  -- Recurring plans reset automatically once the renewal date passes. The
  -- multiplier catches accounts that were idle for several whole periods.
  if v_sub.renewal_date is not null
     and v_sub.period_days is not null
     and v_sub.renewal_date <= v_now then

    v_periods := floor(
      extract(epoch from (v_now - v_sub.renewal_date)) / (v_sub.period_days * 86400)
    )::integer + 1;

    update public.subscriptions
       set period_start = v_sub.renewal_date
                          + make_interval(days => v_sub.period_days * (v_periods - 1)),
           renewal_date = v_sub.renewal_date
                          + make_interval(days => v_sub.period_days * v_periods),
           updated_at   = v_now
     where user_id = p_user_id
     returning * into v_sub;

    update public.usage
       set scans_used   = 0,
           period_start = v_sub.period_start,
           updated_at   = v_now
     where user_id = p_user_id
     returning * into v_usage;
  end if;

  -- A lapsed paid plan falls back to the Free allowance rather than locking
  -- the account out of its own data entirely.
  v_limit := case when v_sub.status = 'active' then v_sub.scan_limit else 3 end;

  if v_usage.scans_used >= v_limit then
    return jsonb_build_object(
      'allowed',         false,
      'reason',          'quota_exhausted',
      'tier',            v_sub.tier,
      'status',          v_sub.status,
      'scans_used',      v_usage.scans_used,
      'scan_limit',      v_limit,
      'scans_remaining', 0,
      'renewal_date',    v_sub.renewal_date
    );
  end if;

  update public.usage
     set scans_used = scans_used + 1,
         updated_at = v_now
   where user_id = p_user_id
   returning * into v_usage;

  return jsonb_build_object(
    'allowed',         true,
    'reason',          null,
    'tier',            v_sub.tier,
    'status',          v_sub.status,
    'scans_used',      v_usage.scans_used,
    'scan_limit',      v_limit,
    'scans_remaining', greatest(v_limit - v_usage.scans_used, 0),
    'renewal_date',    v_sub.renewal_date
  );
end;
$$;

-- Hands a reserved scan back when the scan itself failed. Only the server may
-- call this — a client that could reach it would have unlimited scans.
create or replace function public.release_scan_quota(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.usage
     set scans_used = greatest(scans_used - 1, 0),
         updated_at = now()
   where user_id = p_user_id;
end;
$$;

revoke all on function public.consume_scan_quota(uuid) from public, anon, authenticated;
revoke all on function public.release_scan_quota(uuid) from public, anon, authenticated;
grant execute on function public.consume_scan_quota(uuid) to service_role;
grant execute on function public.release_scan_quota(uuid) to service_role;

-- Trigger functions have no business being reachable over the REST API.
revoke all on function public.handle_new_user()     from public, anon, authenticated;
revoke all on function public.handle_user_updated() from public, anon, authenticated;


-- ═════════════════════════════════════════════════════════════════════
-- Row Level Security for the account tables
-- ═════════════════════════════════════════════════════════════════════
-- Users may read their own rows. Nothing here is client-writable except a
-- user's own profile: subscriptions, usage and payments are written only by
-- the server (the service key bypasses RLS), which is what keeps quota and
-- billing state out of reach of the browser.
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage         enable row level security;
alter table public.payments      enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
  on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can read their own usage" on public.usage;
create policy "Users can read their own usage"
  on public.usage for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Users can read their own payments" on public.payments;
create policy "Users can read their own payments"
  on public.payments for select to authenticated
  using (user_id = (select auth.uid()));


-- ── Backfill accounts that predate this schema ───────────────────────
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
on conflict (id) do nothing;

insert into public.subscriptions (user_id) select id from auth.users
on conflict (user_id) do nothing;

insert into public.usage (user_id) select id from auth.users
on conflict (user_id) do nothing;


-- ═════════════════════════════════════════════════════════════════════
-- Teams: organizations, members, invites (shared quota pool)
-- ═════════════════════════════════════════════════════════════════════

-- ── organizations ───────────────────────────────────────────────────
-- A team. The owner's subscription is the shared quota pool for everyone in
-- it. A user is "solo" until they create or join one of these.
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists organizations_owner_idx on public.organizations (owner_id);

-- ── organization_members ─────────────────────────────────────────────
-- One row per (org, user). A user belongs to at most one org for now — the
-- billing model assumes a single shared pool per person.
create table if not exists public.organization_members (
  org_id    uuid not null references public.organizations(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  role      text not null default 'member'
              check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz not null default now(),
  primary key (org_id, user_id),
  unique (user_id)  -- at most one org per user
);

create index if not exists org_members_user_idx on public.organization_members (user_id);
create index if not exists org_members_org_idx  on public.organization_members (org_id);

-- ── organization_invites ─────────────────────────────────────────────
-- A shareable, one-time-per-acceptance join link. No email is sent; the owner
-- copies the token and shares it however they like.
create table if not exists public.organization_invites (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations(id) on delete cascade,
  token      text not null unique,
  role       text not null default 'member'
               check (role in ('admin', 'member', 'viewer')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days'),
  revoked    boolean not null default false
);

create index if not exists org_invites_org_idx  on public.organization_invites (org_id);
create index if not exists org_invites_token_idx on public.organization_invites (token);

-- ── scans.org_id ─────────────────────────────────────────────────────
-- Null = a personal scan; set = a team scan visible to the whole org.
alter table public.scans
  add column if not exists org_id uuid references public.organizations(id) on delete set null;

create index if not exists scans_org_created_idx
  on public.scans (org_id, created_at desc) where org_id is not null;

-- ── Billing / membership helpers ─────────────────────────────────────
-- Resolve who pays for a user's scans and which org the scan belongs to.
-- Solo → (self, null). Team member → (org owner, org). Server-only.
create or replace function public.resolve_billing(p_user_id uuid)
returns table (billing_user_id uuid, org_id uuid)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(o.owner_id, p_user_id) as billing_user_id,
    m.org_id                        as org_id
  from (select p_user_id) s
  left join public.organization_members m on m.user_id = p_user_id
  left join public.organizations o        on o.id = m.org_id;
$$;

-- The caller's own org ids. Parameterless (reads auth.uid()) so it can't be
-- used to probe another user's memberships. Used inside RLS policies.
create or replace function public.my_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.organization_members where user_id = (select auth.uid());
$$;

revoke all on function public.resolve_billing(uuid) from public, anon, authenticated;
grant execute on function public.resolve_billing(uuid) to service_role;
grant execute on function public.my_org_ids() to authenticated, service_role;

-- ── RLS: team tables read-only from the browser; writes are server-side ──
alter table public.organizations        enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invites enable row level security;

drop policy if exists "Members read their organization" on public.organizations;
create policy "Members read their organization"
  on public.organizations for select to authenticated
  using (id in (select public.my_org_ids()));

drop policy if exists "Members read their org roster" on public.organization_members;
create policy "Members read their org roster"
  on public.organization_members for select to authenticated
  using (org_id in (select public.my_org_ids()));

drop policy if exists "Members read their org invites" on public.organization_invites;
create policy "Members read their org invites"
  on public.organization_invites for select to authenticated
  using (org_id in (select public.my_org_ids()));

-- Broaden scans SELECT to team scans: your own rows, plus any scan in your org.
drop policy if exists "Users can read their own scans" on public.scans;
drop policy if exists "Users can read their own or team scans" on public.scans;
create policy "Users can read their own or team scans"
  on public.scans for select to authenticated
  using (
    user_id = (select auth.uid())
    or (org_id is not null and org_id in (select public.my_org_ids()))
  );
