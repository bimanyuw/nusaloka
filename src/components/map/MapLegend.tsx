const items = [
  { label: "High readiness", color: "#22c55e" },
  { label: "Medium readiness", color: "#f59e0b" },
  { label: "Low readiness", color: "#ef4444" },
];

export default function MapLegend() {
  return (
    <div className="rounded-3xl border border-[rgba(29,47,155,0.14)] bg-white p-4 shadow-[0_18px_50px_rgba(29,47,155,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Supply Readiness</p>
          <p className="text-xs text-slate-500">Warna peta mengikuti skor kesiapan pasokan.</p>
        </div>
        <div className="rounded-full bg-[rgba(48,87,213,0.08)] px-3 py-1 text-[11px] font-medium text-[#1d2f9b]">
          Live Map View
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
