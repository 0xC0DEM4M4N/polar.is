"use client";

import { useTranslations } from "next-intl";

const keys = [
  "runner",
  "triathlete",
  "strength",
  "coach",
  "curious",
  "mums",
  "shiftWorkers",
] as const;

export function UseCases() {
  const t = useTranslations("landing.useCases");

  return (
    <div id="for-everyone" className="px-8 py-12">
      <div className="text-[10px] text-mint tracking-widest uppercase mb-4">
        {t("title")}
      </div>
      <h2 className="font-serif text-[32px] font-bold leading-[1.15] mb-3 tracking-tight">
        {t("heading")}
      </h2>
      <p className="text-sm leading-relaxed mb-9 font-light" style={{ color: "var(--text-dim)" }}>
        {t("description")}
      </p>
      <div className="space-y-3">
        {keys.map((key) => (
          <div
            key={key}
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="text-[10px] text-mint tracking-widest uppercase mb-2">
              {t(`${key}.label`)}
            </div>
            <div className="font-serif text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
              {t(`${key}.title`)}
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {t(`${key}.description`)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
