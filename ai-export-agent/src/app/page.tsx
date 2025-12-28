"use client";

import { useCallback, useState } from "react";
import type { AgentProfile } from "@/lib/agent";
import { AgentConsole } from "@/components/agent-console";
import { ProfileForm } from "@/components/profile-form";

const defaultProfile: AgentProfile = {
  businessName: "Bharat Export Hub",
  product: "Premium Basmati Rice (1121 Steamed)",
  targetMarkets: ["UAE", "Saudi Arabia", "UK"],
  pricePoint: "$980/MT FOB Mundra",
  incoterm: "FOB",
  uniqueSellingPoint:
    "APEDA certified milling facility with 24 hr loading SLA and aroma retention tech",
  certifications: ["ISO 22000", "BRCGS", "HACCP"],
  preferredChannels: ["Importers", "Food Service Distributors", "Modern Retail"],
};

export default function Home() {
  const [profile, setProfile] = useState<AgentProfile>(defaultProfile);

  const handleProfileChange = useCallback((value: AgentProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 bg-[radial-gradient(circle_at_top,_#dbeafe,_transparent_55%),radial-gradient(circle_at_bottom,_#ede9fe,_transparent_60%)] text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 md:flex-row md:gap-12 md:pt-16">
        <section className="flex w-full flex-col gap-8 md:w-[45%]">
          <header className="space-y-6 rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl shadow-indigo-200/30 backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 shadow-sm">
              Export Sales AI
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-slate-900">
                स्मार्ट AI एजेंट जो आपके{" "}
                <span className="text-indigo-600">Export Deals</span> बंद करवाए
              </h1>
              <p className="text-base text-slate-600">
                Convert international leads faster with multilingual pitches,
                export pricing playbooks, and compliance-ready follow ups in a
                single console built for Indian exporters.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-slate-600">
              <li className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-3 text-slate-700">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                Tailored talk-tracks for each buyer, aligned to their market
                regulations & preferred incoterms.
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-purple-50/70 p-3 text-slate-700">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                Instant pricing, compliance checklist, and Hindi-English pitch
                deck in one click.
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-3 text-slate-700">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                Actionable follow-up scripts so you close distributors, modern
                retail, and B2B marketplaces swiftly.
              </li>
            </ul>
          </header>
          <ProfileForm value={profile} onChange={handleProfileChange} />
        </section>
        <section className="w-full md:w-[55%]">
          <AgentConsole profile={profile} />
        </section>
      </main>
    </div>
  );
}
