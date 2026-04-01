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
        normalizeName(province).includes(normalizeName(searchTerm)),
      ) ?? null
    );
  }, [searchTerm]);

  const activeProvince = matchedProvince || selectedProvince;

  const stats = useMemo(() => {
    const provinces = Object.values(provinceData);
    const surplus = provinces.filter((item) => item.status === "Surplus").length;
    const warning = provinces.filter((item) => item.status === "Waspada").length;
    const deficit = provinces.filter((item) => item.status === "Defisit").length;
    const averageScore = Math.round(
      provinces.reduce((sum, item) => sum + item.score, 0) / provinces.length,
    );

    return { surplus, warning, deficit, averageScore };
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[36px] border border-[rgba(29,47,155,0.14)] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(29,47,155,0.10)] sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,156,95,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(47,184,201,0.12),transparent_24%),linear-gradient(180deg,rgba(48,87,213,0.02),transparent_38%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(29,47,155,0.12)] bg-[rgba(48,87,213,0.05)] px-3 py-1 text-xs font-semibold text-[#1d2f9b]">
                <span className="h-2 w-2 rounded-full bg-[#2fb8c9]" />
                FIND IT Theme Refresh
              </div>

              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                NUSALOKA
              </h1>
              <p className="mt-3 text-lg font-medium text-[#3057d5]">
                AI Food Supply Intelligence
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base text-balance">
                Dashboard pangan berbasis AI untuk membaca kesiapan pasokan antarwilayah,
                mencari provinsi prioritas, dan menampilkan rekomendasi distribusi dengan tampilan
                yang lebih hidup, interaktif, dan selaras dengan nuansa visual FIND IT.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-[rgba(29,47,155,0.10)] bg-[linear-gradient(180deg,#f7faff,#ffffff)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Average score
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.averageScore}</p>
                <p className="mt-2 text-sm text-slate-600">Rata-rata kesiapan pasokan nasional.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-2xl font-semibold text-emerald-700">{stats.surplus}</p>
                  <p className="mt-1 text-xs text-emerald-700">Surplus</p>
                </div>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-2xl font-semibold text-amber-700">{stats.warning}</p>
                  <p className="mt-1 text-xs text-amber-700">Waspada</p>
                </div>
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4">
                  <p className="text-2xl font-semibold text-rose-700">{stats.deficit}</p>
                  <p className="mt-1 text-xs text-rose-700">Defisit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-4">
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
          </div>

          <RegionAnalysisPanel province={activeProvince} provinceData={provinceData} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-5 shadow-[0_18px_50px_rgba(29,47,155,0.08)]">
            <p className="text-sm font-semibold text-slate-900">Hover interaction</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Setiap provinsi sekarang memiliki efek pop-up visual dan tooltip saat cursor diarahkan ke peta.
            </p>
          </div>
          <div className="rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-5 shadow-[0_18px_50px_rgba(29,47,155,0.08)]">
            <p className="text-sm font-semibold text-slate-900">Cleaner visual hierarchy</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tampilan dominan putih dengan aksen biru, cyan, kuning, dan oranye agar lebih dekat dengan identitas FIND IT.
            </p>
          </div>
          <div className="rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-5 shadow-[0_18px_50px_rgba(29,47,155,0.08)]">
            <p className="text-sm font-semibold text-slate-900">Denser landing section</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Hero area, stats, legend, dan analysis panel dibuat lebih penuh agar halaman tidak terasa kosong.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
