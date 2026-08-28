#!/usr/bin/env bash
# Apply Prisma migrations at build time.
#
# If the target database was created via `prisma db push` it has no
# _prisma_migrations history and `migrate deploy` fails with P3005.
# In that case we baseline every migration older than the cutoff below
# (already represented in the db-push schema), then deploy the rest.
set -uo pipefail

OUT=$(npx prisma migrate deploy 2>&1) && { echo "$OUT"; exit 0; }
echo "$OUT"

if ! grep -q "P3005" <<<"$OUT"; then
  echo "migrate deploy failed for a reason other than P3005 — aborting." >&2
  exit 1
fi

echo "No migration history found — baselining existing migrations..."
# Everything older than this cutoff is assumed to already be represented in
# the db-push-created schema; migrations from the cutoff onward actually run.
CUTOFF="20260828000000_community_engagement"
for m in $(ls -1 prisma/migrations | grep -E '^[0-9]' | sort); do
  if [[ ! "$m" < "$CUTOFF" ]]; then continue; fi
  npx prisma migrate resolve --applied "$m"
done

npx prisma migrate deploy
