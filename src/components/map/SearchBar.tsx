type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      >
        <path
          d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.44 4.44 1.06-1.06-4.44-4.44A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
          fill="currentColor"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari provinsi atau fokus wilayah..."
        className="w-full rounded-[24px] border border-[rgba(37,63,176,0.12)] bg-white px-14 py-4 text-sm text-slate-700 shadow-[0_12px_30px_rgba(37,63,176,0.06)] outline-none transition focus:border-[#3558df] focus:ring-4 focus:ring-[rgba(53,88,223,0.10)]"
      />
    </div>
  );
}
