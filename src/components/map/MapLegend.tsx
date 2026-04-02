const items = [
  { label: "Stable", color: "#bde9ca" },
  { label: "Moderate", color: "#f7e7a7" },
  { label: "High Risk", color: "#f6b0ab" },
  { label: "Selected", color: "#7ecff3" },
];

export default function MapLegend() {
  return (
    <div className="glass-card rounded-[28px] border border-[rgba(37,63,176,0.12)] p-5 shadow-[0_18px_50px_rgba(37,63,176,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Map Legend</p>
          <p className="mt-1 text-xs text-slate-500">
            Warna peta dibuat lebih pastel agar lebih ringan secara visual namun tetap informatif.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-white"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
