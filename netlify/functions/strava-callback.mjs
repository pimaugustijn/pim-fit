// Hier komt Strava terug na het inloggen. Wisselt de code in voor een sleutel en stuurt je terug naar de app.
import { STATE_COOKIE, readCookie, redirect, tokenRequest } from "../lib/strava.mjs";

export default async (req) => {
  const url = new URL(req.url);
  const p = url.searchParams;
  const clear = { "Set-Cookie": `${STATE_COOKIE}=; Path=/.netlify/functions/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` };
  const back = (fragment) => redirect(`${url.origin}/#${fragment}`, clear);

  if (p.get("error")) return back("strava-fout=geweigerd");
  const state = p.get("state");
  if (!state || state !== readCookie(req, STATE_COOKIE)) return back("strava-fout=verlopen");
  if (!/activity:read/.test(p.get("scope") || "")) return back("strava-fout=rechten");
  if (!p.get("code")) return back("strava-fout=token");

  let r;
  try {
    r = await tokenRequest({ code: p.get("code"), grant_type: "authorization_code" });
  } catch (e) {
    return back(e.message === "instellingen" ? "strava-fout=instellingen" : "strava-fout=token");
  }
  if (!r.ok || !r.data || !r.data.refresh_token) return back("strava-fout=token");

  const athlete = r.data.athlete || {};
  const payload = { refresh_token: r.data.refresh_token, athlete: athlete.id || null, name: athlete.firstname || "" };
  return back("strava=" + encodeURIComponent(JSON.stringify(payload)));
};
