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

export async function GET(request: Request) {
  const kv = getKV();

  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionId = cookies.polar_session;

  if (!sessionId) {
    return Response.json({ loggedIn: false });
  }

  const sessionJson = await kv.get(sessionId);
  if (!sessionJson) {
    return Response.json({ loggedIn: false });
  }

  const session = JSON.parse(sessionJson) as {
    user?: string;
    token?: string;
  };

  let profile = null;
  if (session.user) {
    const profileJson = await kv.get(`profile:${session.user}`);
    if (profileJson) profile = JSON.parse(profileJson);
  }

  return Response.json({
    loggedIn: true,
    user: session.user,
    userId: session.user,
    profile,
  });
}
