// Gedeelde Strava-code voor de Netlify-functies. Geheime sleutels komen alleen uit de omgevingsvariabelen van Netlify.

// Vanaf 4 januari 2027 wordt dit https://api-v3.strava.com. Aanpassen kan in Netlify via STRAVA_API_BASE.
export const API_BASE = (process.env.STRAVA_API_BASE || "https://www.strava.com/api/v3").replace(/\/+$/, "");
export const AUTH_BASE = (process.env.STRAVA_OAUTH_BASE || "https://www.strava.com").replace(/\/+$/, "");

export const STATE_COOKIE = "pf_strava_state";

export function credentials() {
  const id = process.env.STRAVA_CLIENT_ID;
  const secret = process.env.STRAVA_CLIENT_SECRET;
  if (!id || !secret) throw new Error("instellingen");
  return { id, secret };
}

export async function tokenRequest(params) {
  const { id, secret } = credentials();
  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: id, client_secret: secret, ...params }),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

export function redirect(location, headers = {}) {
  return new Response(null, { status: 302, headers: { Location: location, "Cache-Control": "no-store", ...headers } });
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function readCookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

const RUN_TYPES = new Set(["Run", "TrailRun", "VirtualRun"]);

export function isRun(a) {
  return RUN_TYPES.has(a.sport_type || a.type);
}

// Alleen wat Pim Fit nodig heeft. start_date_local is lokale tijd, ook al eindigt hij op Z.
export function slimRun(a) {
  const start = String(a.start_date_local || a.start_date || "");
  return {
    id: String(a.id),
    name: a.name || "Run",
    start,
    date: start.slice(0, 10),
    km: Math.round((a.distance || 0) / 10) / 100,
    sec: a.moving_time || 0,
    elapsed: a.elapsed_time || 0,
    hr: a.has_heartrate && a.average_heartrate ? Math.round(a.average_heartrate) : null,
    maxhr: a.has_heartrate && a.max_heartrate ? Math.round(a.max_heartrate) : null,
    elev: Math.round(a.total_elevation_gain || 0),
    sport: a.sport_type || a.type,
    workout: a.workout_type ?? null,
  };
}
