"use client";

import { useTheme } from "@/context/theme-context";
import type { MonthlyTrendItem } from "@/types/public-dashboard";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-44 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat tren...</span>
    </div>
  ),
});

interface OperationalSummaryCardProps {
  totalRequests: number;
  totalProcessedKg: number;
  monthlyTrends: MonthlyTrendItem[];
}

export default function OperationalSummaryCard({
  totalRequests,
  totalProcessedKg,
  monthlyTrends,
}: OperationalSummaryCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const categories = monthlyTrends.map((t) => t.label);

  const gempolinOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: [isDark ? "#10B981" : "#059669"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    stroke: { curve: "smooth", width: 2.5 },
    grid: { borderColor: isDark ? "#1E293B" : "#F1F5F9" },
    xaxis: {
      categories,
      labels: {
        style: { colors: isDark ? "#94A3B8" : "#64748B", fontSize: "10px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${(val / 1000).toFixed(0)}t`,
        style: { colors: isDark ? "#94A3B8" : "#64748B", fontSize: "10px" },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toLocaleString("id-ID")} kg`,
      },
    },
  };

  const gempolinSeries = [
    { name: "Terolah", data: monthlyTrends.map((t) => t.gempolinProcessedKg) },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Rekapitulasi Operasional Layanan
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tren bulanan pengangkutan &amp; pengolahan sampah Gempolin
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Layanan Gempolin
            </span>
            <p className="text-xs text-gray-400">Pengangkutan &amp; Pengolahan</p>
          </div>
          <div className="text-end">
            <span className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {totalProcessedKg.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal">kg</span>
            </span>
            <p className="text-[11px] tabular-nums text-gray-400">
              {totalRequests.toLocaleString("id-ID")} permintaan angkut
            </p>
          </div>
        </div>

        <ReactApexChart
          options={gempolinOptions}
          series={gempolinSeries}
          type="area"
          height={200}
        />
      </div>
    </div>
  );
}
