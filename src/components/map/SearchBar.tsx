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
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      >
        <path
          d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.44 4.44 1.06-1.06-4.44-4.44A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
          fill="currentColor"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari provinsi..."
        className="w-full rounded-2xl border border-[rgba(29,47,155,0.14)] bg-white py-3 pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#3057d5] focus:ring-4 focus:ring-[rgba(48,87,213,0.10)]"
      />
    </div>
  );
}
