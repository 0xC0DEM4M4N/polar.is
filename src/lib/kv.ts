// Helper to get KV namespace with local dev fallback
export function getKV() {
  const env = process.env as {
    POLAR_SESSIONS?: {
      get(key: string): Promise<string | null>;
      put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
      delete(key: string): Promise<void>;
    };
  };

  // Return real KV in Cloudflare runtime
  if (env.POLAR_SESSIONS) {
    return env.POLAR_SESSIONS;
  }

  // Return a no-op mock for local Next.js dev server (npm run dev)
  // This lets the frontend render without crashing when KV isn't available
  return {
    get: async () => null,
    put: async () => {},
    delete: async () => {},
  };
}
