import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list } from "@vercel/blob";

const BLOB_NAME = "reservations.json";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    try {
      const blobs = await list({ prefix: BLOB_NAME, limit: 1 });
      const entry = blobs.blobs.find((b) => b.pathname === BLOB_NAME) || blobs.blobs[0];
      if (!entry) return res.status(200).json([]);
      const data = await fetch(entry.url).then((r) => r.json()).catch(() => []);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).json([]);
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const json = JSON.stringify(body ?? []);
      await put(BLOB_NAME, json, { access: "public", contentType: "application/json; charset=utf-8" });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}


