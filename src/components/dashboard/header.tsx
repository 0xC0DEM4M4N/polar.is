"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Logo } from "@/components/ui/logo";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export function DashboardHeader() {
  const { isLoggedIn, isDemo, profile, logout, deleteAccount } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showUser = isLoggedIn || isDemo;
  const name = profile?.name || "Polar User";
  const initial = name.charAt(0).toUpperCase();
  const colorFrom = profile?.colorFrom || "#5DCAA5";
  const colorTo = profile?.colorTo || "#1D9E75";

  return (
    <header
      className="flex items-center justify-between px-8 lg:px-10 py-5 sticky top-0 z-40"
      style={{
        background: "rgba(12,12,20,0.75)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <Logo />
        <span className="font-serif text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          polar<span className="text-mint">.</span>
          <span style={{ opacity: 0.35 }}>is</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <LocaleSwitcher />
        <ThemeToggle />
        {showUser && (
          <div className="last-sync flex items-center">
            <span className="sync-dot" />
            <span className="text-[11px] tracking-wide" style={{ color: "var(--text-muted)" }}>
              SYNCED JUST NOW
            </span>
          </div>
        )}
        {showUser && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 transition-all cursor-pointer"
              style={{
                color: "var(--text-dim)",
                border: "1px solid var(--border)",
                background: "transparent",
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-serif text-[11px] font-bold text-dark"
                style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
              >
                {initial}
              </div>
              <span>{name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-2 rounded-xl py-2 min-w-[220px] z-50"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div className="px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    ID: {profile?.userId || "—"}
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--text-dim)", background: "transparent" }}
                >
                  Settings
                </button>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--text-dim)", background: "transparent" }}
                >
                  Disconnect
                </button>
                <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                <button
                  onClick={() => { setMenuOpen(false); deleteAccount(); }}
                  className="w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--text-dim)", background: "transparent" }}
                >
                  Delete Data
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
