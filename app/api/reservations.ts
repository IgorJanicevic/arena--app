export const config = { runtime: "edge" } as const;

import { put, list } from "@vercel/blob";

const BLOB_NAME = "reservations.json";

function jsonResponse(body: unknown, init?: number | ResponseInit) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };
  if (typeof init === "number") return new Response(JSON.stringify(body), { status: init, headers });
  return new Response(JSON.stringify(body), { ...(init || {}), headers: { ...(init?.headers || {}), ...headers } });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }});

  if (req.method === "GET") {
    try {
      const blobs = await list({ prefix: BLOB_NAME, limit: 1 });
      const entry = blobs.blobs.find((b) => b.pathname === BLOB_NAME) || blobs.blobs[0];
      if (!entry) return jsonResponse([], 200);
      const data = await fetch(entry.url).then((r) => r.json()).catch(() => []);
      return jsonResponse(data, 200);
    } catch (e) {
      return jsonResponse([], 200);
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json().catch(() => []);
      const json = JSON.stringify(body ?? []);
      await put(BLOB_NAME, json, { access: "public", contentType: "application/json; charset=utf-8" });
      return jsonResponse({ ok: true }, 200);
    } catch (e) {
      return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
    }
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}


