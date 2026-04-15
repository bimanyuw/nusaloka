"use client";

import { useMemo, useState } from "react";
import IndonesiaMap from "@/src/components/map/IndonesiaMap";
import SearchBar from "@/src/components/map/SearchBar";
import MapLegend from "@/src/components/map/MapLegend";
import RegionAnalysisPanel from "@/src/components/panel/RegionAnalysisPanel";
import TopNavbar from "@/src/components/navigation/TopNavbar";
import MetricStrip from "@/src/components/shared/MetricStrip";
import { provinceData } from "@/src/data/provinceData";

type Tab = "map" | "allocation" | "substitution" | "warning" | "policy" | "score";

const allocationScenarios = [
  "Harga naik",
  "Gagal panen",
  "Jalur distribusi terganggu",
  "Musim kemarau",
  "Musim hujan",
] as const;

const allProvinces = Object.keys(provinceData).sort();

function normalizeName(value: string) {
  return value.toLowerCase().replace(/_/g, " ").trim();
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getAllocationInsight(
  region: string,
  commodity: string,
  scenario: string,
) {
  const key = normalizeName(region);

  if (key.includes("papua")) {
    return {
      from: "Sulawesi Selatan",
      to: region,
      surplus: `Sulawesi Selatan (+140 ton ${commodity.toLowerCase()})`,
      deficit: `${region} (-92 ton ${commodity.toLowerCase()})`,
      cost: 215000000,
      priceStabilization: "-10%",
      duration: "4–6 hari",
      route: "Pelabuhan Makassar → Pelabuhan Jayapura",
      narrative:
        scenario === "Harga naik"
          ? "Model memprioritaskan suplai dari Sulawesi Selatan karena stabilitas harga lebih baik dan jalur logistik masih efisien."
          : "Model memindahkan suplai dari hub timur yang paling stabil agar tekanan supply shock di Papua turun lebih cepat.",
    };
  }
  if (key.includes("ntt")) {
    return {
      from: "Sulawesi Selatan",
      to: "NTT",
      surplus: `Sulawesi Selatan (+95 ton ${commodity.toLowerCase()})`,
      deficit: `NTT (-66 ton ${commodity.toLowerCase()})`,
      cost: 174000000,
      priceStabilization: "-9%",
      duration: "2–3 hari",
      route: "Pelabuhan Makassar → Pelabuhan Kupang",
      narrative:
        "Distribusi diarahkan dari Sulawesi Selatan karena kombinasi surplus regional, akses pelabuhan, dan kestabilan pasokan lebih kuat.",
    };
  }
  if (key.includes("maluku")) {
    return {
      from: "Sulawesi Selatan",
      to: region,
      surplus: `Sulawesi Selatan (+88 ton ${commodity.toLowerCase()})`,
      deficit: `${region} (-62 ton ${commodity.toLowerCase()})`,
      cost: 196000000,
      priceStabilization: "-8%",
      duration: "3–5 hari",
      route: "Pelabuhan Makassar → Pelabuhan Ambon",
      narrative:
        "Rute Makassar–Ambon adalah jalur paling efisien untuk redistribusi ke Maluku dengan frekuensi kapal memadai.",
    };
  }
  if (key.includes("jakarta") || key.includes("dki") || key.includes("banten")) {
    return {
      from: "Lampung",
      to: region,
      surplus: `Lampung (+120 ton ${commodity.toLowerCase()})`,
      deficit: `${region} (-80 ton ${commodity.toLowerCase()})`,
      cost: 128000000,
      priceStabilization: "-12%",
      duration: "6–12 jam",
      route: "Bakauheni → Merak (penyeberangan)",
      narrative:
        "Optimization engine memilih Lampung karena surplus tinggi, jarak logistik pendek, dan potensi penurunan harga paling cepat.",
    };
  }
  if (key.includes("kalimantan")) {
    return {
      from: "Jawa Timur",
      to: region,
      surplus: `Jawa Timur (+130 ton ${commodity.toLowerCase()})`,
      deficit: `${region} (-74 ton ${commodity.toLowerCase()})`,
      cost: 168000000,
      priceStabilization: "-9%",
      duration: "1–2 hari",
      route: "Pelabuhan Tanjung Perak → Pelabuhan Banjarmasin/Balikpapan",
      narrative:
        "Model memilih Jawa Timur karena kapasitas surplus terbesar dan jalur pelabuhan ke Kalimantan paling terjadwal.",
    };
  }
  return {
    from: "Jawa Timur",
    to: region,
    surplus: `Jawa Timur (+110 ton ${commodity.toLowerCase()})`,
    deficit: `${region} (-74 ton ${commodity.toLowerCase()})`,
    cost: 162000000,
    priceStabilization: "-8%",
    duration: "1–3 hari",
    route: "Via jalur darat/laut Jawa Timur",
    narrative:
      "Model memilih Jawa Timur sebagai origin karena cluster distribusinya paling siap dan peluang stabilisasi harga relatif tinggi.",
  };
}

type SubstitutionResult = {
  alternatives: { name: string; availability: string; costDiff: string; nutrition: string }[];
  reason: string;
  nutrition: { item: string; calories: number; protein: number; carbs: number }[];
};

function getSubstitutionInsight(
  region: string,
  commodity: string,
  priceIncrease: number,
): SubstitutionResult {
  const key = normalizeName(region);
  const urgency = priceIncrease >= 30 ? "tinggi" : priceIncrease >= 15 ? "sedang" : "rendah";

  if (commodity === "Beras") {
    if (key.includes("papua") || key.includes("maluku")) {
      return {
        alternatives: [
          { name: "Sagu", availability: "Sangat Tinggi", costDiff: "-31%", nutrition: "354 kal/100g" },
          { name: "Ubi Jalar", availability: "Tinggi", costDiff: "-24%", nutrition: "86 kal/100g" },
          { name: "Jagung", availability: "Sedang", costDiff: "-18%", nutrition: "355 kal/100g" },
        ],
        reason: `Dengan kenaikan harga beras ${priceIncrease}% (urgensi: ${urgency}), AI merekomendasikan sagu sebagai substitusi primer karena ketersediaan sangat tinggi secara lokal dan biaya distribusi jauh lebih rendah dibanding impor beras antarwilayah. Nilai gizi karbohidrat tetap kompetitif.`,
        nutrition: [
          { item: "Beras", calories: 360, protein: 6.8, carbs: 79 },
          { item: "Sagu", calories: 353, protein: 0.2, carbs: 84 },
          { item: "Ubi Jalar", calories: 86, protein: 1.6, carbs: 20 },
        ],
      };
    }
    if (key.includes("ntt") || key.includes("ntb")) {
      return {
        alternatives: [
          { name: "Sorgum", availability: "Sangat Tinggi", costDiff: "-28%", nutrition: "329 kal/100g" },
          { name: "Jagung", availability: "Tinggi", costDiff: "-21%", nutrition: "355 kal/100g" },
          { name: "Singkong", availability: "Tinggi", costDiff: "-25%", nutrition: "160 kal/100g" },
        ],
        reason: `Kenaikan ${priceIncrease}% mendorong substitusi ke sorgum — komoditas lokal paling adaptif terhadap iklim kering NTT. Sorgum memiliki ketahanan kekeringan tinggi dan sudah dikenal masyarakat lokal sebagai sumber karbohidrat.`,
        nutrition: [
          { item: "Beras", calories: 360, protein: 6.8, carbs: 79 },
          { item: "Sorgum", calories: 329, protein: 10.6, carbs: 72 },
          { item: "Jagung", calories: 355, protein: 9.2, carbs: 74 },
        ],
      };
    }
    return {
      alternatives: [
        { name: "Jagung", availability: "Tinggi", costDiff: "-22%", nutrition: "355 kal/100g" },
        { name: "Singkong", availability: "Sangat Tinggi", costDiff: "-34%", nutrition: "160 kal/100g" },
        { name: "Sorgum", availability: "Sedang", costDiff: "-27%", nutrition: "329 kal/100g" },
      ],
      reason: `Kenaikan ${priceIncrease}% mendorong rekomendasi jagung dan singkong sebagai substitusi primer. Keduanya tersedia luas di wilayah ini dengan infrastruktur distribusi yang sudah ada. Sorgum menjadi opsi ketiga untuk diversifikasi gizi.`,
      nutrition: [
        { item: "Beras", calories: 360, protein: 6.8, carbs: 79 },
        { item: "Jagung", calories: 355, protein: 9.2, carbs: 74 },
        { item: "Singkong", calories: 160, protein: 1.2, carbs: 38 },
      ],
    };
  }

  return {
    alternatives: [
      { name: "Singkong", availability: "Sangat Tinggi", costDiff: "-29%", nutrition: "160 kal/100g" },
      { name: "Ubi Jalar", availability: "Tinggi", costDiff: "-23%", nutrition: "86 kal/100g" },
      { name: "Sagu", availability: "Sedang", costDiff: "-18%", nutrition: "354 kal/100g" },
    ],
    reason: `Kenaikan ${priceIncrease}% pada ${commodity} mendorong substitusi ke singkong dan ubi jalar yang tersedia secara lokal dengan biaya distribusi lebih rendah. Nilai gizi karbohidrat tetap terjaga.`,
    nutrition: [
      { item: commodity, calories: 355, protein: 9.2, carbs: 74 },
      { item: "Singkong", calories: 160, protein: 1.2, carbs: 38 },
      { item: "Ubi Jalar", calories: 86, protein: 1.6, carbs: 20 },
    ],
  };
}

function getWarningAlerts() {
  const riskProvinces = Object.entries(provinceData)
    .filter(([, d]) => d.score < 60)
    .sort((a, b) => a[1].score - b[1].score)
    .slice(0, 8);

  return riskProvinces.map(([name, data]) => ({
    region: name,
    score: data.score,
    commodity: data.topCommodity,
    riskLevel: data.score < 40 ? ("Tinggi" as const) : ("Sedang" as const),
    signals: data.riskFactors.slice(0, 3),
    recommendation: data.recommendation.split(".")[0] + ".",
    priceIndex: data.priceIndex,
    gap: data.demand - data.production,
  }));
}

function getPolicyInsight(policy: string, intensity: number) {
  const factor = intensity / 100;
  if (policy.includes("Subsidi transport")) {
    return {
      nationalPrice: `-${Math.round(8 * factor)}%`,
      stability: `+${Math.round(12 * factor)}%`,
      logistics: `+${Math.round(4 * factor)}%`,
      riskReduction: Math.round(15 * factor),
      affectedProvinces: Math.round(12 * factor),
      note: "Subsidi transport paling cepat memperbaiki efisiensi distribusi tanpa menekan suplai produsen secara langsung. Model memproyeksikan penurunan harga di 12 provinsi dalam 4 minggu.",
    };
  }
  if (policy.includes("Larangan ekspor")) {
    return {
      nationalPrice: `-${Math.round(5 * factor)}%`,
      stability: `+${Math.round(6 * factor)}%`,
      logistics: `+${Math.round(9 * factor)}%`,
      riskReduction: Math.round(8 * factor),
      affectedProvinces: Math.round(8 * factor),
      note: "Larangan ekspor menahan suplai domestik, tetapi ada trade-off pada biaya logistik dan perilaku pasar regional. Efek samping: harga produsen turun dan insentif produksi melemah.",
    };
  }
  if (policy.includes("HET")) {
    return {
      nationalPrice: `-${Math.round(6 * factor)}%`,
      stability: `+${Math.round(9 * factor)}%`,
      logistics: `+${Math.round(3 * factor)}%`,
      riskReduction: Math.round(10 * factor),
      affectedProvinces: Math.round(10 * factor),
      note: "Harga Eceran Tertinggi membantu stabilisasi jangka pendek, tetapi perlu dikombinasikan dengan intervensi distribusi agar pasokan tetap aman di wilayah terpencil.",
    };
  }
  return {
    nationalPrice: `-${Math.round(7 * factor)}%`,
    stability: `+${Math.round(10 * factor)}%`,
    logistics: `+${Math.round(5 * factor)}%`,
    riskReduction: Math.round(12 * factor),
    affectedProvinces: Math.round(9 * factor),
    note: "Redistribusi dari provinsi surplus ke defisit adalah kebijakan paling berkelanjutan. Model memproyeksikan penurunan wilayah rawan sebesar 12% dalam 2 bulan.",
  };
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "#bde9ca" : score >= 60 ? "#f7e7a7" : "#f6b0ab";
  const textColor =
    score >= 80 ? "#15803d" : score >= 60 ? "#92400e" : "#be123c";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold" style={{ color: textColor }}>
        {score}
      </span>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Allocation
  const [allocationRegion, setAllocationRegion] = useState("DKI Jakarta");
  const [allocationCommodity, setAllocationCommodity] = useState("Beras");
  const [allocationScenario, setAllocationScenario] =
    useState<(typeof allocationScenarios)[number]>("Harga naik");

  // Substitution
  const [substitutionRegion, setSubstitutionRegion] = useState("Papua");
  const [mainCommodity, setMainCommodity] = useState("Beras");
  const [priceIncrease, setPriceIncrease] = useState(30);

  // Policy
  const [policy, setPolicy] = useState("Subsidi transport Rp200/kg");
  const [policyIntensity, setPolicyIntensity] = useState(60);

  const matchedProvince = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return (
      Object.keys(provinceData).find((p) =>
        normalizeName(p).includes(normalizeName(searchTerm)),
      ) ?? null
    );
  }, [searchTerm]);

  const activeProvince = matchedProvince || selectedProvince;

  const stats = useMemo(() => {
    const entries = Object.entries(provinceData);
    return {
      total: entries.length,
      stable: entries.filter(([, d]) => d.score >= 80).length,
      moderate: entries.filter(([, d]) => d.score >= 60 && d.score < 80).length,
      risk: entries.filter(([, d]) => d.score < 60).length,
      average: Math.round(
        entries.reduce((s, [, d]) => s + d.score, 0) / entries.length,
      ),
    };
  }, []);

  const allocationInsight = useMemo(
    () => getAllocationInsight(allocationRegion, allocationCommodity, allocationScenario),
    [allocationRegion, allocationCommodity, allocationScenario],
  );

  const mapRoute = useMemo(
    () => ({
      from: allocationInsight.from,
      to: allocationInsight.to,
      label: `${allocationInsight.from} → ${allocationInsight.to}`,
    }),
    [allocationInsight],
  );

  const substitutionInsight = useMemo(
    () => getSubstitutionInsight(substitutionRegion, mainCommodity, priceIncrease),
    [substitutionRegion, mainCommodity, priceIncrease],
  );

  const warningAlerts = useMemo(() => getWarningAlerts(), []);
  const policyInsight = useMemo(
    () => getPolicyInsight(policy, policyIntensity),
    [policy, policyIntensity],
  );

  const scoreRanking = useMemo(() => {
    return Object.entries(provinceData)
      .sort((a, b) => a[1].score - b[1].score)
      .map(([name, data]) => ({ name, ...data }));
  }, []);

  return (
    <main className="min-h-screen">
      <TopNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <MetricStrip stats={stats} />

      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ── MAP WORKSPACE ── */}
        {activeTab === "map" && (
          <div className="space-y-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="grid gap-4 lg:grid-cols-[220px_1fr_280px]">
              {/* Left sidebar */}
              <aside className="space-y-4">
                <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                    Filter Status
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Semua", "Stable", "Moderate", "High Risk"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          f === "Semua"
                            ? "border-[#3558df] bg-[#edf2ff] text-[#1d2f9b]"
                            : "border-slate-200 text-slate-500 hover:border-[#3558df]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                    Wilayah Prioritas
                  </p>
                  <div className="mt-3 space-y-2">
                    {Object.entries(provinceData)
                      .filter(([, d]) => d.score < 60)
                      .sort((a, b) => a[1].score - b[1].score)
                      .slice(0, 6)
                      .map(([name, data]) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setSelectedProvince(name);
                            setSearchTerm("");
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                            activeProvince === name ? "bg-[#edf2ff]" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full flex-shrink-0"
                              style={{
                                background: data.score < 40 ? "#f6b0ab" : "#f7e7a7",
                              }}
                            />
                            <span className="text-slate-700 truncate max-w-[110px]">{name}</span>
                          </div>
                          <span className="font-semibold text-slate-500">{data.score}</span>
                        </button>
                      ))}
                  </div>
                </div>

                <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                    Komoditas Layer
                  </p>
                  <div className="mt-3 space-y-2">
                    {["Beras", "Jagung", "Kedelai", "Sagu"].map((c) => (
                      <label
                        key={c}
                        className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={c === "Beras"}
                          className="h-3 w-3"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Map */}
              <div className="space-y-3">
                <IndonesiaMap
                  selectedProvince={activeProvince}
                  onSelectProvince={(p) => {
                    setSelectedProvince(p);
                    setSearchTerm("");
                  }}
                  searchTerm={searchTerm}
                  provinceData={provinceData}
                  route={mapRoute}
                />
                <MapLegend />
              </div>

              {/* Right SHAP panel */}
              <aside className="space-y-4">
                {activeProvince && provinceData[activeProvince] ? (
                  <>
                    <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                        AI Insight · {activeProvince}
                      </p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-slate-900">
                          {provinceData[activeProvince].score}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            provinceData[activeProvince].score >= 80
                              ? "bg-emerald-50 text-emerald-700"
                              : provinceData[activeProvince].score >= 60
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {provinceData[activeProvince].cluster === "surplus"
                            ? "Surplus"
                            : provinceData[activeProvince].cluster === "stabil"
                              ? "Stabil"
                              : "Rentan"}
                        </span>
                      </div>

                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        SHAP Factors
                      </p>
                      <div className="mt-2 space-y-2">
                        {provinceData[activeProvince].shapFactors.map((f) => (
                          <div key={f.label} className="flex items-center gap-2">
                            <span className="w-[90px] truncate text-[10px] text-slate-500">
                              {f.label}
                            </span>
                            <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(Math.abs(f.value) * 10, 100)}%`,
                                  background:
                                    f.direction === "pos" ? "#bde9ca" : "#f6b0ab",
                                }}
                              />
                            </div>
                            <span
                              className={`w-8 text-right text-[10px] font-semibold ${
                                f.direction === "pos" ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {f.direction === "pos" ? "+" : ""}
                              {f.value.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                        Rekomendasi Distribusi
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        {provinceData[activeProvince].recommendation}
                      </p>
                    </div>

                    <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                        Substitusi Pangan
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        {provinceData[activeProvince].substitution}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="glass-card rounded-[24px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_12px_30px_rgba(37,63,176,0.06)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3558df]">
                      Region Insight
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Pilih provinsi
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Klik provinsi di peta untuk melihat SHAP analysis, rekomendasi distribusi, dan insight substitusi pangan.
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        { label: "Stable", color: "#bde9ca", text: "score ≥ 80" },
                        { label: "Moderate", color: "#f7e7a7", text: "score 60–79" },
                        { label: "High Risk", color: "#f6b0ab", text: "score < 60" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500">
                          <span
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ background: item.color }}
                          />
                          <span className="font-medium">{item.label}</span>
                          <span>— {item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
            <RegionAnalysisPanel province={activeProvince} provinceData={provinceData} />
          </div>
        )}

        {/* ── ALLOCATION WORKSPACE ── */}
        {activeTab === "allocation" && (
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <section className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                Smart Food Allocation Simulator
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Simulasikan distribusi optimal
              </h3>
              <div className="mt-5 space-y-4">
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Wilayah tujuan</span>
                  <select
                    value={allocationRegion}
                    onChange={(e) => setAllocationRegion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    {allProvinces.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Komoditas</span>
                  <select
                    value={allocationCommodity}
                    onChange={(e) => setAllocationCommodity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    {["Beras", "Jagung", "Gula", "Minyak Goreng", "Kedelai"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Skenario kondisi</span>
                  <select
                    value={allocationScenario}
                    onChange={(e) =>
                      setAllocationScenario(
                        e.target.value as (typeof allocationScenarios)[number],
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    {allocationScenarios.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 rounded-[20px] bg-[#f4f7ff] p-4 text-xs leading-6 text-slate-600">
                <p className="font-semibold text-slate-800">Cara kerja model:</p>
                Model menjalankan time-series forecasting (Prophet), clustering wilayah (K-Means), dan optimization distribusi secara offline untuk menghasilkan jalur distribusi paling efisien berdasarkan surplus/defisit aktual.
              </div>
            </section>

            <section className="space-y-5">
              <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                      Simulation Output
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                      {allocationInsight.from}{" "}
                      <span className="text-[#3558df]">→</span>{" "}
                      {allocationInsight.to}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Via {allocationInsight.route}
                    </p>
                  </div>
                  <span className="rounded-full border border-[rgba(73,191,209,0.25)] bg-[#effbfd] px-4 py-1.5 text-xs font-semibold text-[#0f6f85]">
                    Optimal route active
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Surplus wilayah asal", value: allocationInsight.surplus },
                    { label: "Defisit wilayah tujuan", value: allocationInsight.deficit },
                    { label: "Estimasi biaya logistik", value: formatRupiah(allocationInsight.cost) },
                    { label: "Stabilisasi harga", value: allocationInsight.priceStabilization },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-slate-200 bg-white p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-4">
                  <div className="rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      Durasi pengiriman
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {allocationInsight.duration}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      Skenario aktif
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {allocationScenario}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4 text-sm leading-7 text-slate-600">
                  {allocationInsight.narrative}
                </div>
              </div>

              {/* SHAP for allocation */}
              <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                  SHAP Explainability · {allocationInsight.to}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Faktor utama yang mempengaruhi rekomendasi distribusi ini
                </p>
                <div className="mt-4 space-y-2">
                  {(provinceData[allocationInsight.to]?.shapFactors ?? provinceData["Papua"].shapFactors).map(
                    (f) => (
                      <div key={f.label} className="flex items-center gap-3">
                        <span className="w-32 text-xs text-slate-500">{f.label}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(Math.abs(f.value) * 10, 100)}%`,
                              background: f.direction === "pos" ? "#bde9ca" : "#f6b0ab",
                            }}
                          />
                        </div>
                        <span
                          className={`w-10 text-right text-xs font-semibold ${
                            f.direction === "pos" ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {f.direction === "pos" ? "+" : ""}
                          {f.value.toFixed(1)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── SUBSTITUTION WORKSPACE ── */}
        {activeTab === "substitution" && (
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <section className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                AI Food Substitution Engine
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Alternatif pangan lokal yang adaptif
              </h3>
              <div className="mt-5 space-y-4">
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Komoditas utama</span>
                  <select
                    value={mainCommodity}
                    onChange={(e) => setMainCommodity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    {["Beras", "Jagung", "Gula", "Minyak Goreng", "Terigu"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Wilayah</span>
                  <select
                    value={substitutionRegion}
                    onChange={(e) => setSubstitutionRegion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    {allProvinces.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Kenaikan harga</span>
                    <span className="font-semibold text-[#3558df]">{priceIncrease}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={priceIncrease}
                    onChange={(e) => setPriceIncrease(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5% (rendah)</span>
                    <span>60% (ekstrem)</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                  AI Recommendation
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  Substitusi {mainCommodity} untuk {substitutionRegion}
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {substitutionInsight.alternatives.map((item, index) => (
                    <div
                      key={item.name}
                      className="rounded-[20px] border border-slate-200 bg-white p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        Alternatif {index + 1}
                      </p>
                      <p className="mt-1.5 text-lg font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Ketersediaan</span>
                          <span className="font-medium text-slate-700">{item.availability}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Selisih biaya</span>
                          <span className="font-semibold text-emerald-600">{item.costDiff}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Nilai gizi</span>
                          <span>{item.nutrition}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4 text-sm leading-7 text-slate-600">
                  {substitutionInsight.reason}
                </div>
              </div>

              <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                  Nutritional Comparison
                </p>
                <div className="mt-4 overflow-hidden rounded-[16px] border border-slate-200">
                  <div className="grid grid-cols-4 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    <div className="px-4 py-3">Komoditas</div>
                    <div className="px-4 py-3">Kalori (per 100g)</div>
                    <div className="px-4 py-3">Protein (g)</div>
                    <div className="px-4 py-3">Karbohidrat (g)</div>
                  </div>
                  {substitutionInsight.nutrition.map((row, i) => (
                    <div
                      key={row.item}
                      className={`grid grid-cols-4 border-t border-slate-100 text-sm ${
                        i === 0 ? "font-medium bg-[#fafbff]" : ""
                      }`}
                    >
                      <div className="px-4 py-3 text-slate-800">{row.item}</div>
                      <div className="px-4 py-3 text-slate-600">{row.calories}</div>
                      <div className="px-4 py-3 text-slate-600">{row.protein}</div>
                      <div className="px-4 py-3 text-slate-600">{row.carbs}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── RISK WARNING WORKSPACE ── */}
        {activeTab === "warning" && (
          <div className="space-y-5">
            <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                    Supply Risk Early Warning
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    AI radar ketahanan pangan — deteksi anomali real-time
                  </h3>
                </div>
                <span className="flex-shrink-0 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-700">
                  {warningAlerts.filter((a) => a.riskLevel === "Tinggi").length} Alert Aktif
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {warningAlerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.region}
                  className={`rounded-[24px] border p-5 ${
                    alert.riskLevel === "Tinggi"
                      ? "border-rose-200 bg-rose-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          alert.riskLevel === "Tinggi" ? "text-rose-600" : "text-amber-600"
                        }`}
                      >
                        {alert.riskLevel === "Tinggi" ? "⚠ High Risk" : "Moderate"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {alert.region}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        alert.riskLevel === "Tinggi"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {alert.score}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {alert.signals.map((s) => (
                      <p key={s} className="text-[10px] text-slate-600 leading-4">
                        · {s}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] leading-4 text-slate-500">
                    {alert.recommendation}
                  </p>
                  <div className="mt-3 flex gap-2 text-[10px]">
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-slate-500">
                      {alert.commodity}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        alert.priceIndex > 20
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      Harga +{alert.priceIndex}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POLICY SIMULATOR WORKSPACE ── */}
        {activeTab === "policy" && (
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <section className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                AI Policy Simulator
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Uji dampak kebijakan sebelum diterapkan
              </h3>
              <div className="mt-5 space-y-4">
                <label className="block space-y-1.5 text-sm text-slate-600">
                  <span>Pilihan kebijakan</span>
                  <select
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3558df]"
                  >
                    <option>Subsidi transport Rp200/kg</option>
                    <option>Larangan ekspor komoditas strategis</option>
                    <option>HET (Harga Eceran Tertinggi)</option>
                    <option>Redistribusi surplus antar provinsi</option>
                  </select>
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Intensitas implementasi</span>
                    <span className="font-semibold text-[#3558df]">{policyIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={policyIntensity}
                    onChange={(e) => setPolicyIntensity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-5 rounded-[20px] bg-[#f4f7ff] p-4 text-xs leading-6 text-slate-600">
                Model mensimulasikan dampak kebijakan terhadap harga nasional, stabilitas supply, dan biaya logistik menggunakan Predictive Analytics berbasis data historis PIHPS dan BPS.
              </div>
            </section>

            <section className="space-y-5">
              <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                  Predicted Policy Impact
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {policy}
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Penurunan harga nasional",
                      value: policyInsight.nationalPrice,
                      color: "text-emerald-600",
                    },
                    {
                      label: "Peningkatan stabilitas supply",
                      value: policyInsight.stability,
                      color: "text-[#1d2f9b]",
                    },
                    {
                      label: "Efisiensi biaya logistik",
                      value: policyInsight.logistics,
                      color: "text-[#3558df]",
                    },
                    {
                      label: "Provinsi terdampak positif",
                      value: `${policyInsight.affectedProvinces} prov.`,
                      color: "text-slate-900",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-slate-200 bg-white p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        {item.label}
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${item.color}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-2">
                      Proyeksi pengurangan wilayah rawan
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[#bde9ca] transition-all duration-500"
                        style={{ width: `${policyInsight.riskReduction}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      -{policyInsight.riskReduction}% wilayah rawan dalam 2 bulan
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-4 text-sm leading-6 text-slate-600">
                    {policyInsight.note}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── FOOD SECURITY SCORE WORKSPACE ── */}
        {activeTab === "score" && (
          <div className="space-y-5">
            <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_16px_50px_rgba(37,63,176,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                    Food Security Score — Semua Provinsi
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Ranking Supply Readiness Score (0–100) · {stats.total} Provinsi
                  </h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: `${stats.stable} Stable`, bg: "bg-emerald-50", text: "text-emerald-700" },
                    { label: `${stats.moderate} Moderate`, bg: "bg-amber-50", text: "text-amber-700" },
                    { label: `${stats.risk} High Risk`, bg: "bg-rose-50", text: "text-rose-700" },
                  ].map((b) => (
                    <span
                      key={b.label}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${b.bg} ${b.text}`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {scoreRanking.map((province) => (
                <button
                  key={province.name}
                  type="button"
                  onClick={() => {
                    setSelectedProvince(province.name);
                    setActiveTab("map");
                  }}
                  className={`rounded-[20px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(37,63,176,0.10)] ${
                    province.score >= 80
                      ? "border-emerald-100 bg-emerald-50 hover:border-emerald-300"
                      : province.score >= 60
                        ? "border-amber-100 bg-amber-50 hover:border-amber-300"
                        : "border-rose-100 bg-rose-50 hover:border-rose-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {province.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {province.topCommodity} · {province.cluster}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-lg font-bold ${
                        province.score >= 80
                          ? "text-emerald-700"
                          : province.score >= 60
                            ? "text-amber-700"
                            : "text-rose-700"
                      }`}
                    >
                      {province.score}
                    </span>
                  </div>
                  <div className="mt-2">
                    <ScoreBar score={province.score} />
                  </div>
                  <p className="mt-2 text-[10px] leading-4 text-slate-500 line-clamp-2">
                    {province.recommendation.split(".")[0]}.
                  </p>
                  <p className="mt-2 text-[10px] text-[#3558df] font-medium">
                    Klik untuk lihat di peta →
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
