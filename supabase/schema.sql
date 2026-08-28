-- ============================================================================
-- Hustle Alliance — 2-Tier Membership & Armory Schema
-- PostgreSQL / Supabase
--
-- Tiers:
--   * basic  ("Solo Operator", $0)     — discovery portal, free tools, community
--   * pro    ("Tactical Armory", $97–$147/mo) — monthly LTD keys, n8n blueprints,
--                                             Next.js starters, cloud perks
--
-- RLS guarantees: Basic members can NEVER read Pro armory drops or license keys.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.membership_tier as enum ('basic', 'pro');

create type public.armory_drop_category as enum (
  'ltd_key',          -- handpicked lifetime deal software key
  'n8n_blueprint',    -- done-for-you n8n automation blueprint
  'nextjs_starter',   -- production-ready Next.js code starter
  'cloud_perk'        -- enterprise cloud credits / perks
);

-- ----------------------------------------------------------------------------
-- profiles — user metadata + tier
-- ----------------------------------------------------------------------------
create table public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  username        text unique,
  display_name    text,
  avatar_url      text,
  membership_tier public.membership_tier not null default 'basic',
  tier_updated_at timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on column public.profiles.membership_tier is
  'basic = Solo Operator (free), pro = Tactical Armory (paid). Only the service role may change this.';

-- Auto-provision a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- armory_drops — monthly Pro drops (LTD keys, blueprints, starters, perks)
-- ----------------------------------------------------------------------------
create table public.armory_drops (
  id            uuid primary key default gen_random_uuid(),
  drop_month    date not null unique,        -- e.g. 2026-09-01 (first of month)
  title         text not null,
  software_name text,                        -- vendor/product name for LTD drops
  category      public.armory_drop_category not null,
  description   text,
  valuation_usd numeric(10, 2) not null default 0
    check (valuation_usd >= 0),
  asset_urls    jsonb not null default '{}'::jsonb,
  -- asset_urls shape: { "license_pool": [...], "n8n_json": "...", "nextjs_repo": "...", "docs": "..." }
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger armory_drops_set_updated_at
  before update on public.armory_drops
  for each row execute function public.set_updated_at();

create index armory_drops_drop_month_idx on public.armory_drops (drop_month desc);
create index armory_drops_category_idx on public.armory_drops (category);

-- ----------------------------------------------------------------------------
-- member_licenses — user redemption of monthly LTD keys
-- ----------------------------------------------------------------------------
create table public.member_licenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  drop_id     uuid not null references public.armory_drops (id) on delete cascade,
  license_key text not null,
  redeemed_at timestamptz not null default now(),
  -- Strict: one redemption per user per drop
  constraint member_licenses_user_drop_unique unique (user_id, drop_id),
  -- Strict: a license key can only be issued once per drop
  constraint member_licenses_drop_key_unique unique (drop_id, license_key)
);

create index member_licenses_user_idx on public.member_licenses (user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Helper: is the current user a Pro member?
-- security definer so policies on other tables can check the tier without
-- triggering recursive RLS on profiles.
create or replace function public.is_pro()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and membership_tier = 'pro'
  );
$$;

-- ----------------------------------------------------------------------------
-- profiles policies
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile, but NOT their tier.
-- Tier changes happen server-side via the service role (which bypasses RLS).
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and membership_tier = (select p.membership_tier from public.profiles p where p.id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- armory_drops policies — Pro-only reads
-- ----------------------------------------------------------------------------
alter table public.armory_drops enable row level security;

-- ONLY Pro members can see published drops. Basic members get zero rows.
create policy "armory_drops_select_pro_only"
  on public.armory_drops for select
  using (is_published and public.is_pro());

-- No insert/update/delete policies → clients cannot write.
-- Admin/curation happens via the service role, which bypasses RLS.

-- ----------------------------------------------------------------------------
-- member_licenses policies
-- ----------------------------------------------------------------------------
alter table public.member_licenses enable row level security;

-- Users can read only their own redeemed keys (Basic members have none,
-- and can never see other members' keys).
create policy "member_licenses_select_own"
  on public.member_licenses for select
  using (auth.uid() = user_id);

-- Users can redeem only for themselves, only while Pro, and only from a
-- published drop. The unique(user_id, drop_id) constraint enforces one
-- redemption per drop at the database level.
create policy "member_licenses_insert_pro_own"
  on public.member_licenses for insert
  with check (
    auth.uid() = user_id
    and public.is_pro()
    and exists (
      select 1
      from public.armory_drops d
      where d.id = drop_id
        and d.is_published
    )
  );

-- No update/delete policies → redemptions are immutable from the client.

-- ----------------------------------------------------------------------------
-- profiles tier index (used by is_pro lookups and admin segmentation)
-- ----------------------------------------------------------------------------
create index profiles_membership_tier_idx on public.profiles (membership_tier);
