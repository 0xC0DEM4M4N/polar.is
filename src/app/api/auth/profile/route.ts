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
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionJson = await kv.get(sessionId);
  if (!sessionJson) {
    return Response.json({ error: "Session expired" }, { status: 401 });
  }

  const session = JSON.parse(sessionJson) as { user?: string };
  const userId = session.user;
  if (!userId) {
    return Response.json({ error: "No user ID" }, { status: 400 });
  }

  const profileJson = await kv.get(`profile:${userId}`);
  if (!profileJson) {
    return Response.json({ name: "Polar User", avatar: "🧑", userId });
  }
  return Response.json(JSON.parse(profileJson));
}

export async function POST(request: Request) {
  const kv = getKV();

  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionId = cookies.polar_session;

  if (!sessionId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionJson = await kv.get(sessionId);
  if (!sessionJson) {
    return Response.json({ error: "Session expired" }, { status: 401 });
  }

  const session = JSON.parse(sessionJson) as { user?: string };
  const userId = session.user;
  if (!userId) {
    return Response.json({ error: "No user ID" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      avatar?: string;
      colorFrom?: string;
      colorTo?: string;
    };
    const profile = {
      name: (body.name || "Polar User").trim().slice(0, 50),
      avatar: (body.avatar || "🧑").trim().slice(0, 2),
      colorFrom: (body.colorFrom || "#5DCAA5").trim().slice(0, 7),
      colorTo: (body.colorTo || "#1D9E75").trim().slice(0, 7),
      userId,
      updatedAt: new Date().toISOString(),
    };

    await kv.put(`profile:${userId}`, JSON.stringify(profile), {
      expirationTtl: 31536000,
    });
    return Response.json(profile);
  } catch {
    return Response.json({ error: "Invalid profile data" }, { status: 400 });
  }
}
