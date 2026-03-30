"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { ProvinceInfo } from "@/types/province";

const geoUrl = "/maps/indonesia-provinces.geojson";

type Props = {
  selectedProvince: string | null;
  onSelectProvince: (province: string) => void;
  searchTerm: string;
  provinceData: Record<string, ProvinceInfo>;
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

function getProvinceFill(
  provinceName: string,
  selectedProvince: string | null,
  searchTerm: string,
  provinceData: Record<string, ProvinceInfo>
) {
  const normalizedProvince = normalizeName(provinceName);
  const normalizedSearch = normalizeName(searchTerm);
  const isSelected =
    selectedProvince && normalizeName(selectedProvince) === normalizedProvince;

  if (isSelected) return "#14b8a6";

  if (normalizedSearch && !normalizedProvince.includes(normalizedSearch)) {
    return "#1e293b";
  }

  const matchedKey =
    Object.keys(provinceData).find(
      (key) => normalizeName(key) === normalizedProvince
    ) ?? provinceName;

  const score = provinceData[matchedKey]?.score ?? 70;

  if (score >= 80) return "#10b981";
  if (score >= 60) return "#fbbf24";
  return "#ef4444";
}

export default function IndonesiaMap({
  selectedProvince,
  onSelectProvince,
  searchTerm,
  provinceData,
}: Props) {
  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [118, -2],
          }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const provinceName = getGeoProvinceName(geo);

                const fill = getProvinceFill(
                  provinceName,
                  selectedProvince,
                  searchTerm,
                  provinceData
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onSelectProvince(provinceName)}
                    style={{
                      default: {
                        fill,
                        stroke: "#020617",
                        strokeWidth: 0.8,
                        outline: "none",
                      },
                      hover: {
                        fill: "#2dd4bf",
                        stroke: "#e2e8f0",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#14b8a6",
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
    </div>
  );
}