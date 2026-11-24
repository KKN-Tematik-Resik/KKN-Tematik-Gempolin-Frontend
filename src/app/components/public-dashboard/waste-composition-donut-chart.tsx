"use client";

import { useTheme } from "@/context/theme-context";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat visual donat komposisi...</span>
    </div>
  ),
});

interface WasteCompositionDonutChartProps {
  organikKg: number;
  anorganikKg: number;
  totalProcessedKg: number;
  scopeLabel: string;
}

export default function WasteCompositionDonutChart({
  organikKg,
  anorganikKg,
  totalProcessedKg,
  scopeLabel,
}: WasteCompositionDonutChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const organikPct = useMemo(() => {
    if (totalProcessedKg <= 0) return 0;
    return (organikKg / totalProcessedKg) * 100;
  }, [organikKg, totalProcessedKg]);

  const anorganikPct = useMemo(() => {
    if (totalProcessedKg <= 0) return 0;
    return (anorganikKg / totalProcessedKg) * 100;
  }, [anorganikKg, totalProcessedKg]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: [
      isDark ? "#10B981" : "#059669", // Organik: Pine Green
      isDark ? "#38BDF8" : "#0284C7", // Anorganik: Sky Blue
    ],
    labels: ["Sampah Organik", "Sampah Anorganik"],
    stroke: {
      show: true,
      colors: [isDark ? "#111827" : "#FFFFFF"],
      width: 2.5,
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      custom: function ({ seriesIndex }: { seriesIndex: number }) {
        const isOrganik = seriesIndex === 0;
        const color = isOrganik
          ? isDark ? "#10B981" : "#059669"
          : isDark ? "#38BDF8" : "#0284C7";
        const label = isOrganik ? "Sampah Organik" : "Sampah Anorganik";
        const val = isOrganik ? organikKg : anorganikKg;
        const pct = isOrganik ? organikPct.toFixed(1) : anorganikPct.toFixed(1);

        const titleColor = isDark ? "#cbd5e1" : "#334155";
        const labelColor = isDark ? "#94a3b8" : "#475569";
        const valColor = isDark ? "#f8fafc" : "#0f172a";

        return `
          <div style="padding: 8px 12px 10px 12px; font-family: Outfit, sans-serif;">
            <div style="font-size: 11px; font-weight: 600; color: ${titleColor}; line-height: 1.3;">
              Komposisi Sampah
            </div>
            <div style="margin-top: 5px; display: flex; align-items: center; gap: 7px; font-size: 12px; line-height: 1.3; white-space: nowrap;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; flex-shrink: 0; display: inline-block;"></span>
              <span style="color: ${labelColor};">${label}:</span>
              <span style="font-weight: 600; color: ${valColor};">${val.toLocaleString("id-ID")} kg (${pct}%)</span>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "11px",
              fontWeight: 500,
              color: isDark ? "#94A3B8" : "#64748B",
              offsetY: -3,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "Outfit, sans-serif",
              color: isDark ? "#F8FAFC" : "#0F172A",
              offsetY: 5,
              formatter: (val: string) =>
                `${Number(val).toLocaleString("id-ID")} kg`,
            },
            total: {
              show: true,
              label: "Total Terolah",
              fontSize: "11px",
              fontWeight: 600,
              color: isDark ? "#94A3B8" : "#64748B",
              formatter: () =>
                `${totalProcessedKg.toLocaleString("id-ID")} kg`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  const chartSeries =
    totalProcessedKg > 0 ? [organikKg, anorganikKg] : [0, 0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Komposisi Pengolahan Sampah Berdasarkan Jenis
        </h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Sebaran volume pengolahan sampah organik dan anorganik pada {scopeLabel}
        </p>
      </div>

      {/* Konten Utama: Donut Chart Visual & Legend Terpusat Seimbang */}
      <div className="mt-5 flex flex-col items-center justify-center">
        {totalProcessedKg === 0 ? (
          <div className="flex h-56 w-full items-center justify-center text-xs text-gray-400">
            Belum ada data pengolahan sampah pada wilayah ini.
          </div>
        ) : (
          <div className="relative w-full max-w-[280px]">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={250}
            />
          </div>
        )}

        {/* Legend Indikator Cepat */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">Organik</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
              {organikPct.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-600 dark:bg-sky-500" />
            <span className="text-gray-600 dark:text-gray-400">Anorganik</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-white">
              {anorganikPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
