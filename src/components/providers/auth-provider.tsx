"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile } from "@/types/profile";

interface AuthContextValue {
  isLoggedIn: boolean;
  isDemo: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  userId: string | null;
  setIsDemo: (v: boolean) => void;
  login: () => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        setProfile(data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/status");
        const data = (await res.json()) as {
          loggedIn: boolean;
          userId?: string;
          profile?: UserProfile;
        };
        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUserId(data.userId || null);
          if (data.profile) setProfile(data.profile);
        }
      } catch {
        /* ignore */
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  function login() {
    window.location.href = "/api/auth/login";
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setIsDemo(false);
    setProfile(null);
    setUserId(null);
  }

  async function deleteAccount() {
    await fetch("/api/auth/delete-account", { method: "POST" });
    setIsLoggedIn(false);
    setIsDemo(false);
    setProfile(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isDemo,
        isLoading,
        profile,
        userId,
        setIsDemo,
        login,
        logout,
        deleteAccount,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
