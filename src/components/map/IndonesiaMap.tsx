"use client";

import { useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { ProvinceInfo } from "@/types/province";

const geoUrl = "/maps/indonesia-provinces.geojson";

type Props = {
  selectedProvince: string | null;
  onSelectProvince: (province: string) => void;
  searchTerm: string;
  provinceData: Record<string, ProvinceInfo>;
  route?: {
    from: string;
    to: string;
    label: string;
  } | null;
};

type TooltipState = {
  province: string;
  score: number;
  status: ProvinceInfo["status"];
  x: number;
  y: number;
} | null;

const provinceAnchors: Record<string, { x: number; y: number }> = {
  lampung: { x: 20, y: 66 },
  "dki jakarta": { x: 26, y: 64 },
  jakarta: { x: 26, y: 64 },
  papua: { x: 91, y: 58 },
  ntt: { x: 66, y: 75 },
  "jawa timur": { x: 38, y: 66 },
  "sulawesi selatan": { x: 58, y: 56 },
  "sumatera utara": { x: 11, y: 43 },
  aceh: { x: 5, y: 36 },
};

function normalizeName(value: string) {
  return value.toLowerCase().replace(/_/g, " ").trim();
}

function getGeoProvinceName(geo: any) {
  return (
    geo?.properties?.name ||
    geo?.properties?.NAME_1 ||
    geo?.properties?.PROVINSI ||
    geo?.properties?.Propinsi ||
    geo?.properties?.province ||
    "Unknown"
  );
}

function resolveProvinceKey(
  provinceName: string,
  provinceData: Record<string, ProvinceInfo>,
) {
  return (
    Object.keys(provinceData).find(
      (key) => normalizeName(key) === normalizeName(provinceName),
    ) ?? provinceName
  );
}

function getProvinceFill(
  provinceName: string,
  selectedProvince: string | null,
  hoveredProvince: string | null,
  searchTerm: string,
  provinceData: Record<string, ProvinceInfo>,
) {
  const normalizedProvince = normalizeName(provinceName);
  const normalizedSearch = normalizeName(searchTerm);
  const isSelected =
    selectedProvince && normalizeName(selectedProvince) === normalizedProvince;
  const isHovered =
    hoveredProvince && normalizeName(hoveredProvince) === normalizedProvince;

  if (isSelected) return "#7ecff3";
  if (isHovered) return "#9fdef8";
  if (normalizedSearch && !normalizedProvince.includes(normalizedSearch)) {
    return "#edf2fb";
  }

  const matchedKey = resolveProvinceKey(provinceName, provinceData);
  const score = provinceData[matchedKey]?.score ?? 70;

  if (score >= 80) return "#bde9ca";
  if (score >= 60) return "#f7e7a7";
  return "#f6b0ab";
}

export default function IndonesiaMap({
  selectedProvince,
  onSelectProvince,
  searchTerm,
  provinceData,
  route,
}: Props) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pinnedProvinceData = useMemo(() => {
    if (!selectedProvince) return null;
    const matchedKey = resolveProvinceKey(selectedProvince, provinceData);
    return provinceData[matchedKey] ?? null;
  }, [provinceData, selectedProvince]);

  const routePoints = useMemo(() => {
    if (!route) return null;
    const from = provinceAnchors[normalizeName(route.from)];
    const to = provinceAnchors[normalizeName(route.to)];
    if (!from || !to) return null;

    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - 10;
    return { from, to, midX, midY };
  }, [route]);

  return (
    <section className="glass-card rounded-[34px] border border-[rgba(37,63,176,0.12)] p-4 shadow-[0_24px_80px_rgba(37,63,176,0.08)] sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3558df]">
            Interactive National Map
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Indonesia-wide supply readiness view
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Hover provinsi untuk melihat info card yang mengikuti cursor. Klik wilayah untuk pin detail secara permanen dan jadikan area itu fokus analisis.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(37,63,176,0.10)] bg-[#edf2ff] px-4 py-2 text-xs font-semibold text-[#1d2f9b]">
            Full-width map canvas
          </span>
          {route ? (
            <span className="rounded-full border border-[rgba(73,191,209,0.20)] bg-[#effbfd] px-4 py-2 text-xs font-semibold text-[#0f6f85]">
              Route overlay active
            </span>
          ) : null}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-[540px] overflow-hidden rounded-[30px] border border-[rgba(37,63,176,0.10)] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f6ff_100%)] p-2 sm:min-h-[620px] lg:min-h-[700px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,179,122,0.18),transparent_22%),radial-gradient(circle_at_top_right,rgba(73,191,209,0.16),transparent_22%)]" />

        {routePoints ? (
          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3558df" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#49bfd1" stopOpacity="0.88" />
              </linearGradient>
            </defs>
            <path
              d={`M ${routePoints.from.x} ${routePoints.from.y} Q ${routePoints.midX} ${routePoints.midY} ${routePoints.to.x} ${routePoints.to.y}`}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="0.45"
              strokeDasharray="1.6 0.8"
            />
            <circle cx={routePoints.from.x} cy={routePoints.from.y} r="0.9" fill="#3558df" />
            <circle cx={routePoints.to.x} cy={routePoints.to.y} r="0.9" fill="#49bfd1" />
          </svg>
        ) : null}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1180,
            center: [118, -3],
          }}
          className="relative z-20 h-full w-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = getGeoProvinceName(geo);
                const matchedKey = resolveProvinceKey(provinceName, provinceData);
                const province = provinceData[matchedKey];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(event) => {
                      setHoveredProvince(provinceName);
                      if (!containerRef.current) return;
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip({
                        province: provinceName,
                        score: province?.score ?? 70,
                        status: province?.status ?? "Waspada",
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top,
                      });
                    }}
                    onMouseMove={(event) => {
                      if (!containerRef.current) return;
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: event.clientX - rect.left,
                              y: event.clientY - rect.top,
                            }
                          : prev,
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredProvince(null);
                      setTooltip(null);
                    }}
                    onClick={() => onSelectProvince(provinceName)}
                    style={{
                      default: {
                        fill: getProvinceFill(
                          provinceName,
                          selectedProvince,
                          hoveredProvince,
                          searchTerm,
                          provinceData,
                        ),
                        stroke: "#ffffff",
                        strokeWidth: 0.85,
                        outline: "none",
                        filter:
                          selectedProvince &&
                          normalizeName(selectedProvince) === normalizeName(provinceName)
                            ? "drop-shadow(0 14px 24px rgba(53,88,223,0.22))"
                            : "none",
                        transform:
                          hoveredProvince &&
                          normalizeName(hoveredProvince) === normalizeName(provinceName)
                            ? "translateY(-4px)"
                            : "none",
                        transformOrigin: "center",
                        transition: "all 180ms ease",
                      },
                      hover: {
                        fill: "#9fdef8",
                        stroke: "#3558df",
                        strokeWidth: 1.2,
                        outline: "none",
                        cursor: "pointer",
                        filter: "drop-shadow(0 12px 24px rgba(53,88,223,0.18))",
                        transform: "translateY(-4px)",
                        transformOrigin: "center",
                        transition: "all 180ms ease",
                      },
                      pressed: {
                        fill: "#7ecff3",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip ? (
          <div
            className="pointer-events-none absolute z-30 min-w-[210px] max-w-[260px] rounded-[24px] border border-[rgba(37,63,176,0.12)] bg-white/96 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur"
            style={{
              left: Math.min(tooltip.x + 20, 980),
              top: Math.max(tooltip.y - 20, 20),
            }}
          >
            <p className="text-sm font-semibold text-slate-900">{tooltip.province}</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className="rounded-full bg-[#eef3ff] px-3 py-1.5 font-semibold text-[#1d2f9b]">
                {tooltip.status}
              </span>
              <span className="font-semibold text-slate-700">Score {tooltip.score}</span>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Hover card akan mengikuti cursor. Klik provinsi untuk pin detail ke panel permanen.
            </p>
          </div>
        ) : null}

        {selectedProvince && pinnedProvinceData ? (
          <div className="absolute right-4 top-4 z-30 w-[280px] rounded-[26px] border border-[rgba(37,63,176,0.12)] bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur sm:right-6 sm:top-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3558df]">
                  Pinned Detail
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{selectedProvince}</h3>
              </div>
              <span className="rounded-full bg-[#edf8f1] px-3 py-1 text-xs font-semibold text-emerald-700">
                {pinnedProvinceData.score}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {pinnedProvinceData.recommendation}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
