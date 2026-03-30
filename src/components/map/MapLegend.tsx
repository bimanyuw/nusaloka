export default function MapLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
      <span className="font-medium text-white">Supply Readiness</span>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        <span>High</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span>Medium</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span>Low</span>
      </div>
    </div>
  );
}