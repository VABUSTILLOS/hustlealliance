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

### Verified upstream endpoints

These were validated live against `api.kie.ai`:

| Purpose | Endpoint | Required body fields |
|---|---|---|
| 4o Image | `POST /api/v1/gpt4o-image/generate` | `prompt`, `size` (`1:1`\|`3:2`\|`2:3`). No `model` field. |
| Veo video | `POST /api/v1/veo/generate` | `prompt`, `model` (e.g. `veo3_fast`, `veo3`), `aspect_ratio` (e.g. `16:9`) |
| Music | `POST /api/v1/generate` | `prompt`, `customMode`, `instrumental`, `model` (`V3_5`\|`V4`\|`V4_5`\|`V4_5PLUS`\|`V4_5ALL`\|`V5`\|`V5_5`), `callBackUrl` — omitting any returns `422` |
| Task status | `GET /api/v1/jobs/recordInfo?taskId=...` | — |
| LLM / chat | `POST /v1/chat/completions` | `model`, `messages` |

Notes:
- The chat endpoint is at `/v1/...`, **not** `/api/v1/...` (the latter returns `404`).
- Music is at `/api/v1/generate`, **not** `/api/v1/suno/generate` (`404`).
- There is **no public model-listing endpoint** (`GET /api/v1/models` returns `404`);
  model identifiers come from the per-endpoint docs at https://docs.kie.ai/.

## Files

| File | Purpose |
|---|---|
| `lib/ai/kie-ai.ts` | Generic server-only client: `createImageTask`, `createVideoTask`, `createMusicTask`, `getTaskStatus`, `pollTaskUntilComplete`, `extractResultUrls`, `chatCompletion`, `isKieAiConfigured`, `KieAiError`. |
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
3. Optionally set `KIEAI_CALLBACK_URL` — a public URL that the Kie.ai music
   endpoint requires. It can also be supplied per-request as `callBackUrl`;
   if neither is present the music route returns a `400` with a clear message.
4. If `KIE_AI_API_KEY` is missing, every route returns a `500` with a clear
   message instead of failing silently.

## Testing the endpoints

You must be signed in as an admin in the browser and pass along your session
cookie, or test with an admin-authenticated `fetch`/`curl` session. Examples
below assume a local dev server (`npm run dev`) and a valid admin session
cookie in `$COOKIE`.

**Image generation** (`size` defaults to `1:1`):
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/image \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "a cozy reading nook, watercolor style", "size": "1:1"}'
# => { "taskId": "..." }
```

**Video generation** (`model` defaults to `veo3_fast`, `aspect_ratio` to `16:9`):
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/video \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "a drone shot flying over a mountain lake", "model": "veo3_fast", "aspect_ratio": "16:9"}'
# => { "taskId": "..." }
```

**Music generation** (requires a callback URL — body `callBackUrl` or the
`KIEAI_CALLBACK_URL` env var):
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/music \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"prompt": "upbeat lo-fi instrumental, 90 bpm", "customMode": false, "instrumental": true, "model": "V4_5", "callBackUrl": "https://your-domain.com/api/admin/kie-ai/callback"}'
# => { "taskId": "..." }
```

**Poll for a result** (use the `taskId` from any of the above):
```bash
curl "http://localhost:3000/api/admin/kie-ai/status?taskId=<id>" -H "Cookie: $COOKIE"
# => { "taskId": "...", "state": "success", "resultUrls": ["https://..."], ... }
```
The route normalizes generated asset URLs into `resultUrls`, whether the API
returned them at the top level or nested inside the `resultJson` string.

**Chat (synchronous LLM):**
```bash
curl -X POST http://localhost:3000/api/admin/kie-ai/chat \
  -H "Content-Type: application/json" -H "Cookie: $COOKIE" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Say hi in 5 words"}]}'
# => { "content": "..." }
```

Consult [docs.kie.ai](https://docs.kie.ai/) for the full list of models and
per-endpoint parameters. Every generation helper in `lib/ai/kie-ai.ts` accepts
an override `modelPath` argument if you need a different upstream endpoint
than the verified defaults listed above.

## Replicating this pilot in another Next.js repo (Momentum, Propiedades, Resurte.me)

1. Copy `lib/ai/kie-ai.ts` as-is — it has **zero extra dependencies** (uses
   native `fetch` only, plus `server-only` if that package is already a dep;
   drop that import if not).
2. Copy the five route files under `app/api/admin/kie-ai/` (or wherever that
   repo keeps admin-only API routes), adjusting the auth guard import
   (`requireAdmin`/`authErrorResponse`) to match that repo's auth helpers.
3. Add `KIE_AI_API_KEY` (and `KIEAI_CALLBACK_URL` if using music) to that
   repo's `.env.example` (commented, no value) and to its real
   `.env`/deployment secrets.
4. Adjust the zod body schemas / default model paths per the specific Kie.ai
   models that repo needs.
5. Never commit the real API key — it only ever comes from the environment.
