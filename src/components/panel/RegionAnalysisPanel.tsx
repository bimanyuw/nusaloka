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

function getRiskLabel(score: number) {
  if (score >= 80) return "Stable";
  if (score >= 60) return "Moderate";
  return "High Risk";
}

export default function RegionAnalysisPanel({ province, provinceData }: Props) {
  if (!province) {
    return (
      <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">
          Region Insight
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">
          Klik provinsi untuk pin detail wilayah
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Hover akan memunculkan info card mengikuti cursor. Saat provinsi diklik, card akan tetap tampil sebagai detail utama.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Stable</p>
            <p className="mt-2 text-sm text-emerald-800">Wilayah dengan supply readiness tinggi dan distribusi relatif aman.</p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Moderate</p>
            <p className="mt-2 text-sm text-amber-800">Wilayah perlu pemantauan harga, musim, atau gangguan logistik.</p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">High Risk</p>
            <p className="mt-2 text-sm text-rose-800">Wilayah prioritas untuk intervensi, substitusi, atau redistribusi pasokan.</p>
          </div>
        </div>
      </section>
    );
  }

  const data = resolveProvinceInfo(province, provinceData);
  const risk = getRiskLabel(data.score);

  return (
    <section className="glass-card rounded-[30px] border border-[rgba(37,63,176,0.12)] p-6 shadow-[0_20px_60px_rgba(37,63,176,0.08)] lg:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3558df]">
            Pinned Province
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{province}</h3>
          <p className="mt-2 text-sm text-slate-500">Food security and supply readiness snapshot.</p>
        </div>
        <div className="rounded-full border border-[rgba(37,63,176,0.10)] bg-[#edf2ff] px-4 py-2 text-sm font-semibold text-[#1d2f9b]">
          {risk}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#7ecff3] bg-[#eef7ff] text-2xl font-bold text-[#1d2f9b]">
              {data.score}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Food Security Score</p>
              <p className="mt-1 text-sm text-slate-600">Kategori: {risk}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Status:</span> {data.status}
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Primary action:</span> prioritas distribusi dan stabilisasi harga.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Recommended Distribution</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{data.recommendation}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Food Substitution Insight</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{data.substitution}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
