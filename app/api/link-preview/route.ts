import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 15;

interface OgData {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

// Simple in-memory cache (per serverless instance)
const cache = new Map<string, { data: OgData; at: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1h
const MAX_HTML_BYTES = 512 * 1024; // 512KB cap

function extractMeta(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].slice(0, 500);
  }
  if (prop === "title") {
    const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (t?.[1]) return t[1].trim().slice(0, 300);
  }
  if (prop === "description") {
    const m =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    if (m?.[1]) return m[1].slice(0, 500);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const cached = cache.get(url);
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "HustleAlliance-LinkBot/1.0", Accept: "text/html" },
    });
    clearTimeout(timer);

    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok || !contentType.includes("text/html")) {
      const data: OgData = { url, title: null, description: null, image: null, siteName: parsed.hostname };
      cache.set(url, { data, at: Date.now() });
      return NextResponse.json(data);
    }

    const reader = res.body?.getReader();
    let html = "";
    let bytes = 0;
    if (reader) {
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        html += decoder.decode(value, { stream: true });
        if (bytes >= MAX_HTML_BYTES) {
          void reader.cancel();
          break;
        }
      }
    }

    const data: OgData = {
      url,
      title: extractMeta(html, "title"),
      description: extractMeta(html, "description"),
      image: extractMeta(html, "image"),
      siteName: extractMeta(html, "site_name") ?? parsed.hostname,
    };
    // Resolve relative image URLs
    if (data.image && !data.image.startsWith("http")) {
      try {
        data.image = new URL(data.image, url).toString();
      } catch {
        data.image = null;
      }
    }
    cache.set(url, { data, at: Date.now() });
    return NextResponse.json(data);
  } catch {
    const data: OgData = { url, title: null, description: null, image: null, siteName: parsed.hostname };
    return NextResponse.json(data);
  }
}
