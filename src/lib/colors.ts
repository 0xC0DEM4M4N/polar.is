"use client";

import { useTheme } from "next-themes";

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    ticks: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
    tooltipBg: isDark ? "#13131e" : "#ffffff",
    tooltipBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    tooltipTitle: isDark ? "#fff" : "#1a1a2e",
    tooltipBody: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
    text: isDark ? "#ffffff" : "#1a1a2e",
    textDim: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
    textMuted: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
  };
}

export const CHART_COLORS = {
  mint: "#5DCAA5",
  red: "#e8304a",
  blue: "#378ADD",
  orange: "#EF9F27",
  purple: "#a78bfa",
};
