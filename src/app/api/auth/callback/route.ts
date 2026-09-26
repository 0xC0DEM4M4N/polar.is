export const runtime = "edge";

import { getKV } from "@/lib/kv";

const POLAR_TOKEN_URL = "https://polarremote.com/v2/oauth2/token";

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  header.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    if (k) cookies[k] = v ? decodeURIComponent(v) : "";
  });
  return cookies;
}

function cookieStr(
  name: string,
  value: string,
  opts: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
    maxAge?: number;
    path?: string;
  } = {}
): string {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (opts.httpOnly) str += "; HttpOnly";
  if (opts.secure) str += "; Secure";
  if (opts.sameSite) str += `; SameSite=${opts.sameSite}`;
  if (opts.maxAge) str += `; Max-Age=${Math.round(opts.maxAge / 1000)}`;
  if (opts.path) str += `; Path=${opts.path}`;
  return str;
}

function base64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function randomState(): Promise<string> {
  const buf = crypto.getRandomValues(new Uint8Array(32));
  return base64url(buf.buffer);
}

function isLocalhost(urlStr: string): boolean {
  const url = new URL(urlStr);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

async function exchangeCode(code: string, env: {
  POLAR_CLIENT_ID: string;
  POLAR_CLIENT_SECRET: string;
  REDIRECT_URI: string;
}) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: env.REDIRECT_URI,
  });

  const auth = btoa(`${env.POLAR_CLIENT_ID}:${env.POLAR_CLIENT_SECRET}`);

  const res = await fetch(POLAR_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    x_user_id?: string;
  }>;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const env = process.env as {
    POLAR_CLIENT_ID?: string;
    POLAR_CLIENT_SECRET?: string;
    REDIRECT_URI?: string;
  };

  const kv = getKV();

  if (error) {
    return new Response(`OAuth error: ${error}`, { status: 400 });
  }

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  const stateKey = `state:${state}`;
  const stateValid = await kv.get(stateKey);
  if (!stateValid) {
    const isDev = isLocalhost(request.url);
    return new Response(
      `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Auth Error</title>
<style>body{font-family:system-ui,sans-serif;background:#0c0c14;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{background:#13131e;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:32px;max-width:420px;text-align:center}
h1{margin:0 0 12px;font-size:20px;color:#f87171}
p{margin:0 0 16px;color:rgba(255,255,255,0.55);font-size:14px;line-height:1.5}
.code{background:#1a1a28;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;color:rgba(255,255,255,0.7);text-align:left;overflow-wrap:break-word}
.btn{display:inline-block;margin-top:16px;padding:10px 20px;background:#5DCAA5;color:#0c0c14;text-decoration:none;border-radius:999px;font-size:13px;font-weight:500}
</style></head><body>
<div class="card"><h1>Invalid or expired state</h1>
<p>The OAuth state token is missing or has expired.</p>
${isDev ? '<p><strong>Running locally?</strong> Make sure your Polar app redirect URI includes:</p><div class="code">http://localhost:3001/en-gb/api/auth/callback</div>' : ''}
<a class="btn" href="/en-gb/dashboard">Back to Dashboard</a>
</div></body></html>`,
      { status: 403, headers: { "Content-Type": "text/html" } }
    );
  }
  await kv.delete(stateKey);

  try {
    const tokenData = await exchangeCode(code, {
      POLAR_CLIENT_ID: env.POLAR_CLIENT_ID!,
      POLAR_CLIENT_SECRET: env.POLAR_CLIENT_SECRET!,
      REDIRECT_URI: env.REDIRECT_URI!,
    });

    const sessionId = await randomState();
    const session = {
      token: tokenData.access_token,
      user: tokenData.x_user_id || null,
      userId: tokenData.x_user_id || null,
      createdAt: Date.now(),
      gdprConsent: true,
      consentDate: new Date().toISOString(),
    };

    await kv.put(sessionId, JSON.stringify(session), {
      expirationTtl: 2592000,
    });

    const consentKey = `consent:${tokenData.x_user_id || sessionId}`;
    await kv.put(
      consentKey,
      JSON.stringify({
        consented: true,
        date: new Date().toISOString(),
        method: "oauth",
        version: "1.0",
      }),
      { expirationTtl: 31536000 }
    );

    const userId = tokenData.x_user_id;
    if (userId) {
      const profileKey = `profile:${userId}`;
      const existing = await kv.get(profileKey);
      if (!existing) {
        await kv.put(
          profileKey,
          JSON.stringify({
            name: "Polar User",
            avatar: "🧑",
            colorFrom: "#5DCAA5",
            colorTo: "#1D9E75",
            userId,
            createdAt: new Date().toISOString(),
          }),
          { expirationTtl: 31536000 }
        );
      }
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/en-gb/dashboard",
        "Set-Cookie": cookieStr("polar_session", sessionId, {
          httpOnly: true,
          secure: !isLocalhost(request.url),
          sameSite: "Lax",
          maxAge: 2592000000,
          path: "/",
        }),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(`Auth callback error: ${message}`, { status: 500 });
  }
}
