const items = [
  { id: "map", label: "Interactive Map" },
  { id: "allocation", label: "Allocation Simulator" },
  { id: "substitution", label: "Substitution Engine" },
  { id: "warning", label: "Risk Warning" },
  { id: "policy", label: "Policy Simulator" },
  { id: "score", label: "Food Security Score" },
];

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(37,63,176,0.10)] bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3558df]">
            NUSALOKA
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
            Adaptive Food Intelligence Dashboard
          </h1>
        </div>

        <nav className="hidden flex-wrap items-center justify-end gap-2 xl:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-[rgba(37,63,176,0.10)] bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-[#3558df] hover:text-[#1d2f9b]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
