"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <div className="px-8 pt-[60px] pb-12 relative">
      <div
        className="inline-flex items-center gap-1.5 text-mint text-[11px] font-medium px-3 py-[5px] rounded-full mb-6 tracking-wider uppercase"
        style={{
          background: "var(--mint-dim)",
          border: "1px solid var(--mint-border)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-mint" />
        {t("badge")}
      </div>
      <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight mb-5 max-w-[520px]">
        Your training data. <em className="text-mint not-italic">Finally</em> clear.
      </h1>
      <p className="text-base leading-relaxed max-w-[420px] mb-8 font-light" style={{ color: "var(--text-dim)" }}>
        {t("description")}
      </p>
      <div className="flex gap-3 items-center mb-12">
        <Link
          href="/dashboard"
          className="bg-mint text-dark text-sm font-medium px-6 py-3 rounded-full no-underline"
        >
          {t("ctaPrimary")}
        </Link>
        <Link
          href="/dashboard"
          className="text-sm flex items-center gap-1.5 no-underline transition-colors"
          style={{ color: "var(--text-dim)" }}
        >
          {t("ctaSecondary")}
        </Link>
      </div>

      {/* Hero Screen Mockup */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--surface)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-serif text-[15px]" style={{ color: "var(--text)" }}>
            polar<span className="text-mint">.</span>
            <span className="opacity-35">is</span>
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Tuesday, 8 May
          </span>
        </div>
        <div
          className="rounded-xl p-4 mb-3"
          style={{
            background: "#0f1f1a",
            border: "0.5px solid rgba(93, 202, 165, 0.2)",
          }}
        >
          <div className="text-[10px] text-mint tracking-widest uppercase mb-1.5">
            today&apos;s readiness
          </div>
          <div className="text-xl font-medium mb-0.5" style={{ color: "var(--text)" }}>
            Ready to train
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            HRV +8% · sleep score 81 · load nominal
          </div>
          <div className="mt-3.5">
            <svg width="100%" height="44" viewBox="0 0 580 44">
              <polyline
                points="0,30 60,30 100,8 130,40 160,14 190,26 220,10 310,10 370,20 460,20 520,16 580,16"
                fill="none"
                stroke="#5DCAA5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="100" cy="8" r="4" fill="#5DCAA5" />
              <circle cx="160" cy="14" r="4" fill="#1D9E75" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { color: "#5DCAA5", value: "62", label: "HRV ms" },
            { color: "#378ADD", value: "7h 20m", label: "sleep" },
            { color: "#EF9F27", value: "412", label: "load" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl p-2.5 text-center"
              style={{
                background: "var(--surface-light)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-[5px] h-[5px] rounded-full mx-auto mb-1.5"
                style={{ background: m.color }}
              />
              <div className="text-lg font-medium" style={{ color: "var(--text)" }}>
                {m.value}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-between rounded-xl p-3"
          style={{
            background: "var(--surface-light)",
            border: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <div className="text-xs mb-0.5" style={{ color: "var(--text)" }}>
              Morning run
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              8.4 km · 42 min · Mon
            </div>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(15, 110, 86, 0.4)", color: "#5DCAA5" }}
          >
            zone 1
          </span>
        </div>
      </div>
    </div>
  );
}
