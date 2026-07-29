-- ═══════════════════════════════════════════════════════════════════════
-- Full-Text Search Migration for Hustle Alliance Community Module
-- Requires: pg_trgm extension, tsvector on all searchable entities
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Enable extensions ──────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Text search configuration (unaccented English) ─────────────────────

CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS ha_search (COPY = english);
ALTER TEXT SEARCH CONFIGURATION ha_search
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, english_stem;

-- 3. tsvector columns ────────────────────────────────────────────────────

-- Users: search on name, username, bio, headline
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CommunityPost: search on content
ALTER TABLE "CommunityPost" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CommunityGroup: search on name, description
ALTER TABLE "CommunityGroup" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Event: search on title, description
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- JobListing: search on title, company, description
ALTER TABLE "JobListing" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Product: search on title, description
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 4. Populate initial tsvector values ────────────────────────────────────

UPDATE "User" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(username, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(bio, '')), 'B') ||
  setweight(to_tsvector('ha_search', COALESCE(headline, '')), 'B');

UPDATE "CommunityPost" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(content, '')), 'A');

UPDATE "CommunityGroup" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(description, '')), 'B');

UPDATE "Event" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(description, '')), 'B');

UPDATE "JobListing" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(company, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(description, '')), 'B');

UPDATE "Product" SET search_vector =
  setweight(to_tsvector('ha_search', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('ha_search', COALESCE(description, '')), 'B');

-- 5. GIN indexes ────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_user_search ON "User" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_post_search ON "CommunityPost" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_group_search ON "CommunityGroup" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_event_search ON "Event" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_job_search ON "JobListing" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_product_search ON "Product" USING GIN (search_vector);

-- 6. Trigrams indexes (for fuzzy LIKE/ILIKE queries) ────────────────────

CREATE INDEX IF NOT EXISTS idx_user_name_trgm ON "User" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_user_username_trgm ON "User" USING GIN (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_group_name_trgm ON "CommunityGroup" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_event_title_trgm ON "Event" USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_job_title_trgm ON "JobListing" USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_title_trgm ON "Product" USING GIN (title gin_trgm_ops);

-- 7. Triggers: keep tsvector updated automatically ──────────────────────

CREATE OR REPLACE FUNCTION user_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.username, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.headline, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION post_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.content, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION group_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION event_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION job_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.company, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION product_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('ha_search', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('ha_search', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_search ON "User";
CREATE TRIGGER trg_user_search
  BEFORE INSERT OR UPDATE OF name, username, bio, headline ON "User"
  FOR EACH ROW EXECUTE FUNCTION user_search_update();

DROP TRIGGER IF EXISTS trg_post_search ON "CommunityPost";
CREATE TRIGGER trg_post_search
  BEFORE INSERT OR UPDATE OF content ON "CommunityPost"
  FOR EACH ROW EXECUTE FUNCTION post_search_update();

DROP TRIGGER IF EXISTS trg_group_search ON "CommunityGroup";
CREATE TRIGGER trg_group_search
  BEFORE INSERT OR UPDATE OF name, description ON "CommunityGroup"
  FOR EACH ROW EXECUTE FUNCTION group_search_update();

DROP TRIGGER IF EXISTS trg_event_search ON "Event";
CREATE TRIGGER trg_event_search
  BEFORE INSERT OR UPDATE OF title, description ON "Event"
  FOR EACH ROW EXECUTE FUNCTION event_search_update();

DROP TRIGGER IF EXISTS trg_job_search ON "JobListing";
CREATE TRIGGER trg_job_search
  BEFORE INSERT OR UPDATE OF title, company, description ON "JobListing"
  FOR EACH ROW EXECUTE FUNCTION job_search_update();

DROP TRIGGER IF EXISTS trg_product_search ON "Product";
CREATE TRIGGER trg_product_search
  BEFORE INSERT OR UPDATE OF title, description ON "Product"
  FOR EACH ROW EXECUTE FUNCTION product_search_update();

-- 8. Unified search function ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION unified_search(
  search_term text,
  entity_types text[] DEFAULT ARRAY['user', 'post', 'group', 'event', 'job', 'product'],
  result_limit int DEFAULT 20,
  result_offset int DEFAULT 0
) RETURNS TABLE(
  entity_type text,
  entity_id   text,
  rank        real,
  title       text,
  subtitle    text,
  avatar_url  text,
  created_at  timestamptz
) AS $$
BEGIN
  RETURN QUERY
  -- Users
  SELECT 'user'::text, u.id, ts_rank(u.search_vector, query) AS rank,
         u.name, COALESCE(u.headline, u.bio, ''), u.avatar, u."createdAt"
  FROM "User" u, to_tsquery('ha_search', search_term) query
  WHERE 'user' = ANY(entity_types)
    AND u.search_vector @@ query

  UNION ALL

  -- Posts
  SELECT 'post'::text, p.id, ts_rank(p.search_vector, query) AS rank,
         LEFT(p.content, 100), u.name, u.avatar, p."createdAt"
  FROM "CommunityPost" p
  JOIN "User" u ON u.id = p."authorId",
       to_tsquery('ha_search', search_term) query
  WHERE 'post' = ANY(entity_types)
    AND p.search_vector @@ query

  UNION ALL

  -- Groups
  SELECT 'group'::text, g.id, ts_rank(g.search_vector, query) AS rank,
         g.name, COALESCE(g.description, ''), g.avatar, g."createdAt"
  FROM "CommunityGroup" g, to_tsquery('ha_search', search_term) query
  WHERE 'group' = ANY(entity_types)
    AND g.search_vector @@ query

  UNION ALL

  -- Events
  SELECT 'event'::text, e.id, ts_rank(e.search_vector, query) AS rank,
         e.title, COALESCE(e.description, ''), e."coverImage", e."createdAt"
  FROM "Event" e, to_tsquery('ha_search', search_term) query
  WHERE 'event' = ANY(entity_types)
    AND e.search_vector @@ query

  UNION ALL

  -- Jobs
  SELECT 'job'::text, j.id, ts_rank(j.search_vector, query) AS rank,
         j.title, j.company, NULL::text, j."createdAt"
  FROM "JobListing" j, to_tsquery('ha_search', search_term) query
  WHERE 'job' = ANY(entity_types)
    AND j.search_vector @@ query

  UNION ALL

  -- Products
  SELECT 'product'::text, pr.id, ts_rank(pr.search_vector, query) AS rank,
         pr.title, COALESCE(pr.description, ''), NULL::text, pr."createdAt"
  FROM "Product" pr, to_tsquery('ha_search', search_term) query
  WHERE 'product' = ANY(entity_types)
    AND pr.search_vector @@ query

  ORDER BY rank DESC
  LIMIT result_limit OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;
