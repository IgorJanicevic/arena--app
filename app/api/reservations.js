const PREFIX = process.env.BLOB_PREFIX || ""; // e.g. "arena-app/prod"
const BLOB_NAME = PREFIX ? `${PREFIX.replace(/\/+$/, "")}/reservations.json` : "reservations.json";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { list } = await import("@vercel/blob");

  if (req.method === "GET") {
    try {
      const blobs = await list({ prefix: BLOB_NAME, limit: 1 });
      const entry = blobs.blobs.find((b) => b.pathname === BLOB_NAME) || blobs.blobs[0];
      if (!entry) return res.status(200).json([]);
      const data = await fetch(entry.url).then((r) => r.json()).catch(() => []);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json([]);
    }
  }

  // Only GET here; saving is handled by /api/reservations-save

  return res.status(405).json({ error: "Method not allowed" });
};


