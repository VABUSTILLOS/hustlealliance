-- ═══════════════════════════════════════════════════════════════════════
-- Phase 8: PostgreSQL Full-Text Search
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Enable pg_trgm extension for trigram fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. Add tsvector columns to searchable tables
-- ═══════════════════════════════════════════════════════════════════════

-- User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CommunityPost
ALTER TABLE "CommunityPost"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- CommunityGroup
ALTER TABLE "CommunityGroup"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Event
ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- JobListing
ALTER TABLE "JobListing"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- ═══════════════════════════════════════════════════════════════════════
-- 3. Create GIN indexes on search_vector columns
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_user_search ON "User" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_post_search ON "CommunityPost" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_group_search ON "CommunityGroup" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_event_search ON "Event" USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_job_search ON "JobListing" USING GIN (search_vector);

-- Trigram indexes for fuzzy / ILIKE fallback
CREATE INDEX IF NOT EXISTS idx_user_name_trgm ON "User" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_post_content_trgm ON "CommunityPost" USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_group_name_trgm ON "CommunityGroup" USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_event_title_trgm ON "Event" USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_job_title_trgm ON "JobListing" USING GIN (title gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- 4. Create trigger function to auto-update search_vector
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    CASE TG_TABLE_NAME
      WHEN 'User' THEN
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.username, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.headline, '')), 'D')
      WHEN 'CommunityPost' THEN
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'A')
      WHEN 'CommunityGroup' THEN
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B')
      WHEN 'Event' THEN
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B')
      WHEN 'JobListing' THEN
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.company, '')), 'C')
      ELSE
        to_tsvector('english', '')
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════
-- 5. Create triggers on each table for INSERT/UPDATE
-- ═══════════════════════════════════════════════════════════════════════

-- User
DROP TRIGGER IF EXISTS trg_user_search_vector ON "User";
CREATE TRIGGER trg_user_search_vector
  BEFORE INSERT OR UPDATE OF name, username, bio, headline ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- CommunityPost
DROP TRIGGER IF EXISTS trg_post_search_vector ON "CommunityPost";
CREATE TRIGGER trg_post_search_vector
  BEFORE INSERT OR UPDATE OF content ON "CommunityPost"
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- CommunityGroup
DROP TRIGGER IF EXISTS trg_group_search_vector ON "CommunityGroup";
CREATE TRIGGER trg_group_search_vector
  BEFORE INSERT OR UPDATE OF name, description ON "CommunityGroup"
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Event
DROP TRIGGER IF EXISTS trg_event_search_vector ON "Event";
CREATE TRIGGER trg_event_search_vector
  BEFORE INSERT OR UPDATE OF title, description ON "Event"
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- JobListing
DROP TRIGGER IF EXISTS trg_job_search_vector ON "JobListing";
CREATE TRIGGER trg_job_search_vector
  BEFORE INSERT OR UPDATE OF title, description, company ON "JobListing"
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ═══════════════════════════════════════════════════════════════════════
-- 6. Backfill existing rows with search_vector data
-- ═══════════════════════════════════════════════════════════════════════

UPDATE "User" SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(username, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(bio, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(headline, '')), 'D')
WHERE search_vector IS NULL;

UPDATE "CommunityPost" SET search_vector =
  setweight(to_tsvector('english', COALESCE(content, '')), 'A')
WHERE search_vector IS NULL;

UPDATE "CommunityGroup" SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B')
WHERE search_vector IS NULL;

UPDATE "Event" SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B')
WHERE search_vector IS NULL;

UPDATE "JobListing" SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(company, '')), 'C')
WHERE search_vector IS NULL;

-- ═══════════════════════════════════════════════════════════════════════
-- 7. Unified search function (used by $queryRaw)
-- ═══════════════════════════════════════════════════════════════════════

-- Drop old function if it exists
DROP FUNCTION IF EXISTS unified_search(text, text[], integer, integer);

CREATE OR REPLACE FUNCTION unified_search(
  search_term text,
  entity_types text[],
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
) RETURNS TABLE(
  "entityType" text,
  "entityId" text,
  rank real,
  title text,
  subtitle text,
  "avatarUrl" text,
  "createdAt" timestamp,
  snippet text
) AS $$
DECLARE
  tsquery_term tsquery;
BEGIN
  -- Convert the pre-sanitized term to tsquery
  tsquery_term := to_tsquery('english', search_term);

  RETURN QUERY
  -- Users
  SELECT
    'user'::text AS "entityType",
    u.id::text AS "entityId",
    ts_rank(u.search_vector, tsquery_term) AS rank,
    u.name AS title,
    COALESCE(u.headline, u.username, '') AS subtitle,
    u.avatar AS "avatarUrl",
    u."createdAt",
    ts_headline('english', COALESCE(u.bio, ''), tsquery_term, 'MaxWords=25, MinWords=10, ShortWord=3, MaxFragments=2, FragmentDelimiter=…') AS snippet
  FROM "User" u
  WHERE 'user' = ANY(entity_types)
    AND u.search_vector @@ tsquery_term

  UNION ALL

  -- Posts
  SELECT
    'post'::text AS "entityType",
    p.id::text AS "entityId",
    ts_rank(p.search_vector, tsquery_term) AS rank,
    left(p.content, 100) AS title,
    u.name AS subtitle,
    u.avatar AS "avatarUrl",
    p."createdAt",
    ts_headline('english', p.content, tsquery_term, 'MaxWords=25, MinWords=10, ShortWord=3, MaxFragments=2, FragmentDelimiter=…') AS snippet
  FROM "CommunityPost" p
  JOIN "User" u ON u.id = p."authorId"
  WHERE 'post' = ANY(entity_types)
    AND p.visibility = 'PUBLIC'
    AND p.search_vector @@ tsquery_term

  UNION ALL

  -- Groups
  SELECT
    'group'::text AS "entityType",
    g.id::text AS "entityId",
    ts_rank(g.search_vector, tsquery_term) AS rank,
    g.name AS title,
    COALESCE(g.description, '') AS subtitle,
    g.avatar AS "avatarUrl",
    g."createdAt",
    ts_headline('english', COALESCE(g.description, ''), tsquery_term, 'MaxWords=25, MinWords=10, ShortWord=3, MaxFragments=2, FragmentDelimiter=…') AS snippet
  FROM "CommunityGroup" g
  WHERE 'group' = ANY(entity_types)
    AND g.visibility = 'PUBLIC'
    AND g.search_vector @@ tsquery_term

  UNION ALL

  -- Events
  SELECT
    'event'::text AS "entityType",
    e.id::text AS "entityId",
    ts_rank(e.search_vector, tsquery_term) AS rank,
    e.title AS title,
    COALESCE(e.description, '') AS subtitle,
    e."coverImage" AS "avatarUrl",
    e."createdAt",
    ts_headline('english', COALESCE(e.description, ''), tsquery_term, 'MaxWords=25, MinWords=10, ShortWord=3, MaxFragments=2, FragmentDelimiter=…') AS snippet
  FROM "Event" e
  WHERE 'event' = ANY(entity_types)
    AND e.search_vector @@ tsquery_term

  UNION ALL

  -- Jobs
  SELECT
    'job'::text AS "entityType",
    j.id::text AS "entityId",
    ts_rank(j.search_vector, tsquery_term) AS rank,
    j.title AS title,
    j.company AS subtitle,
    NULL::text AS "avatarUrl",
    j."createdAt",
    ts_headline('english', COALESCE(j.description, ''), tsquery_term, 'MaxWords=25, MinWords=10, ShortWord=3, MaxFragments=2, FragmentDelimiter=…') AS snippet
  FROM "JobListing" j
  WHERE 'job' = ANY(entity_types)
    AND j.status = 'OPEN'
    AND j.search_vector @@ tsquery_term

  ORDER BY rank DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;
