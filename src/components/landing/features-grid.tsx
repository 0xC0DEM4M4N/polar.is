"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, Heart, Moon, Users } from "lucide-react";

const icons = {
  trendView: TrendingUp,
  zoneClarity: Heart,
  sleepRecovery: Moon,
  coachDashboard: Users,
};

export function FeaturesGrid() {
  const t = useTranslations("landing.features");

  return (
    <div id="features" className="px-8 py-12">
      <div className="text-[10px] text-mint tracking-widest uppercase mb-4">
        {t("title")}
      </div>
      <h2 className="font-serif text-[32px] font-bold leading-[1.15] mb-3 tracking-tight">
        {t("heading")}
      </h2>
      <p className="text-sm leading-relaxed mb-9 font-light" style={{ color: "var(--text-dim)" }}>
        {t("description")}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {(Object.keys(icons) as Array<keyof typeof icons>).map((key) => {
          const Icon = icons[key];
          return (
            <div
              key={key}
              className="rounded-2xl p-5"
              style={{
                background: "var(--surface)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3.5 text-lg"
                style={{
                  background: "rgba(93, 202, 165, 0.1)",
                  color: "#5DCAA5",
                }}
              >
                <Icon size={18} />
              </div>
              <div className="text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
                {t(`${key}.title`)}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {t(`${key}.description`)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
