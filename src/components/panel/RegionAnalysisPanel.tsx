import { fallbackProvinceData } from "@/src/data/provinceData";
import type { ProvinceInfo } from "@/types/province";

type Props = {
  province: string | null;
  provinceData: Record<string, ProvinceInfo>;
};

function normalizeName(value: string) {
  return value.toLowerCase().replace(/_/g, " ").trim();
}

function resolveProvinceInfo(
  province: string,
  provinceData: Record<string, ProvinceInfo>,
): ProvinceInfo {
  const exact = provinceData[province];
  if (exact) return exact;

  const matchedKey = Object.keys(provinceData).find(
    (key) => normalizeName(key) === normalizeName(province),
  );

  return matchedKey ? provinceData[matchedKey] : fallbackProvinceData;
}

function getScoreRingColor(score: number) {
  if (score >= 80) return "border-emerald-500 text-emerald-600";
  if (score >= 60) return "border-amber-500 text-amber-600";
  return "border-rose-500 text-rose-600";
}

function getStatusBadge(status: ProvinceInfo["status"]) {
  if (status === "Surplus") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (status === "Waspada") {
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }
  return "bg-rose-50 text-rose-700 border border-rose-200";
}

export default function RegionAnalysisPanel({ province, provinceData }: Props) {
  if (!province) {
    return (
      <section className="rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(29,47,155,0.08)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3057d5]">
              Region Analysis
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Pilih provinsi pada peta
            </h2>
          </div>
          <div className="rounded-full bg-[rgba(221,242,74,0.22)] px-3 py-1 text-xs font-medium text-slate-700">
            Hover enabled
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-[rgba(29,47,155,0.18)] bg-[linear-gradient(180deg,rgba(48,87,213,0.04),rgba(47,184,201,0.04))] p-6 text-slate-600">
          Klik wilayah pada peta atau gunakan search untuk melihat skor kesiapan, rekomendasi distribusi, dan substitusi bahan pangan.
        </div>
      </section>
    );
  }

  const data = resolveProvinceInfo(province, provinceData);
  const ringColor = getScoreRingColor(data.score);
  const badgeClass = getStatusBadge(data.status);

  return (
    <section className="rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-6 shadow-[0_20px_60px_rgba(29,47,155,0.08)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3057d5]">
            Region Analysis
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{province}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {data.status}
        </span>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 bg-white text-2xl font-bold ${ringColor}`}
          >
            {data.score}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Supply Readiness Score</p>
            <p className="mt-1 text-sm text-slate-600">
              Skor ringkas untuk membantu prioritas intervensi dan distribusi pangan.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Recommended Distribution</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{data.recommendation}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Food Substitution</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{data.substitution}</p>
        </div>
      </div>
    </section>
  );
}
