"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { routing } from "@/lib/i18n/routing";

const FLAGS: Record<string, string> = {
  "en-gb": "🇬🇧",
  "en-us": "🇺🇸",
  "fr-fr": "🇫🇷",
};

const LABELS: Record<string, string> = {
  "en-gb": "English (UK)",
  "en-us": "English (US)",
  "fr-fr": "Français",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-dim)",
        }}
      >
        <span className="text-base leading-none">{FLAGS[locale]}</span>
        <span>{LABELS[locale]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-xl py-2 min-w-[180px] z-50"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className="w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer flex items-center gap-2"
              style={{
                color: l === locale ? "#5DCAA5" : "var(--text-dim)",
                background: "transparent",
              }}
            >
              <span className="text-base leading-none">{FLAGS[l]}</span>
              <span>{LABELS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
