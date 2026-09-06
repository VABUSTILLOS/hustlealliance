# Kie.ai pilot integration

This repo includes a reusable **pilot** integration for [Kie.ai](https://docs.kie.ai/),
an AI model aggregator that exposes image, video, music, and LLM/chat models
behind a single API key. It's meant to be copy/pasted into other Next.js
projects (Momentum, Propiedades, Resurte.me) with minimal changes.

## How it works

- **Base URL**: `https://api.kie.ai`
- **Auth**: every request sends `Authorization: Bearer <KIE_AI_API_KEY>` and
  `Content-Type: application/json`.
- **Image / video / music generation is asynchronous**: the create call
  returns a `taskId`. Poll `GET /api/v1/jobs/recordInfo?taskId=<id>` until the
  task's `state` is a terminal value (`success`/`fail`), or configure a
  webhook (not wired up in this pilot).
- **LLM/chat is synchronous** and OpenAI chat-completions compatible.

## Files

| File | Purpose |
|---|---|
| `lib/ai/kie-ai.ts` | Generic server-only client: `listModels`, `createImageTask`, `createVideoTask`, `createMusicTask`, `getTaskStatus`, `pollTaskUntilComplete`, `chatCompletion`, `isKieAiConfigured`, `KieAiError`. |
| `app/api/admin/kie-ai/image/route.ts` | `POST` — starts an image generation task. |
| `app/api/admin/kie-ai/video/route.ts` | `POST` — starts a video generation task. |
| `app/api/admin/kie-ai/music/route.ts` | `POST` — starts a music generation task. |
| `app/api/admin/kie-ai/chat/route.ts` | `POST` — synchronous LLM chat completion. |
| `app/api/admin/kie-ai/status/route.ts` | `GET` — checks the status/result of a `taskId` from any of the three generation routes. |

All routes require an authenticated **admin** (`requireAdmin()`, matching the
existing `app/api/admin/ai/*` AI Studio routes) since this is a pilot/example
surface, not a shipped end-user feature. Loosen or remove that guard per-repo
as needed.

## Setup

1. Get an API key from the Kie.ai dashboard.
2. Add it to your local `.env` (never commit it):
   ```
   KIE_AI_API_KEY=your-kie-ai-key
   ```
   It's documented (commented out, no real value) in `.env.example`.
3. If `KIE_AI_API_KEY` is missing, every route returns a `500` with a clear
   message instead of failing silently.

## Testing the endpoints

You must be signed in as an admin in the browser and pass along your session
cookie, or test with an admin-authenticated `fetch`/`curl` session. Examples
below assume a local dev server (`npm run dev`) and a valid admin session
cookie in `$COOKIE`.

**Image generation:**
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/image \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "a cozy reading nook, watercolor style"}'
# => { "taskId": "..." }
```

**Video generation:**
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/video \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "a drone shot flying over a mountain lake"}'
# => { "taskId": "..." }
```

**Music generation:**
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/music \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "upbeat lo-fi instrumental, 90 bpm"}'
# => { "taskId": "..." }
```

**Poll for a result** (use the `taskId` from any of the above):
```bash
curl "http://localhost:3000/api/admin/kie-ai/status?taskId=<id>" -H "Cookie: $COOKIE"
# => { "taskId": "...", "state": "success", "resultJson": "...", ... }
```

**Chat (synchronous LLM):**
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/chat \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Say hi in 5 words"}]}'
# => { "content": "..." }
```

Consult [docs.kie.ai](https://docs.kie.ai/) for the exact model paths/params
(the defaults in `lib/ai/kie-ai.ts` — `/api/v1/gpt4o-image/generate`,
`/api/v1/veo/generate`, `/api/v1/suno/generate` — may need to be swapped for
the specific model you want; every helper accepts an override `modelPath`
argument).

## Replicating this pilot in another Next.js repo (Momentum, Propiedades, Resurte.me)

1. Copy `lib/ai/kie-ai.ts` as-is — it has **zero extra dependencies** (uses
   native `fetch` only, plus `server-only` if that package is already a dep;
   drop that import if not).
2. Copy the five route files under `app/api/admin/kie-ai/` (or wherever that
   repo keeps admin-only API routes), adjusting the auth guard import
   (`requireAdmin`/`authErrorResponse`) to match that repo's auth helpers.
3. Add `KIE_AI_API_KEY` to that repo's `.env.example` (commented, no value)
   and to its real `.env`/deployment secrets.
4. Adjust the zod body schemas / default model paths per the specific Kie.ai
   models that repo needs.
5. Never commit the real API key — it only ever comes from the environment.
