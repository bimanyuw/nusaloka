"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { ProvinceInfo } from "@/types/province";

const geoUrl = "/maps/indonesia-provinces.geojson";

type Props = {
  selectedProvince: string | null;
  onSelectProvince: (province: string) => void;
  searchTerm: string;
  provinceData: Record<string, ProvinceInfo>;
};

type TooltipState = {
  province: string;
  score: number;
  status: ProvinceInfo["status"];
  x: number;
  y: number;
} | null;

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

  if (isSelected) return "#3057d5";
  if (isHovered) return "#2fb8c9";
  if (normalizedSearch && !normalizedProvince.includes(normalizedSearch)) {
    return "#dbe6ff";
  }

  const matchedKey = resolveProvinceKey(provinceName, provinceData);
  const score = provinceData[matchedKey]?.score ?? 70;

  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export default function IndonesiaMap({
  selectedProvince,
  onSelectProvince,
  searchTerm,
  provinceData,
}: Props) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const highlightedLabel = useMemo(() => {
    if (!selectedProvince) return "Klik provinsi untuk detail";
    return `${selectedProvince} dipilih`;
  }, [selectedProvince]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[rgba(29,47,155,0.14)] bg-white p-4 shadow-[0_20px_60px_rgba(29,47,155,0.08)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3057d5]">
            Interactive Map
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Supply readiness by province
          </h2>
        </div>
        <div className="rounded-full bg-[rgba(48,87,213,0.08)] px-3 py-1 text-xs font-medium text-[#1d2f9b]">
          {highlightedLabel}
        </div>
      </div>

      <div className="rounded-[24px] bg-[linear-gradient(180deg,#f8fbff,#eff4ff)] p-2 sm:p-4">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [118, -2],
            scale: 1000,
          }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const provinceName = getGeoProvinceName(geo);
                const provinceKey = resolveProvinceKey(provinceName, provinceData);
                const provinceInfo = provinceData[provinceKey];
                const fill = getProvinceFill(
                  provinceName,
                  selectedProvince,
                  hoveredProvince,
                  searchTerm,
                  provinceData,
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onSelectProvince(provinceName)}
                    onMouseEnter={(event) => {
                      setHoveredProvince(provinceName);
                      setTooltip({
                        province: provinceName,
                        score: provinceInfo?.score ?? 70,
                        status: provinceInfo?.status ?? "Waspada",
                        x: event.clientX,
                        y: event.clientY,
                      });
                    }}
                    onMouseMove={(event) => {
                      setTooltip((current) =>
                        current
                          ? {
                              ...current,
                              x: event.clientX,
                              y: event.clientY,
                            }
                          : current,
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredProvince(null);
                      setTooltip(null);
                    }}
                    style={{
                      default: {
                        fill,
                        stroke: "#ffffff",
                        strokeWidth: 0.9,
                        outline: "none",
                        filter:
                          hoveredProvince === provinceName
                            ? "drop-shadow(0 10px 18px rgba(48,87,213,0.25))"
                            : "none",
                        transform:
                          hoveredProvince === provinceName ? "translateY(-3px)" : "none",
                        transformOrigin: "center",
                        transition: "all 180ms ease",
                      },
                      hover: {
                        fill: "#2fb8c9",
                        stroke: "#1d2f9b",
                        strokeWidth: 1.2,
                        outline: "none",
                        cursor: "pointer",
                        filter: "drop-shadow(0 12px 20px rgba(48,87,213,0.28))",
                        transform: "translateY(-3px)",
                        transformOrigin: "center",
                        transition: "all 180ms ease",
                      },
                      pressed: {
                        fill: "#3057d5",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 min-w-[180px] rounded-2xl border border-[rgba(29,47,155,0.14)] bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur"
          style={{ left: tooltip.x + 16, top: tooltip.y - 16 }}
        >
          <p className="text-sm font-semibold text-slate-900">{tooltip.province}</p>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
            <span className="rounded-full bg-[rgba(48,87,213,0.08)] px-2 py-1 font-medium text-[#1d2f9b]">
              {tooltip.status}
            </span>
            <span className="font-semibold text-slate-700">Score {tooltip.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
