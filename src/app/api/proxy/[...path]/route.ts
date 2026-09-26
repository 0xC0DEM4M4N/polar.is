export const runtime = "edge";

import { getKV } from "@/lib/kv";

const POLAR_BASE = "https://www.polaraccesslink.com";

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  header.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    if (k) cookies[k] = v ? decodeURIComponent(v) : "";
  });
  return cookies;
}

async function polarRequest(
  method: string,
  polarPath: string,
  token: string,
  body?: unknown
) {
  const url = POLAR_BASE + polarPath;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
  if (body && method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body && method !== "GET" ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    data = { error: text || `Polar API ${res.status}` };
  }

  if (!res.ok) {
    const errMsg =
      typeof (data as Record<string, unknown>)?.error === "string"
        ? (data as Record<string, string>).error
        : typeof (data as Record<string, unknown>)?.message === "string"
        ? (data as Record<string, string>).message
        : JSON.stringify(
            (data as Record<string, unknown>)?.error ||
              (data as Record<string, unknown>)?.message ||
              data ||
              `Polar API ${res.status}`
          );
    const err = new Error(errMsg);
    (err as Error & { status: number }).status = res.status;
    (err as Error & { data: unknown }).data = data;
    throw err;
  }

  return data;
}

async function resolveToken(request: Request): Promise<string | null> {
  const auth = request.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }

  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionId = cookies.polar_session;
  if (sessionId) {
    const kv = getKV();
    const sessionJson = await kv.get(sessionId);
    if (sessionJson) {
      const session = JSON.parse(sessionJson) as { token?: string };
      return session.token || null;
    }
  }

  return null;
}

export async function GET(request: Request) {
  return handleProxy(request);
}

export async function POST(request: Request) {
  return handleProxy(request);
}

async function handleProxy(request: Request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.replace("/api/proxy/", "").split("/");
  const path = "/api/" + pathSegments.join("/");

  const pathMap: Record<string, string> = {
    "/api/register": "/v3/users",
    "/api/user-info": "/v3/users",
    "/api/sleep": "/v3/users/sleep",
    "/api/nightly-recharge": "/v3/users/nightly-recharge",
    "/api/heart-rate": "/v3/users/continuous-heart-rate",
    "/api/activity": "/v3/users/activities",
    "/api/activity-samples": "/v3/users/activities/samples",
    "/api/exercises": "/v3/users/exercise-transactions",
    "/api/cardio-load": "/v3/users/cardio-load",
  };

  let polarPath = pathMap[path] || "/v3" + path.replace("/api", "");

  if (path === "/api/heart-rate") {
    const dateParam = url.searchParams.get("date");
    if (dateParam) {
      const cleanDate = dateParam.includes("-")
        ? dateParam
        : `${dateParam.slice(0, 4)}-${dateParam.slice(4, 6)}-${dateParam.slice(6, 8)}`;
      const nextDate = new Date(cleanDate + "T00:00:00");
      nextDate.setDate(nextDate.getDate() + 1);
      const toDate = nextDate.toISOString().split("T")[0];
      url.searchParams.delete("date");
      url.searchParams.set("from", cleanDate);
      url.searchParams.set("to", toDate);
    }
  }

  if (
    ["/api/sleep", "/api/nightly-recharge", "/api/activity", "/api/activity-samples"].includes(path)
  ) {
    url.searchParams.delete("from");
    url.searchParams.delete("to");
  }

  const token = await resolveToken(request);
  if (!token) {
    return Response.json(
      { error: "Missing authentication. Please log in." },
      { status: 401 }
    );
  }

  try {
    let body: unknown = undefined;
    if (request.method !== "GET") {
      try {
        body = await request.json();
      } catch {
        /* no body */
      }
    }

    if (body && typeof body === "object" && "memberId" in (body as Record<string, unknown>)) {
      body = { ...(body as Record<string, unknown>), "member-id": (body as Record<string, unknown>).memberId };
      delete (body as Record<string, unknown>).memberId;
    }

    if (path === "/api/register" && body) {
      try {
        const data = await polarRequest(request.method, polarPath, token, body);
        return Response.json(
          { registered: true, ...(typeof data === "object" ? data : {}) },
          { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
        );
      } catch (err) {
        if ((err as Error & { status: number }).status === 409) {
          return Response.json(
            { registered: true, alreadyExists: true },
            { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
          );
        }
        throw err;
      }
    }

    const data = await polarRequest(
      request.method,
      polarPath + url.search,
      token,
      body
    );
    return Response.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const msg =
      typeof (err as Error).message === "string"
        ? (err as Error).message
        : JSON.stringify(
            (err as Error).message ||
              (err as Error & { data: unknown }).data ||
              err
          );
    return Response.json(
      { error: msg },
      {
        status: (err as Error & { status: number }).status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
