"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";

export function SetupPanel() {
  const t = useTranslations("dashboard.setup");
  const p = useTranslations("dashboard.privacyModal");
  const { login, setIsDemo } = useAuth();
  const [consent, setConsent] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    if (!consent) {
      setError("Please agree to the privacy notice before signing in.");
      return;
    }
    setError("");
    login();
  }

  return (
    <div className="max-w-[680px] mx-auto mt-14 px-6">
      <div
        className="rounded-2xl p-8 lg:p-10 relative overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mint to-transparent" />
        <h1 className="font-serif text-[26px] font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
          {t("title")}
        </h1>
        <p className="text-[13px] leading-relaxed mb-8" style={{ color: "var(--text-dim)" }}>
          {t("description")}
        </p>

        <div className="mb-5">
          <button
            onClick={handleLogin}
            className="w-full bg-mint text-dark text-sm font-medium px-5 py-3.5 rounded-full hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {t("signIn")}
          </button>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
          <input
            type="checkbox"
            id="gdpr-consent"
            className="mt-0.5 w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: "#5DCAA5" }}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <label htmlFor="gdpr-consent" className="text-[11px] leading-relaxed cursor-pointer" style={{ color: "var(--text-dim)" }}>
            {t("consent")}{" "}
            <button onClick={() => setPrivacyOpen(true)} className="text-mint hover:underline bg-transparent border-none cursor-pointer p-0 text-[11px]">
              {t("privacyNotice")}
            </button>
            . I can delete my data at any time.
          </label>
        </div>

        {error && (
          <div
            className="rounded-lg px-4 py-3 text-xs mt-3"
            style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", color: "var(--error-text)" }}
          >
            {error}
          </div>
        )}

        {privacyOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            style={{ background: "rgba(12,12,20,0.85)", backdropFilter: "blur(4px)" }}
          >
            <div
              className="max-w-[520px] w-full mx-4 rounded-2xl p-8 relative"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mint to-transparent" />
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold" style={{ color: "var(--text)" }}>{p("title")}</h2>
                <button onClick={() => setPrivacyOpen(false)} className="text-[20px] leading-none" style={{ color: "var(--text-muted)" }}>&times;</button>
              </div>
              <div className="text-[12px] leading-relaxed space-y-4" style={{ color: "var(--text-dim)" }}>
                <p><strong style={{ color: "var(--text)" }}>{p("whatData")}:</strong> {p("whatDataText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("legalBasis")}:</strong> {p("legalBasisText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("storage")}:</strong> {p("storageText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("sharing")}:</strong> {p("sharingText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("rights")}:</strong> {p("rightsText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("retention")}:</strong> {p("retentionText")}</p>
                <p><strong style={{ color: "var(--text)" }}>{p("contact")}:</strong> {p("contactText")}</p>
              </div>
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setPrivacyOpen(false)} className="bg-mint text-dark text-sm font-medium px-5 py-2.5 rounded-full hover:brightness-110 transition-all cursor-pointer w-full">
                  {p("understand")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t("explore")}</span>
          <button
            onClick={() => setIsDemo(true)}
            className="text-xs rounded-lg px-4 py-2 transition-all cursor-pointer"
            style={{ color: "var(--text-dim)", border: "1px solid var(--border)", background: "var(--surface-light)" }}
          >
            {t("demo")}
          </button>
        </div>
      </div>
    </div>
  );
}
