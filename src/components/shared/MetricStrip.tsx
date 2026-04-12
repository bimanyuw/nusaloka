type Props = {
  stats: {
    total: number;
    stable: number;
    moderate: number;
    risk: number;
    average: number;
  };
};

export default function MetricStrip({ stats }: Props) {
  const efficiency = Math.round(((stats.stable + stats.moderate * 0.6) / stats.total) * 100);

  const metrics = [
    {
      label: "Provinsi Dipantau",
      value: stats.total,
      suffix: "",
      color: "text-slate-900",
      note: "",
      noteColor: "text-[#3558df]",
    },
    {
      label: "Wilayah High Risk",
      value: stats.risk,
      suffix: "",
      color: "text-rose-600",
      note: `${Math.round((stats.risk / stats.total) * 100)}% dari total`,
      noteColor: "text-rose-500",
    },
    {
      label: "Rata-rata Supply Score",
      value: stats.average,
      suffix: "/100",
      color: "text-[#1d2f9b]",
      note: stats.average >= 70 ? "↑ Di atas target 70" : "↓ Di bawah target",
      noteColor: stats.average >= 70 ? "text-emerald-600" : "text-rose-500",
    },
    {
      label: "Efisiensi Distribusi",
      value: efficiency,
      suffix: "%",
      color: "text-emerald-700",
      note: "vs baseline FSVA 2025",
      noteColor: "text-emerald-600",
    },
  ];

  return (
    <div className="border-b border-[rgba(37,63,176,0.08)] bg-[#fafbff]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[rgba(37,63,176,0.08)] px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
        {metrics.map((m) => (
          <div key={m.label} className="px-4 py-3 lg:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {m.label}
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-semibold ${m.color}`}>{m.value}</span>
              {m.suffix && (
                <span className="text-sm text-slate-400">{m.suffix}</span>
              )}
            </div>
            <p className={`mt-0.5 text-[10px] font-medium ${m.noteColor}`}>{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
