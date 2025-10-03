const PREFIX = process.env.BLOB_PREFIX || ""; // e.g. "arena-app/prod"
const BLOB_NAME = PREFIX ? `${PREFIX.replace(/\/+$/, "")}/reservations.json` : "reservations.json";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { put } = await import("@vercel/blob");

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const json = JSON.stringify(Array.isArray(body) ? body : []);
    await put(BLOB_NAME, json, {
      access: "public",
      contentType: "application/json; charset=utf-8",
      addRandomSuffix: false,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }
};


