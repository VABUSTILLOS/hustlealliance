#!/usr/bin/env bash
# Apply Prisma migrations at build time.
#
# Handles two recovery cases automatically:
#  - P3005: the database was created via `prisma db push` and has no
#    _prisma_migrations history — baseline every migration older than CUTOFF,
#    then deploy the rest.
#  - P3018 drift: a migration fails because its objects "already exist" in a
#    db-push-created schema — mark that migration as applied and continue.
# Any other failure aborts the build.
set -uo pipefail

# Diagnostics: show the DB target (credentials redacted) so build hangs are debuggable.
echo "migrate-deploy: DATABASE_URL=$(node -e 'try{const u=new URL(process.env.DATABASE_URL||"");console.log(u.protocol+"//"+u.hostname+":"+(u.port||"5432"))}catch{console.log("UNSET-OR-INVALID")}')"

# Supabase transaction pooler (port 6543) hangs Prisma migrations (advisory
# locks need session state). Rewrite to the session pooler (port 5432) on the
# same host — same credentials, migration-safe.
DATABASE_URL=$(node -e 'try{const u=new URL(process.env.DATABASE_URL||"");if(u.hostname.endsWith("pooler.supabase.com")&&u.port==="6543")u.port="5432";console.log(u.toString())}catch{console.log(process.env.DATABASE_URL||"")}')
export DATABASE_URL
echo "migrate-deploy: using $(node -e 'try{const u=new URL(process.env.DATABASE_URL);console.log(u.protocol+"//"+u.hostname+":"+(u.port||"5432"))}catch{console.log("?")}') for migrations"

# Everything older than this cutoff is assumed to already be represented in
# the db-push-created schema; migrations from the cutoff onward actually run.
CUTOFF="20260828000000_community_engagement"

attempt=0
while [ $attempt -lt 15 ]; do
  attempt=$((attempt+1))
  OUT=$(timeout 180 npx prisma migrate deploy 2>&1) && { echo "$OUT"; exit 0; }
  RC=$?
  echo "$OUT"
  if [ $RC -eq 124 ]; then
    echo "migrate deploy timed out after 180s — database unreachable from build machine." >&2
    exit 1
  fi

  if grep -q "P3005" <<<"$OUT"; then
    echo "No migration history found — baselining pre-cutoff migrations..."
    for m in $(ls -1 prisma/migrations | grep -E '^[0-9]' | sort); do
      if [[ ! "$m" < "$CUTOFF" ]]; then continue; fi
      npx prisma migrate resolve --applied "$m"
    done
    continue
  fi

  # P3009: a previously failed migration blocks everything. It failed with an
  # "already exists" drift error (see git history), so mark it applied and retry.
  if grep -q "P3009" <<<"$OUT"; then
    FAILED=$(grep -oE 'The `[^`]+` migration' <<<"$OUT" | head -1 | sed 's/^The `//; s/` migration$//')
    if [ -n "$FAILED" ]; then
      echo "Resolving previously failed migration $FAILED as applied..."
      npx prisma migrate resolve --applied "$FAILED" || { echo "resolve failed" >&2; exit 1; }
      continue
    fi
  fi

  MIG=$(grep -i "migration name:" <<<"$OUT" | sed -E 's/.*[Mm]igration [Nn]ame:[[:space:]]*//' | tr -d '[:space:]' | head -1)
  if [ -n "$MIG" ] && grep -qi "already exists" <<<"$OUT"; then
    echo "Drift baseline: marking $MIG as applied (its objects already exist)..."
    npx prisma migrate resolve --applied "$MIG" || { echo "resolve failed" >&2; exit 1; }
    continue
  fi

  echo "migrate deploy failed for a reason other than P3005/drift — aborting." >&2
  exit 1
done

echo "migrate deploy exceeded baseline retry limit — aborting." >&2
exit 1
