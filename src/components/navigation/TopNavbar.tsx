"use client";

import Image from "next/image";

type Tab = "map" | "allocation" | "substitution" | "warning" | "policy" | "score";

const tabs: { id: Tab; label: string }[] = [
  { id: "map", label: "Interactive Map" },
  { id: "allocation", label: "Allocation Simulator" },
  { id: "substitution", label: "Substitution Engine" },
  { id: "warning", label: "Risk Warning" },
  { id: "policy", label: "Policy Simulator" },
  { id: "score", label: "Food Security Score" },
];

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export default function TopNavbar({ activeTab, onTabChange }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(37,63,176,0.10)] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        
        {/* Brand + Logo Section */}
        <div className="flex items-center gap-0 flex-shrink-0">
          <Image
            src="/Logo.png"
            alt="NUSALOKA logo"
            width={100}
            height={2}
            className="rounded-xxl object-contain"
            priority
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3558df] leading-none">
              NUSALOKA
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-700 leading-none hidden sm:block">
              Adaptive Food Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#edf2ff] text-[#1d2f9b] border border-[#3558df]"
                  : "border border-transparent text-slate-500 hover:border-[rgba(37,63,176,0.15)] hover:text-[#1d2f9b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Mobile Tab Selector */}
        <div className="xl:hidden">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as Tab)}
            className="rounded-xl border border-[rgba(37,63,176,0.15)] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#3558df]"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </header>
  );
}