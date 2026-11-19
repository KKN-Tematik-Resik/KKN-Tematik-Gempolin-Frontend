"use client";

import { useTheme } from "@/context/theme-context";
import type { PublicRtItem } from "@/types/public-dashboard";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat sebaran RT...</span>
    </div>
  ),
});

interface RtWasteBarChartProps {
  rtItems: PublicRtItem[];
  scopeLabel: string;
}

export default function RtWasteBarChart({
  rtItems,
  scopeLabel,
}: RtWasteBarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showAll, setShowAll] = useState(false);

  const sortedRtData = useMemo(() => {
    const valid = rtItems
      .filter((item) => (item.gempolinProcessedKg ?? 0) > 0)
      .sort((a, b) => (b.gempolinProcessedKg ?? 0) - (a.gempolinProcessedKg ?? 0));

    if (showAll || valid.length <= 8) {
      return valid;
    }
    return valid.slice(0, 8);
  }, [rtItems, showAll]);

  const categories = sortedRtData.map((item) => `${item.rt} · ${item.rw}`);
  const seriesData = sortedRtData.map((item) => item.gempolinProcessedKg ?? 0);
  const chartHeight = Math.max(280, sortedRtData.length * 34);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: [isDark ? "#10B981" : "#059669"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: "end",
        barHeight: "55%",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toLocaleString("id-ID")} kg`,
      offsetX: 24,
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: [isDark ? "#CBD5E1" : "#475569"],
      },
    },
    grid: {
      borderColor: isDark ? "#1E293B" : "#F1F5F9",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories,
      labels: {
        formatter: (val: string) => `${Number(val).toLocaleString("id-ID")}`,
        style: {
          colors: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#E2E8F0" : "#334155",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) =>
          `${val.toLocaleString("id-ID")} kg terolah`,
      },
    },
  };

  const series = [{ name: "Sampah Terolah", data: seriesData }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Sebaran Pengolahan Sampah per RT
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Peringkat tonase sampah terolah pada {scopeLabel}
          </p>
        </div>

        {rtItems.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            {showAll ? "Tampilkan Top 8 Saja" : `Lihat Semua (${rtItems.length} RT)`}
          </button>
        )}
      </div>

      <div className="mt-4">
        {seriesData.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-xs text-gray-400">
            Belum ada data pengolahan sampah pada wilayah ini.
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={chartHeight}
          />
        )}
      </div>
    </div>
  );
}
