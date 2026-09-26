export const runtime = "edge";

import { getKV } from "@/lib/kv";

const POLAR_AUTH_URL = "https://flow.polar.com/oauth2/authorization";

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

export async function GET() {
  const state = await randomState();
  const env = process.env as {
    POLAR_CLIENT_ID?: string;
    REDIRECT_URI?: string;
  };

  const kv = getKV();
  await kv.put(`state:${state}`, "1", { expirationTtl: 600 });

  const redirectUrl = new URL(POLAR_AUTH_URL);
  redirectUrl.searchParams.set("client_id", env.POLAR_CLIENT_ID!);
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("scope", "accesslink.read_all");
  redirectUrl.searchParams.set("redirect_uri", env.REDIRECT_URI!);
  redirectUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl.toString(),
      "Cache-Control": "no-store",
    },
  });
}
