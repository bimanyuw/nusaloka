"use client";

import { useMemo, useState } from "react";
import IndonesiaMap from "@/src/components/map/IndonesiaMap";
import SearchBar from "@/src/components/map/SearchBar";
import MapLegend from "@/src/components/map/MapLegend";
import RegionAnalysisPanel from "@/src/components/panel/RegionAnalysisPanel";
import TopNavbar from "@/src/components/navigation/TopNavbar";
import { provinceData } from "@/src/data/provinceData";

type FeatureTab = "allocation" | "substitution" | "warning" | "policy" | "score";

const featureTabs: { id: FeatureTab; label: string; kicker: string }[] = [
  { id: "allocation", label: "Smart Food Allocation Simulator", kicker: "Core feature" },
  { id: "substitution", label: "AI Food Substitution Engine", kicker: "Reasoning" },
  { id: "warning", label: "Supply Risk Early Warning", kicker: "Anomaly" },
  { id: "policy", label: "AI Policy Simulator", kicker: "Policy lab" },
  { id: "score", label: "Food Security Score per Region", kicker: "Regional score" },
];

const allocationScenarios = [
  "Gagal panen",
  "Harga naik",
  "Jalur distribusi terganggu",
  "Musim hujan",
  "Musim kering",
] as const;

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

function getAllocationInsight(region: string, commodity: string, scenario: string) {
  const key = normalizeName(region);

  if (key.includes("papua")) {
    return {
      from: "Sulawesi Selatan",
      to: "Papua",
      surplus: `Sulawesi Selatan (+140 ton ${commodity.toLowerCase()})`,
      deficit: `Papua (-92 ton ${commodity.toLowerCase()})`,
      cost: 215000000,
      priceStabilization: "-10%",
      narrative:
        scenario === "Harga naik"
          ? "Model memprioritaskan suplai dari Sulawesi Selatan karena stabilitas harga lebih baik dan jalur logistik masih efisien."
          : "Model memindahkan suplai dari hub timur yang paling stabil agar tekanan supply shock di Papua turun lebih cepat.",
    };
  }

  if (key.includes("jakarta") || key.includes("dki")) {
    return {
      from: "Lampung",
      to: "DKI Jakarta",
      surplus: `Lampung (+120 ton ${commodity.toLowerCase()})`,
      deficit: `DKI Jakarta (-80 ton ${commodity.toLowerCase()})`,
      cost: 128000000,
      priceStabilization: "-12%",
      narrative:
        "Optimization engine memilih Lampung karena surplus tinggi, jarak logistik pendek, dan potensi penurunan harga paling cepat.",
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
      narrative:
        "Distribusi diarahkan dari Sulawesi Selatan karena kombinasi surplus regional, akses pelabuhan, dan kestabilan pasokan lebih kuat.",
    };
  }

  return {
    from: "Jawa Timur",
    to: region,
    surplus: `Jawa Timur (+110 ton ${commodity.toLowerCase()})`,
    deficit: `${region} (-74 ton ${commodity.toLowerCase()})`,
    cost: 162000000,
    priceStabilization: "-8%",
    narrative:
      "Model memilih Jawa Timur sebagai origin karena cluster distribusinya paling siap dan peluang stabilisasi harga relatif tinggi.",
  };
}

export default function HomePage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FeatureTab>("allocation");
  const [allocationRegion, setAllocationRegion] = useState("DKI Jakarta");
  const [allocationCommodity, setAllocationCommodity] = useState("Beras");
  const [allocationScenario, setAllocationScenario] = useState<(typeof allocationScenarios)[number]>("Harga naik");
  const [substitutionRegion, setSubstitutionRegion] = useState("Papua");
  const [mainCommodity, setMainCommodity] = useState("Beras");
  const [priceIncrease, setPriceIncrease] = useState(30);
  const [policy, setPolicy] = useState("Subsidi transport Rp200/kg");

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
    const provinces = Object.entries(provinceData);
    const stable = provinces.filter(([, item]) => item.score >= 80).length;
    const moderate = provinces.filter(([, item]) => item.score >= 60 && item.score < 80).length;
    const risk = provinces.filter(([, item]) => item.score < 60).length;
    const average = Math.round(
      provinces.reduce((sum, [, item]) => sum + item.score, 0) / provinces.length,
    );
    return { stable, moderate, risk, average };
  }, []);

  const allocationInsight = useMemo(
    () => getAllocationInsight(allocationRegion, allocationCommodity, allocationScenario),
    [allocationCommodity, allocationRegion, allocationScenario],
  );

  const route = useMemo(
    () => ({
      from: allocationInsight.from,
      to: allocationInsight.to,
      label: `${allocationInsight.from} → ${allocationInsight.to}`,
    }),
    [allocationInsight.from, allocationInsight.to],
  );

  const substitutionInsight = useMemo(() => {
    if (normalizeName(substitutionRegion).includes("papua")) {
      return {
        alternatives: ["Sagu", "Ubi jalar", "Jagung"],
        reason:
          "AI memilih komoditas lokal dengan ketersediaan lebih tinggi, nutrisi karbohidrat tetap kompetitif, dan biaya distribusi lebih rendah dibanding beras impor antarwilayah.",
        nutrition: [
          { item: "Beras", calories: 360, protein: 6.8, carbs: 79 },
          { item: "Sagu", calories: 353, protein: 0.2, carbs: 84 },
        ],
      };
    }

    return {
      alternatives: ["Jagung", "Singkong", "Sorgum"],
      reason:
        "AI memprioritaskan substitusi yang punya daya serap sosial lebih tinggi, produksi regional tersedia, dan distribusinya lebih tahan terhadap shock harga.",
      nutrition: [
        { item: "Beras", calories: 360, protein: 6.8, carbs: 79 },
        { item: "Jagung", calories: 355, protein: 9.2, carbs: 74 },
      ],
    };
  }, [substitutionRegion]);

  const warningInsight = useMemo(() => {
    const isNTT = normalizeName(activeProvince || "ntt").includes("ntt");
    return {
      region: isNTT ? "NTT" : activeProvince || "NTT",
      commodity: "Jagung",
      risk: isNTT ? "Tinggi" : "Sedang",
      reasons: isNTT
        ? ["Curah hujan turun 40%", "Harga naik 18%", "Produksi lokal melemah 11%"]
        : ["Harga naik 9%", "Kapasitas distribusi menurun", "Variabilitas supply meningkat"],
      recommendation: isNTT
        ? "Impor antarwilayah dari Sulawesi Selatan dan aktifkan buffer stock daerah."
        : "Perkuat redistribusi antarwilayah dan pantau anomali harga mingguan.",
    };
  }, [activeProvince]);

  const policyInsight = useMemo(() => {
    if (policy.includes("Subsidi")) {
      return {
        nationalPrice: "-8%",
        stability: "+12%",
        logistics: "+4%",
        note: "Subsidi transport paling cepat memperbaiki efisiensi distribusi tanpa menekan suplai produsen secara langsung.",
      };
    }
    if (policy.includes("Larangan")) {
      return {
        nationalPrice: "-5%",
        stability: "+6%",
        logistics: "+9%",
        note: "Larangan ekspor menahan suplai domestik, tetapi ada trade-off pada biaya logistik dan perilaku pasar regional.",
      };
    }
    return {
      nationalPrice: "-6%",
      stability: "+9%",
      logistics: "+3%",
      note: "Harga eceran tertinggi membantu stabilisasi jangka pendek, tetapi perlu dikombinasikan dengan intervensi distribusi agar pasokan tetap aman.",
    };
  }, [policy]);

  const scoreCards = [
    { region: "Papua", score: 42, status: "High Risk" },
    { region: "NTT", score: 55, status: "Moderate" },
    { region: "Jawa Timur", score: 82, status: "Stable" },
  ];

  return (
    <main className="min-h-screen">
      <TopNavbar />

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section className="glass-card overflow-hidden rounded-[38px] border border-[rgba(37,63,176,0.12)] px-6 py-7 shadow-[0_24px_80px_rgba(37,63,176,0.10)] sm:px-8 lg:px-10 lg:py-9">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(37,63,176,0.10)] bg-[#edf2ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                FIND IT theme aligned
              </div>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                From map dashboard into an AI decision cockpit.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Tampilan dirombak supaya map menjadi pusat interaksi, warna lebih ringan, dan seluruh fitur penting NUSALOKA bisa didemokan langsung saat juri mengubah parameter, wilayah, maupun skenario supply shock.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-[28px] border border-[rgba(37,63,176,0.10)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Average score</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.average}</p>
                <p className="mt-2 text-sm text-slate-600">Rata-rata ketahanan pangan nasional.</p>
              </div>
              <div className="rounded-[28px] border border-[rgba(37,63,176,0.10)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Interactive mode</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">5</p>
                <p className="mt-2 text-sm text-slate-600">Simulator utama siap untuk live demo juri.</p>
              </div>
              <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-3xl font-semibold text-emerald-700">{stats.stable}</p>
                <p className="mt-1 text-sm text-emerald-700">Stable provinces</p>
              </div>
              <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-5">
                <p className="text-3xl font-semibold text-rose-700">{stats.risk}</p>
                <p className="mt-1 text-sm text-rose-700">High risk provinces</p>
              </div>
            </div>
          </div>
        </section>

        <section id="map" className="mt-6 space-y-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <IndonesiaMap
            selectedProvince={activeProvince}
            onSelectProvince={(province) => {
              setSelectedProvince(province);
              setSearchTerm("");
            }}
            searchTerm={searchTerm}
            provinceData={provinceData}
            route={route}
          />
          <MapLegend />
          <RegionAnalysisPanel province={activeProvince} provinceData={provinceData} />
        </section>

        <section className="mt-8 rounded-[34px] border border-[rgba(37,63,176,0.12)] bg-white p-4 shadow-[0_20px_60px_rgba(37,63,176,0.08)] sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                Feature Navigation
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                Pilih mode demo yang ingin ditunjukkan ke juri
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {featureTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full border px-4 py-3 text-sm transition ${
                    activeTab === tab.id
                      ? "border-[#3558df] bg-[#edf2ff] font-semibold text-[#1d2f9b]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#3558df] hover:text-[#1d2f9b]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 dashboard-grid">
            {activeTab === "allocation" && (
              <>
                <section id="allocation" className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">Smart Food Allocation Simulator</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Simulasikan distribusi optimal secara langsung</h4>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Wilayah</span>
                      <select value={allocationRegion} onChange={(e) => setAllocationRegion(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        <option>DKI Jakarta</option>
                        <option>Papua</option>
                        <option>NTT</option>
                        <option>Jawa Timur</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Komoditas</span>
                      <select value={allocationCommodity} onChange={(e) => setAllocationCommodity(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        <option>Beras</option>
                        <option>Jagung</option>
                        <option>Gula</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-600 sm:col-span-2">
                      <span>Kondisi skenario</span>
                      <select value={allocationScenario} onChange={(e) => setAllocationScenario(e.target.value as (typeof allocationScenarios)[number])} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        {allocationScenarios.map((scenario) => (
                          <option key={scenario}>{scenario}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-6 rounded-[26px] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                    Model menjalankan forecasting supply, clustering wilayah, dan optimization distribusi untuk menghasilkan jalur distribusi yang paling efisien.
                  </div>
                </section>

                <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-7">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">Simulation Output</p>
                      <h4 className="mt-2 text-2xl font-semibold text-slate-900">{allocationInsight.from} → {allocationInsight.to}</h4>
                    </div>
                    <div className="rounded-full border border-[rgba(37,63,176,0.10)] bg-[#eefbfd] px-4 py-2 text-sm font-semibold text-[#0f6f85]">
                      Optimal route active
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Surplus wilayah</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{allocationInsight.surplus}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Defisit wilayah</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{allocationInsight.deficit}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Biaya logistik</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{formatRupiah(allocationInsight.cost)}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Stabilisasi harga</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{allocationInsight.priceStabilization}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-[26px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-5 text-sm leading-7 text-slate-600">
                    {allocationInsight.narrative}
                  </div>
                </section>
              </>
            )}

            {activeTab === "substitution" && (
              <>
                <section id="substitution" className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">AI Food Substitution Engine</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Alternatif pangan lokal yang lebih adaptif</h4>
                  <div className="mt-6 grid gap-4">
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Komoditas utama</span>
                      <select value={mainCommodity} onChange={(e) => setMainCommodity(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        <option>Beras</option>
                        <option>Jagung</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Wilayah</span>
                      <select value={substitutionRegion} onChange={(e) => setSubstitutionRegion(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        <option>Papua</option>
                        <option>NTT</option>
                        <option>Maluku</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Harga naik</span>
                      <input type="range" min={5} max={50} value={priceIncrease} onChange={(e) => setPriceIncrease(Number(e.target.value))} className="w-full" />
                      <div className="text-xs text-slate-500">{priceIncrease}% kenaikan harga</div>
                    </label>
                  </div>
                </section>

                <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">AI Recommendation</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Substitusi {mainCommodity.toLowerCase()} untuk {substitutionRegion}</h4>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {substitutionInsight.alternatives.map((item, index) => (
                      <div key={item} className="rounded-[24px] border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Alternative {index + 1}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[26px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-5 text-sm leading-7 text-slate-600">
                    {substitutionInsight.reason}
                  </div>
                  <div className="mt-5 overflow-hidden rounded-[26px] border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">Nutritional comparison</div>
                    <div className="grid grid-cols-4 gap-0 text-sm">
                      <div className="bg-slate-50 px-5 py-3 font-semibold text-slate-700">Komoditas</div>
                      <div className="bg-slate-50 px-5 py-3 font-semibold text-slate-700">Kalori</div>
                      <div className="bg-slate-50 px-5 py-3 font-semibold text-slate-700">Protein</div>
                      <div className="bg-slate-50 px-5 py-3 font-semibold text-slate-700">Karbohidrat</div>
                      {substitutionInsight.nutrition.map((row) => (
                        <div key={row.item} className="contents">
                          <div className="border-t border-slate-100 px-5 py-3 text-slate-800">{row.item}</div>
                          <div className="border-t border-slate-100 px-5 py-3 text-slate-600">{row.calories}</div>
                          <div className="border-t border-slate-100 px-5 py-3 text-slate-600">{row.protein} g</div>
                          <div className="border-t border-slate-100 px-5 py-3 text-slate-600">{row.carbs} g</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "warning" && (
              <>
                <section id="warning" className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">Supply Risk Early Warning</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">AI radar untuk ketahanan pangan</h4>
                  <div className="mt-5 rounded-[26px] border border-rose-100 bg-rose-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">Supply Risk Alert</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{warningInsight.region} · {warningInsight.commodity}</p>
                    <p className="mt-2 text-sm text-rose-700">Risiko: {warningInsight.risk}</p>
                  </div>
                </section>
                <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    {warningInsight.reasons.map((reason) => (
                      <div key={reason} className="rounded-[24px] border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Detected signal</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[26px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-5 text-sm leading-7 text-slate-600">
                    <span className="font-semibold text-slate-900">Rekomendasi:</span> {warningInsight.recommendation}
                  </div>
                </section>
              </>
            )}

            {activeTab === "policy" && (
              <>
                <section id="policy" className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">AI Policy Simulator</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Uji dampak kebijakan sebelum diterapkan</h4>
                  <div className="mt-6 space-y-4">
                    <label className="space-y-2 text-sm text-slate-600">
                      <span>Pilihan kebijakan</span>
                      <select value={policy} onChange={(e) => setPolicy(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3558df]">
                        <option>Subsidi transport Rp200/kg</option>
                        <option>Larangan ekspor</option>
                        <option>Harga eceran tertinggi</option>
                      </select>
                    </label>
                    <div className="rounded-[26px] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                      Mode ini membuat NUSALOKA terasa seperti AI policy lab untuk pemerintah karena perubahan parameter langsung memengaruhi prediksi dampak nasional.
                    </div>
                  </div>
                </section>
                <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">Predicted Impact</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Harga nasional</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{policyInsight.nationalPrice}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Stabilitas supply</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{policyInsight.stability}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Biaya logistik</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{policyInsight.logistics}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-[26px] border border-[rgba(37,63,176,0.10)] bg-[#f8fbff] p-5 text-sm leading-7 text-slate-600">
                    {policyInsight.note}
                  </div>
                </section>
              </>
            )}

            {activeTab === "score" && (
              <>
                <section id="score" className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:col-span-12">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">Food Security Score per Region</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Regional score visualization</h4>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {scoreCards.map((card) => (
                      <button
                        key={card.region}
                        type="button"
                        onClick={() => setSelectedProvince(card.region)}
                        className="rounded-[28px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#3558df] hover:shadow-[0_16px_30px_rgba(37,63,176,0.08)]"
                      >
                        <p className="text-sm font-semibold text-slate-900">{card.region}</p>
                        <p className="mt-3 text-4xl font-semibold text-slate-900">{card.score}</p>
                        <p className="mt-2 text-sm text-slate-600">{card.status}</p>
                        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#3558df]">Click to inspect on map</p>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
