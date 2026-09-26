export const runtime = "edge";

import { getKV } from "@/lib/kv";

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

function isLocalhost(urlStr: string): boolean {
  const url = new URL(urlStr);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

export async function POST(request: Request) {
  const kv = getKV();

  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionId = cookies.polar_session;

  if (sessionId) {
    const sessionJson = await kv.get(sessionId);
    if (sessionJson) {
      const session = JSON.parse(sessionJson) as { user?: string };
      if (session.user) {
        await kv.delete(`consent:${session.user}`);
      }
    }
    await kv.delete(sessionId);
  }

  return Response.json(
    { loggedIn: false },
    {
      headers: {
        "Set-Cookie": cookieStr("polar_session", "", {
          httpOnly: true,
          secure: !isLocalhost(request.url),
          sameSite: "Lax",
          maxAge: 0,
          path: "/",
        }),
      },
    }
  );
}
