interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

declare global {
  interface ProcessEnv {
    POLAR_SESSIONS: KVNamespace;
    POLAR_CLIENT_ID: string;
    POLAR_CLIENT_SECRET: string;
    REDIRECT_URI: string;
  }
}

export {};
