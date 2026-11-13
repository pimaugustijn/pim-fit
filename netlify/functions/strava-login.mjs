// Stuurt je door naar Strava om toestemming te geven.
import { randomUUID } from "node:crypto";
import { AUTH_BASE, STATE_COOKIE, redirect } from "../lib/strava.mjs";

export default async (req) => {
  const origin = new URL(req.url).origin;
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) return redirect(`${origin}/#strava-fout=instellingen`);

  const state = randomUUID();
  const url = new URL(`${AUTH_BASE}/oauth/authorize`);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/.netlify/functions/strava-callback`,
    response_type: "code",
    approval_prompt: "auto",
    scope: "activity:read_all",
    state,
  }).toString();

  return redirect(url.toString(), {
    "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/.netlify/functions/; Max-Age=900; HttpOnly; Secure; SameSite=Lax`,
  });
};
