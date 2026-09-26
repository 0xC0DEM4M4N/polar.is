"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <div className="px-8 py-8 flex justify-between items-center flex-wrap gap-2">
      <span className="font-serif text-base" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
        polar<span className="text-mint/50">.</span>
        <span className="opacity-40">is</span>
      </span>
      <span className="text-[11px]" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
        {t("brand")}
      </span>
      <span className="text-[10px]" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
        {t("uicons")}
      </span>
    </div>
  );
}
