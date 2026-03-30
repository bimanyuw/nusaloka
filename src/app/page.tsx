"use client";

import { useMemo, useState } from "react";
import IndonesiaMap from "@/src/components/map/IndonesiaMap";
import SearchBar from "@/src/components/map/SearchBar";
import MapLegend from "@/src/components/map/MapLegend";
import RegionAnalysisPanel from "@/src/components/panel/RegionAnalysisPanel";
import { provinceData } from "@/src/data/provinceData";

function normalizeName(value: string) {
  return value.toLowerCase().replace(/_/g, " ").trim();
}

export default function HomePage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const matchedProvince = useMemo(() => {
    if (!searchTerm.trim()) return null;

    return (
      Object.keys(provinceData).find((province) =>
        normalizeName(province).includes(normalizeName(searchTerm))
      ) ?? null
    );
  }, [searchTerm]);

  const activeProvince = matchedProvince || selectedProvince;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-emerald-400">
            NUSALOKA
          </h1>
          <p className="text-slate-400">AI Food Supply Intelligence</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <section>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            <IndonesiaMap
              selectedProvince={activeProvince}
              onSelectProvince={(province) => {
                setSelectedProvince(province);
                setSearchTerm("");
              }}
              searchTerm={searchTerm}
              provinceData={provinceData}
            />

            <MapLegend />
          </section>

          <section>
            <RegionAnalysisPanel
              province={activeProvince}
              provinceData={provinceData}
            />
          </section>
        </div>
      </div>
    </main>
  );
}