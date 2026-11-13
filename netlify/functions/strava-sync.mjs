// Haalt je runs op bij Strava. De app stuurt zijn sleutel mee; die ververst hier met het geheim uit Netlify.
import { API_BASE, isRun, json, slimRun, tokenRequest } from "../lib/strava.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "methode" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invoer" }, 400);
  }
  const refreshToken = body && typeof body.refresh_token === "string" ? body.refresh_token : "";
  if (!refreshToken) return json({ error: "invoer" }, 400);
  const after = Number.isFinite(body.after) ? Math.max(0, Math.floor(body.after)) : 0;

  let t;
  try {
    t = await tokenRequest({ grant_type: "refresh_token", refresh_token: refreshToken });
  } catch (e) {
    return json({ error: e.message === "instellingen" ? "instellingen" : "strava" }, e.message === "instellingen" ? 500 : 502);
  }
  if (!t.ok || !t.data || !t.data.access_token) {
    const auth = t.status === 400 || t.status === 401;
    return json({ error: auth ? "auth" : "strava" }, auth ? 401 : 502);
  }

  // Strava geeft soms een nieuwe refresh_token; de oude werkt dan niet meer, dus die gaat altijd mee terug.
  const fresh = t.data.refresh_token || refreshToken;
  const runs = [];
  try {
    for (let page = 1; page <= 5; page++) {
      const qs = new URLSearchParams({ after: String(after), per_page: "100", page: String(page) });
      const res = await fetch(`${API_BASE}/athlete/activities?${qs}`, {
        headers: { Authorization: `Bearer ${t.data.access_token}` },
      });
      if (res.status === 401) return json({ error: "auth", refresh_token: fresh }, 401);
      if (res.status === 429) return json({ error: "limiet", refresh_token: fresh }, 429);
      if (!res.ok) return json({ error: "strava", refresh_token: fresh }, 502);
      const list = await res.json();
      list.filter(isRun).forEach((a) => runs.push(slimRun(a)));
      if (list.length < 100) break;
    }
  } catch {
    return json({ error: "strava", refresh_token: fresh }, 502);
  }

  return json({ refresh_token: fresh, runs });
};
