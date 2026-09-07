import 'server-only';
import { NextResponse } from 'next/server';

/**
 * Generic Kie.ai client (https://docs.kie.ai/).
 *
 * Kie.ai is a single-API-key aggregator for image, video, music and LLM
 * models. Generation endpoints (image/video/music) are ASYNCHRONOUS: the
 * create call returns a `taskId`, and the result is retrieved by polling
 * `GET /api/v1/jobs/recordInfo?taskId=...` (or via webhook). LLM/chat calls
 * are synchronous and OpenAI-compatible.
 *
 * This module is the reusable "pilot" for Kie.ai across Hustle Alliance
 * projects — see KIE_AI_PILOT.md for how to replicate it in other repos.
 */

const KIE_AI_BASE_URL = 'https://api.kie.ai';

export class KieAiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'KieAiError';
  }
}

/** True when KIE_AI_API_KEY is configured. Check before calling the client to fail fast with a clear error. */
export function isKieAiConfigured(): boolean {
  return !!process.env.KIE_AI_API_KEY;
}

function getApiKey(): string {
  const key = process.env.KIE_AI_API_KEY;
  if (!key) {
    throw new KieAiError(
      'KIE_AI_API_KEY is not configured. Set it in your environment (see .env.example).',
      500
    );
  }
  return key;
}

/** Low-level fetch wrapper: adds auth + JSON headers, parses the response, and throws KieAiError on failure. */
async function kieFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = getApiKey();
  const res = await fetch(`${KIE_AI_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    // Generation/status endpoints should never be cached by Next.js fetch caching.
    cache: 'no-store',
  });

  const text = await res.text();
  let json: unknown = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (!res.ok) {
    const message =
      (json &&
      typeof json === 'object' &&
      'message' in json &&
      typeof (json as { message?: unknown }).message === 'string'
        ? (json as { message: string }).message
        : null) || `Kie.ai request failed with status ${res.status}`;
    throw new KieAiError(message, res.status, json);
  }

  return json as T;
}

// NOTE: Kie.ai does not expose a public model-listing endpoint
// (`GET /api/v1/models` returns 404). Model identifiers are documented
// per-endpoint at https://docs.kie.ai/ and passed in the request body.

// ─── Async generation tasks (image / video / music) ───────────────────────

export interface CreateTaskResponse {
  taskId: string;
  [key: string]: unknown;
}

/**
 * Starts an async generation task on a given model endpoint (e.g. an image,
 * video, or music model route documented at docs.kie.ai). Returns the
 * `taskId` used to poll `recordInfo`.
 */
export async function createGenerationTask(
  modelPath: string,
  input: Record<string, unknown>
): Promise<CreateTaskResponse> {
  const data = await kieFetch<{ data?: CreateTaskResponse; taskId?: string }>(modelPath, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  const taskId = data.taskId ?? data.data?.taskId;
  if (!taskId) {
    throw new KieAiError('Kie.ai response did not include a taskId', 502, data);
  }
  return { ...data.data, taskId };
}

/** Aspect ratios accepted by the 4o Image endpoint. */
export type KieAiImageSize = '1:1' | '3:2' | '2:3';

/**
 * Starts a 4o Image generation task.
 * `size` is REQUIRED by the API alongside `prompt`; there is no `model` field
 * in this endpoint's schema.
 */
export function createImageTask(
  input: { prompt: string; size: KieAiImageSize; [key: string]: unknown },
  modelPath = '/api/v1/gpt4o-image/generate'
) {
  return createGenerationTask(modelPath, input);
}

/**
 * Starts a Veo video generation task.
 * `model` is REQUIRED by the API (e.g. `veo3_fast`, `veo3`).
 */
export function createVideoTask(
  input: { prompt: string; model: string; [key: string]: unknown },
  modelPath = '/api/v1/veo/generate'
) {
  return createGenerationTask(modelPath, input);
}

/** Music model identifiers accepted by the Kie.ai music endpoint. */
export type KieAiMusicModel =
  | 'V3_5'
  | 'V4'
  | 'V4_5'
  | 'V4_5PLUS'
  | 'V4_5ALL'
  | 'V5'
  | 'V5_5';

/**
 * Starts a music generation task on `POST /api/v1/generate`.
 * The API rejects (422) requests missing `customMode`, `instrumental`,
 * `model`, or `callBackUrl`.
 */
export function createMusicTask(
  input: {
    prompt: string;
    customMode: boolean;
    instrumental: boolean;
    model: KieAiMusicModel;
    callBackUrl: string;
    [key: string]: unknown;
  },
  modelPath = '/api/v1/generate'
) {
  return createGenerationTask(modelPath, input);
}

export type KieAiTaskState = 'waiting' | 'queuing' | 'generating' | 'success' | 'fail' | string;

export interface KieAiTaskRecord {
  taskId: string;
  state: KieAiTaskState;
  /** JSON string containing the result payload (e.g. `{"resultUrls":[...]}`). */
  resultJson?: string;
  /** Some endpoints return the URLs directly instead of inside `resultJson`. */
  resultUrls?: string[];
  failMsg?: string;
  [key: string]: unknown;
}

/**
 * Extracts generated asset URLs from a completed task record, handling both
 * the top-level `resultUrls` field and URLs nested inside the `resultJson`
 * string. Returns an empty array when the task has no (parseable) result.
 */
export function extractResultUrls(record: KieAiTaskRecord): string[] {
  if (Array.isArray(record.resultUrls)) return record.resultUrls;
  if (!record.resultJson) return [];
  try {
    const parsed = JSON.parse(record.resultJson) as { resultUrls?: unknown };
    return Array.isArray(parsed.resultUrls)
      ? parsed.resultUrls.filter((url): url is string => typeof url === 'string')
      : [];
  } catch {
    return [];
  }
}

/** GET /api/v1/jobs/recordInfo?taskId=... — fetch current status/result of an async task. */
export async function getTaskStatus(taskId: string): Promise<KieAiTaskRecord> {
  const data = await kieFetch<{ data?: KieAiTaskRecord } & Partial<KieAiTaskRecord>>(
    `/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`
  );
  return (data.data ?? data) as KieAiTaskRecord;
}

const TERMINAL_STATES = new Set(['success', 'fail', 'completed', 'failed']);

/**
 * Polls `recordInfo` until the task reaches a terminal state, or the timeout
 * elapses. Prefer webhooks in production for long-running video/music jobs;
 * this helper is convenient for short-lived pilot/demo usage.
 */
export async function pollTaskUntilComplete(
  taskId: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<KieAiTaskRecord> {
  const { intervalMs = 3000, timeoutMs = 120_000 } = options;
  const start = Date.now();

  for (;;) {
    const record = await getTaskStatus(taskId);
    if (TERMINAL_STATES.has(record.state)) {
      return record;
    }
    if (Date.now() - start >= timeoutMs) {
      throw new KieAiError(`Timed out waiting for Kie.ai task ${taskId} to complete`, 504, record);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

// ─── LLM / chat (synchronous, OpenAI-compatible) ──────────────────────────

export interface KieAiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KieAiChatResult {
  content: string;
  raw: unknown;
}

/**
 * POST /v1/chat/completions — synchronous, OpenAI chat-completions-compatible.
 * NOTE: this endpoint lives at `/v1/...`, NOT `/api/v1/...` (the latter 404s).
 */
export async function chatCompletion(params: {
  model: string;
  messages: KieAiChatMessage[];
  temperature?: number;
}): Promise<KieAiChatResult> {
  const data = await kieFetch<{
    choices?: { message?: { content?: string } }[];
  }>('/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  const content = data.choices?.[0]?.message?.content ?? '';
  return { content, raw: data };
}

// ─── Route helpers ─────────────────────────────────────────────────────────

/**
 * Convert a KieAiError (or the "not configured" case) into a NextResponse
 * with the repo's standard `{ error }` shape; rethrows anything else.
 * Use in route handlers:
 *   try { ... } catch (err) { return kieAiErrorResponse(err); }
 */
export function kieAiErrorResponse(err: unknown): NextResponse {
  if (err instanceof KieAiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  throw err;
}
