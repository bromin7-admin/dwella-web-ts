export default async function handler(req, res) {
  try {
    const base = "/api/proxy";
    const targetUrl = base + req.url.replace("/api/proxy", "");

    const apiRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      body: req.method !== "GET" ? req.body : undefined
    });

    const text = await apiRes.text();

    res.status(apiRes.status).send(text);

  } catch (err) {
    res.status(500).json({ error: "Proxy request failed", details: err.message });
  }
}