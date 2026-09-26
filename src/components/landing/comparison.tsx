"use client";

import { useTranslations } from "next-intl";

export function Comparison() {
  const t = useTranslations("landing.comparison");
  const items = t.raw("items") as Array<{ from: string; to: string }>;

  return (
    <div id="comparison" className="px-8 py-12">
      <div className="text-[10px] text-mint tracking-widest uppercase mb-4">
        {t("title")}
      </div>
      <h2 className="font-serif text-[32px] font-bold leading-[1.15] mb-3 tracking-tight">
        {t("heading")}
      </h2>
      <p className="text-sm leading-relaxed mb-9 font-light" style={{ color: "var(--text-dim)" }}>
        {t("description")}
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-2xl p-5"
            style={{
              background: "var(--surface)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                Polar Flow
              </div>
              <div className="text-sm" style={{ color: "var(--text-dim)" }}>
                {item.from}
              </div>
            </div>
            <div className="text-mint/40 text-lg leading-none pt-3">→</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-mint tracking-widest uppercase mb-1">
                polar.is
              </div>
              <div className="text-sm" style={{ color: "var(--text)" }}>
                <span className="text-mint font-medium">{item.to.split(" ")[0]}</span>{" "}
                {item.to.split(" ").slice(1).join(" ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
