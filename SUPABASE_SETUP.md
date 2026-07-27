# Supabase Setup — Manual Dashboard Steps

Project: `yftgdtdvmvvqyzcdntge` (hustlealliance)

## Realtime Replication

The LMS uses Supabase Realtime for two features:
- **Community feed** — new posts appear live via `postgres_changes` on `CommunityPost`
- **Live class presence** — attendees broadcast their presence via Broadcast channels

### Enable Table Replication

1. Go to [Supabase Dashboard → Replication](https://supabase.com/dashboard/project/yftgdtdvmvvqyzcdntge/database/replication)
2. Under "Source" tables, enable replication for:
   - ✅ `CommunityPost`
   - ✅ `CommunityComment`
3. Click "Apply changes"


## Row Level Security (RLS)

All 29 public tables now have RLS policies defined. To apply:

1. Go to [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/yftgdtdvmvvqyzcdntge/sql/new)
2. Copy and paste the contents of `supabase/migrations/rls_policies.sql`
3. Click "Run"

**Policy summary:**

| Group | Tables | SELECT | INSERT/UPDATE/DELETE |
|---|---|---|---|
| Public Read | Category, Badge, Course, Module, Lesson, Attachments, LiveClass | Anyone | Authenticated only |
| Auth Read | Quiz, QuizQuestion, QuizAnswer, CommunityPost, CommunityComment | Authenticated | Own rows only |
| User-Scoped | Enrollment, LessonProgress, QuizAttempt, EarnedBadge, Certificate, XPTransaction, Streak, Notification, ContentRelease, LiveClassRegistration | Own rows only | Own rows only |
| Server-Only | User, Order, Entitlement, DripSettings, DripOverride, Prerequisite | Restricted | Blocked (Prisma only) |

> **Note:** The app accesses all tables through Prisma on the server side (API routes), which bypasses RLS. These policies are defense-in-depth against direct PostgREST access via the anon key.

### Verify

After enabling, check the [Realtime logs](https://supabase.com/dashboard/project/yftgdtdvmvvqyzcdntge/reports/realtime-logs) for channel subscription events.

---

## Database Connection

### Pooler (Vercel-friendly)
The connection uses Supavisor session pooler on port 6543:
```
postgresql://app_user.yftgdtdvmvvqyzcdntge:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=no-verify
```

### Direct Connection (IPv6 only — does NOT work on Vercel)
```
postgresql://postgres.yftgdtdvmvvqyzcdntge:[password]@db.yftgdtdvmvvqyzcdntge.supabase.co:5432/postgres
```

---

## Auth

- Supabase Auth with SSR (`@supabase/ssr`) via `lib/supabase/server.ts` and `proxy.ts`
- Redirect URLs configured in [Auth → URL Configuration](https://supabase.com/dashboard/project/yftgdtdvmvvqyzcdntge/auth/url-configuration)
- Production: `https://hustlealliance.com/**`
- Preview deploys: `https://hustlealliance-*.vercel.app/**`

---

## Storage

Course media and user avatars stored in Supabase Storage. Buckets:
- `course-assets`
- `user-avatars`

---

## Environment Variables (Vercel)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooler connection string |
| `DIRECT_URL` | Direct connection for Prisma migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yftgdtdvmvvqyzcdntge.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
