"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="flex justify-between items-center px-8 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2.5">
        <Logo />
        <span className="font-serif text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          polar<span className="text-mint">.</span>
          <span style={{ opacity: 0.35 }}>is</span>
        </span>
      </div>
      <div className="flex gap-6 items-center">
        <Link
          href="#features"
          className="text-[13px] transition-colors no-underline"
          style={{ color: "var(--text-dim)" }}
        >
          {t("features")}
        </Link>
        <Link
          href="/dashboard"
          className="text-[13px] transition-colors no-underline"
          style={{ color: "var(--text-dim)" }}
        >
          {t("dashboard")}
        </Link>
        <Link
          href="/dashboard"
          className="bg-mint text-dark text-[13px] font-medium px-[18px] py-2 rounded-full no-underline"
        >
          {t("getStarted")}
        </Link>
      </div>
    </nav>
  );
}
