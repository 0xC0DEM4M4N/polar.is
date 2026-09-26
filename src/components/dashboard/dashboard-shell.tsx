"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { DashboardHeader } from "@/components/dashboard/header";
import { SetupPanel } from "@/components/dashboard/setup-panel";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { TodayTab } from "@/components/dashboard/today-tab";
import { HeartRateTab } from "@/components/dashboard/heart-rate-tab";
import { SleepTab } from "@/components/dashboard/sleep-tab";
import { ActivityTab } from "@/components/dashboard/activity-tab";
import { RecoveryTab } from "@/components/dashboard/recovery-tab";
import { InsightsTab } from "@/components/dashboard/insights-tab";
import { CompareTab } from "@/components/dashboard/compare-tab";
import { usePolarData } from "@/hooks/use-polar-data";

const tabs = [
  "overview",
  "today",
  "heartRate",
  "sleep",
  "activity",
  "recovery",
  "insights",
  "compare",
] as const;

type TabId = (typeof tabs)[number];

function DashboardContent() {
  const { isLoggedIn, isDemo, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [range, setRange] = useState(14);
  const t = useTranslations("dashboard");

  const showDashboard = isLoggedIn || isDemo;
  const { sleep, recharge, activity, heartRate, loading: dataLoading, refresh } = usePolarData(showDashboard && !isDemo);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-3.5" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Checking session…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      {!showDashboard ? (
        <SetupPanel />
      ) : (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-7 fade-in">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                {t("period")}
              </span>
              <div className="flex gap-1.5">
                {[7, 14, 28].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`pill px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${range === r ? "pill-active font-medium" : ""}`}
                    style={
                      range === r
                        ? {}
                        : { background: "var(--surface)", color: "var(--text-dim)", border: "1px solid var(--border)" }
                    }
                  >
                    {r}d
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={refresh}
              className="text-[10px] rounded-md px-2.5 py-1 transition-all cursor-pointer"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)", background: "transparent" }}
            >
              {t("refresh")}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto" style={{ borderBottom: "1px solid var(--border)" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[13px] bg-transparent border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "border-mint text-mint"
                    : "border-transparent"
                }`}
                style={activeTab === tab ? {} : { color: "var(--text-muted)" }}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <OverviewTab
              sleep={sleep}
              recharge={recharge}
              activity={activity}
              range={range}
              isDemo={isDemo}
            />
          )}
          {activeTab === "today" && (
            <TodayTab
              sleep={sleep}
              activity={activity}
              heartRate={heartRate}
              isDemo={isDemo}
            />
          )}
          {activeTab === "heartRate" && (
            <HeartRateTab heartRate={heartRate} isDemo={isDemo} range={range} />
          )}
          {activeTab === "sleep" && <SleepTab sleep={sleep} range={range} isDemo={isDemo} />}
          {activeTab === "activity" && <ActivityTab activity={activity} range={range} isDemo={isDemo} />}
          {activeTab === "recovery" && <RecoveryTab recharge={recharge} range={range} isDemo={isDemo} />}
          {activeTab === "insights" && (
            <InsightsTab
              sleep={sleep}
              recharge={recharge}
              activity={activity}
              range={range}
              isDemo={isDemo}
            />
          )}
          {activeTab === "compare" && (
            <CompareTab
              sleep={sleep}
              recharge={recharge}
              activity={activity}
              range={range}
              isDemo={isDemo}
            />
          )}
        </div>
      )}
    </>
  );
}

export function DashboardShell() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
