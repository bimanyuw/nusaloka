import { fallbackProvinceData } from "@/src/data/provinceData";
import type { ProvinceInfo } from "@/types/province";

type Props = {
  province: string | null;
  provinceData: Record<string, ProvinceInfo>;
};

function getScoreRingColor(score: number) {
  if (score >= 80) return "text-emerald-400 border-emerald-500";
  if (score >= 60) return "text-amber-300 border-amber-400";
  return "text-red-400 border-red-500";
}

function getStatusBadge(status: ProvinceInfo["status"]) {
  if (status === "Surplus") {
    return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  }
  if (status === "Waspada") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
  }
  return "bg-red-500/15 text-red-400 border border-red-500/30";
}

export default function RegionAnalysisPanel({
  province,
  provinceData,
}: Props) {
  if (!province) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-400">
        <p className="text-sm uppercase tracking-wide text-emerald-400">
          Region Analysis
        </p>
        <div className="mt-10 flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 text-center">
          <div>
            <p className="text-lg text-slate-300">Select a province on the map</p>
            <p className="mt-2 text-sm text-slate-500">
              Klik wilayah pada peta atau gunakan search untuk melihat analisis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data = provinceData[province] ?? fallbackProvinceData;
  const ringColor = getScoreRingColor(data.score);
  const badgeClass = getStatusBadge(data.status);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-emerald-400">
            Region Analysis
          </p>
          <h2 className="mt-2 text-3xl font-bold">{province}</h2>
        </div>

        <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>
          {data.status}
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className={`flex h-40 w-40 items-center justify-center rounded-full border-[10px] ${ringColor}`}
        >
          <div className="text-center">
            <p className="text-5xl font-bold">{data.score}</p>
            <p className="mt-1 text-sm text-slate-400">Score</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Recommended Distribution</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {data.recommendation}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Food Substitution</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {data.substitution}
          </p>
        </div>
      </div>
    </div>
  );
}