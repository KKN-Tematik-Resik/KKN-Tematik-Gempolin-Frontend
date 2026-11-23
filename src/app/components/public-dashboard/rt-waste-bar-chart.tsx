"use client";

import { useTheme } from "@/context/theme-context";
import type { PublicRtItem } from "@/types/public-dashboard";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat sebaran pengolahan...</span>
    </div>
  ),
});

type ViewMode = "rw" | "rt";
type SortOption = "highest" | "lowest" | "name";

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

  // Identifikasi daftar RW unik dalam rtItems
  const uniqueRws = useMemo(() => {
    const set = new Set(rtItems.map((item) => item.rw));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rtItems]);

  const isSingleRw = uniqueRws.length <= 1;

  // State tampilan: mode RW vs RT, pemilihan filter RW lokal, dan pengurutan
  const [viewMode, setViewMode] = useState<ViewMode>("rw");
  const [selectedRwFilter, setSelectedRwFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("highest");

  // Jika cakupan adalah single RW, otomatis gunakan mode RT
  const effectiveMode: ViewMode = isSingleRw ? "rt" : viewMode;

  // 1. Agregasi data per RW (untuk mode RW)
  const rwAggregates = useMemo(() => {
    const map = new Map<string, { label: string; totalKg: number; countRt: number }>();

    for (const item of rtItems) {
      const current = map.get(item.rw) || {
        label: item.rw,
        totalKg: 0,
        countRt: 0,
      };
      current.totalKg += item.gempolinProcessedKg ?? 0;
      current.countRt += 1;
      map.set(item.rw, current);
    }

    const list = Array.from(map.values());

    if (sortBy === "highest") {
      list.sort((a, b) => b.totalKg - a.totalKg);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.totalKg - b.totalKg);
    } else {
      list.sort((a, b) => a.label.localeCompare(b.label));
    }

    return list;
  }, [rtItems, sortBy]);

  // 2. Data RT (untuk mode RT)
  const rtDataList = useMemo(() => {
    let list = rtItems.filter((item) => (item.gempolinProcessedKg ?? 0) >= 0);

    // Filter RW lokal jika dipilih
    if (!isSingleRw && selectedRwFilter !== "all") {
      list = list.filter((item) => item.rw === selectedRwFilter);
    }

    if (sortBy === "highest") {
      list.sort(
        (a, b) => (b.gempolinProcessedKg ?? 0) - (a.gempolinProcessedKg ?? 0),
      );
    } else if (sortBy === "lowest") {
      list.sort(
        (a, b) => (a.gempolinProcessedKg ?? 0) - (b.gempolinProcessedKg ?? 0),
      );
    } else {
      list.sort((a, b) => {
        if (a.rw !== b.rw) return a.rw.localeCompare(b.rw);
        return a.rt.localeCompare(b.rt);
      });
    }

    // Jika menampilkan semua RW pada mode RT, batasi ke top 12 agar grafik vertikal tetap proporsional
    if (!isSingleRw && selectedRwFilter === "all" && list.length > 12) {
      return list.slice(0, 12);
    }

    return list;
  }, [rtItems, isSingleRw, selectedRwFilter, sortBy]);

  // Kategori & Series untuk ApexCharts
  const { categories, seriesData, legendSummary } = useMemo(() => {
    if (effectiveMode === "rw") {
      const cats = rwAggregates.map((item) => item.label);
      const vals = rwAggregates.map((item) => item.totalKg);
      const total = vals.reduce((a, b) => a + b, 0);
      const avg = vals.length > 0 ? Math.round(total / vals.length) : 0;
      const top = rwAggregates.length > 0
        ? [...rwAggregates].sort((a, b) => b.totalKg - a.totalKg)[0]
        : null;

      return {
        categories: cats,
        seriesData: vals,
        legendSummary: {
          totalKg: total,
          avgKg: avg,
          unitLabel: "RW",
          topItem: top ? `${top.label} (${top.totalKg.toLocaleString("id-ID")} kg)` : "-",
        },
      };
    }

    // Mode RT
    const cats = rtDataList.map((item) =>
      isSingleRw || selectedRwFilter !== "all"
        ? item.rt
        : `${item.rt} (${item.rw})`,
    );
    const vals = rtDataList.map((item) => item.gempolinProcessedKg ?? 0);
    const total = vals.reduce((a, b) => a + b, 0);
    const avg = vals.length > 0 ? Math.round(total / vals.length) : 0;
    const top = rtDataList.length > 0
      ? [...rtDataList].sort(
          (a, b) => (b.gempolinProcessedKg ?? 0) - (a.gempolinProcessedKg ?? 0),
        )[0]
      : null;

    return {
      categories: cats,
      seriesData: vals,
      legendSummary: {
        totalKg: total,
        avgKg: avg,
        unitLabel: "RT",
        topItem: top
          ? `${top.rt} · ${top.rw} (${(top.gempolinProcessedKg ?? 0).toLocaleString("id-ID")} kg)`
          : "-",
      },
    };
  }, [effectiveMode, rwAggregates, rtDataList, isSingleRw, selectedRwFilter]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [isDark ? "#10B981" : "#059669"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length <= 6 ? "32%" : "44%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toLocaleString("id-ID")} kg`,
      offsetY: -20,
      style: {
        fontSize: "10px",
        fontWeight: 600,
        colors: [isDark ? "#94A3B8" : "#475569"],
      },
    },
    grid: {
      borderColor: isDark ? "#1E293B" : "#F1F5F9",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { top: 20 },
    },
    xaxis: {
      categories,
      labels: {
        rotate: categories.length > 8 ? -35 : 0,
        rotateAlways: false,
        trim: true,
        style: {
          colors: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toLocaleString("id-ID")} kg`,
        style: {
          colors: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) =>
          `${val.toLocaleString("id-ID")} kg terolah (${(
            (val / (legendSummary.totalKg || 1)) *
            100
          ).toFixed(1)}%)`,
      },
    },
  };

  const series = [{ name: "Tonase Terolah", data: seriesData }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Sebaran Pengolahan Sampah Wilayah
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Perbandingan tonase sampah terolah pada {scopeLabel}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Mode RW vs RT (jika multi-RW) */}
          {!isSingleRw && (
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setViewMode("rw")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === "rw"
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Tingkat RW
              </button>
              <button
                type="button"
                onClick={() => setViewMode("rt")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === "rt"
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Rincian RT
              </button>
            </div>
          )}

          {/* Pemilih RW spesifik saat di mode RT (jika multi-RW) */}
          {!isSingleRw && effectiveMode === "rt" && (
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="chart-rw-filter"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Pilih RW:
              </label>
              <select
                id="chart-rw-filter"
                value={selectedRwFilter}
                onChange={(e) => setSelectedRwFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="all">Semua RW (Top 12)</option>
                {uniqueRws.map((rw) => (
                  <option key={rw} value={rw}>
                    {rw}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Parameter Urutan Berat */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="chart-sort-by"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Urut:
            </label>
            <select
              id="chart-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="highest">Tonase Tertinggi</option>
              <option value="lowest">Tonase Terendah</option>
              <option value="name">Nama Wilayah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend & Ringkasan Metrik Parameter Berat */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50/70 p-3.5 dark:bg-gray-800/40 sm:grid-cols-4">
        <div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Total Tonase
          </span>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {legendSummary.totalKg.toLocaleString("id-ID")} kg
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Rata-rata per {legendSummary.unitLabel}
          </span>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-gray-800 dark:text-gray-200">
            {legendSummary.avgKg.toLocaleString("id-ID")} kg
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Wilayah Tertinggi
          </span>
          <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
            {legendSummary.topItem}
          </p>
        </div>
        <div className="flex items-center sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="h-3 w-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
            <span className="font-medium">Tonase Terolah (kg)</span>
          </div>
        </div>
      </div>

      {/* Canvas Grafik Vertical Bar */}
      <div className="mt-4">
        {seriesData.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-xs text-gray-400">
            Belum ada data pengolahan sampah pada wilayah ini.
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={320}
          />
        )}
      </div>
    </div>
  );
}
