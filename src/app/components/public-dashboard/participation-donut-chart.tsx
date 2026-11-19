"use client";

import { useTheme } from "@/context/theme-context";
import type { ObjectFilterType, PublicParticipationIndicators } from "@/types/public-dashboard";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-36 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat visual donat...</span>
    </div>
  ),
});

interface ParticipationDonutChartProps {
  indicators: PublicParticipationIndicators;
}

export default function ParticipationDonutChart({
  indicators,
}: ParticipationDonutChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [objectFilter, setObjectFilter] = useState<ObjectFilterType>("rumah");

  const activeData = (() => {
    switch (objectFilter) {
      case "kk":
        return {
          title: "Kepala Keluarga (KK)",
          unit: "KK",
          memilahNum: indicators.kkMemilah.numerator,
          memilahDen: indicators.kkMemilah.denominator,
          memilahPct: indicators.kkMemilah.percentage,
          mengolahNum: indicators.kkMengolah.numerator,
          mengolahDen: indicators.kkMengolah.denominator,
          mengolahPct: indicators.kkMengolah.percentage,
        };
      case "warga":
        return {
          title: "Warga (Jiwa)",
          unit: "Jiwa",
          memilahNum: indicators.wargaMemilah.numerator,
          memilahDen: indicators.wargaMemilah.denominator,
          memilahPct: indicators.wargaMemilah.percentage,
          mengolahNum: indicators.wargaMengolah.numerator,
          mengolahDen: indicators.wargaMengolah.denominator,
          mengolahPct: indicators.wargaMengolah.percentage,
        };
      case "rumah":
      default:
        return {
          title: "Rumah (Hunian)",
          unit: "Rumah",
          memilahNum: indicators.rumahMemilah.numerator,
          memilahDen: indicators.rumahMemilah.denominator,
          memilahPct: indicators.rumahMemilah.percentage,
          mengolahNum: indicators.rumahMengolah.numerator,
          mengolahDen: indicators.rumahMengolah.denominator,
          mengolahPct: indicators.rumahMengolah.percentage,
        };
    }
  })();

  const createChartConfig = (
    numerator: number,
    denominator: number,
    percentage: number | null,
    baseColor: string,
  ) => {
    const unfulfilled = Math.max(0, denominator - numerator);
    const series = denominator > 0 ? [numerator, unfulfilled] : [0, 1];

    const options: ApexOptions = {
      chart: {
        type: "donut",
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      colors: [baseColor, isDark ? "#334155" : "#E2E8F0"],
      labels: ["Aktif", "Belum"],
      stroke: {
        show: true,
        colors: [isDark ? "#111827" : "#FFFFFF"],
        width: 3,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val: number) => `${val.toLocaleString("id-ID")} ${activeData.unit}`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "76%",
            labels: {
              show: true,
              name: { show: false },
              value: {
                show: true,
                fontSize: "18px",
                fontWeight: "700",
                color: isDark ? "#F8FAFC" : "#0F172A",
                offsetY: 6,
                formatter: () =>
                  percentage !== null ? `${percentage.toFixed(1)}%` : "N/A",
              },
            },
          },
        },
      },
    };

    return { series, options };
  };

  const memilahConfig = createChartConfig(
    activeData.memilahNum,
    activeData.memilahDen,
    activeData.memilahPct,
    "#059669",
  );

  const mengolahConfig = createChartConfig(
    activeData.mengolahNum,
    activeData.mengolahDen,
    activeData.mengolahPct,
    "#0284C7",
  );

  // Data 6 Indikator Inti Ringkas
  const summaryRows = [
    {
      label: "Rumah",
      memilahPct: indicators.rumahMemilah.percentage,
      mengolahPct: indicators.rumahMengolah.percentage,
      memilahCount: indicators.rumahMemilah.numerator,
      mengolahCount: indicators.rumahMengolah.numerator,
      total: indicators.rumahMemilah.denominator,
      unit: "Rumah",
    },
    {
      label: "Kepala Keluarga",
      memilahPct: indicators.kkMemilah.percentage,
      mengolahPct: indicators.kkMengolah.percentage,
      memilahCount: indicators.kkMemilah.numerator,
      mengolahCount: indicators.kkMengolah.numerator,
      total: indicators.kkMemilah.denominator,
      unit: "KK",
    },
    {
      label: "Warga",
      memilahPct: indicators.wargaMemilah.percentage,
      mengolahPct: indicators.wargaMengolah.percentage,
      memilahCount: indicators.wargaMemilah.numerator,
      mengolahCount: indicators.wargaMengolah.numerator,
      total: indicators.wargaMemilah.denominator,
      unit: "Jiwa",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Header & Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Tingkat Partisipasi Pilah &amp; Olah
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Proporsi pemilahan dan pengolahan sampah mandiri berdasarkan entitas
          </p>
        </div>

        {/* Toggle Objek */}
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
          {(["rumah", "kk", "warga"] as const).map((key) => {
            const labels: Record<ObjectFilterType, string> = {
              rumah: "Rumah",
              kk: "KK",
              warga: "Warga",
            };
            return (
              <button
                key={key}
                type="button"
                onClick={() => setObjectFilter(key)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  objectFilter === key
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {labels[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: 2 Donut Visuals */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Aktivitas Memilah */}
        <div className="flex items-center gap-4 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40">
          <div className="size-24 shrink-0">
            <ReactApexChart
              options={memilahConfig.options}
              series={memilahConfig.series}
              type="donut"
              height={96}
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Aktivitas Memilah
            </span>
            {activeData.memilahPct !== null ? (
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {activeData.memilahPct.toFixed(1)}%
              </p>
            ) : (
              <p className="text-xs text-gray-400">Data belum tersedia</p>
            )}
            <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {activeData.memilahNum.toLocaleString("id-ID")} dari {activeData.memilahDen.toLocaleString("id-ID")} {activeData.unit}
            </p>
          </div>
        </div>

        {/* Aktivitas Mengolah */}
        <div className="flex items-center gap-4 rounded-xl bg-gray-50/70 p-4 dark:bg-gray-800/40">
          <div className="size-24 shrink-0">
            <ReactApexChart
              options={mengolahConfig.options}
              series={mengolahConfig.series}
              type="donut"
              height={96}
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">
              Aktivitas Mengolah
            </span>
            {activeData.mengolahPct !== null ? (
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {activeData.mengolahPct.toFixed(1)}%
              </p>
            ) : (
              <p className="text-xs text-gray-400">Data belum tersedia</p>
            )}
            <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {activeData.mengolahNum.toLocaleString("id-ID")} dari {activeData.mengolahDen.toLocaleString("id-ID")} {activeData.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Rincian 6 Indikator Inti Terpadu (Replacing 6 bulky cards) */}
      <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summaryRows.map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-gray-100 p-3 dark:border-gray-800/80 dark:bg-gray-800/20"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {row.label}
                </span>
                <span className="tabular-nums text-gray-400">
                  {row.total.toLocaleString("id-ID")} {row.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Memilah:</span>
                {row.memilahPct !== null ? (
                  <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {row.memilahPct.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">N/A</span>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Mengolah:</span>
                {row.mengolahPct !== null ? (
                  <span className="font-semibold tabular-nums text-sky-600 dark:text-sky-400">
                    {row.mengolahPct.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">N/A</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
