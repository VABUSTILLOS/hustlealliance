#!/usr/bin/env bash
# Apply Prisma migrations at build time.
#
# If the target database was created via `prisma db push` it has no
# _prisma_migrations history and `migrate deploy` fails with P3005.
# In that case we baseline every migration EXCEPT the newest one
# (the one this deploy introduces), then deploy again.
set -uo pipefail

OUT=$(npx prisma migrate deploy 2>&1) && { echo "$OUT"; exit 0; }
echo "$OUT"

if ! grep -q "P3005" <<<"$OUT"; then
  echo "migrate deploy failed for a reason other than P3005 — aborting." >&2
  exit 1
fi

echo "No migration history found — baselining existing migrations..."
NEWEST=$(ls -1 prisma/migrations | grep -E '^[0-9]' | sort | tail -n 1)
for m in $(ls -1 prisma/migrations | grep -E '^[0-9]' | sort); do
  if [ "$m" = "$NEWEST" ]; then continue; fi
  npx prisma migrate resolve --applied "$m"
done

npx prisma migrate deploy
