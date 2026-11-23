"use client";

import { useTheme } from "@/context/theme-context";
import type { MonthlyTrendItem, PublicRtItem } from "@/types/public-dashboard";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-52 w-full animate-pulse items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <span className="text-xs text-gray-400">Memuat tren operasional...</span>
    </div>
  ),
});

type PeriodPreset = "3m" | "6m" | "1y" | "custom";

interface OperationalSummaryCardProps {
  totalRequests: number;
  totalProcessedKg: number;
  monthlyTrends: MonthlyTrendItem[];
  allRtData?: PublicRtItem[];
  availableRws?: string[];
  initialRw?: string;
  initialRt?: string;
}

export default function OperationalSummaryCard({
  totalRequests: fallbackRequests,
  totalProcessedKg: fallbackProcessedKg,
  monthlyTrends,
  allRtData = [],
  availableRws = [],
  initialRw = "all",
  initialRt = "all",
}: OperationalSummaryCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State filter wilayah (RW & RT) mandiri di kartu
  const [selectedRw, setSelectedRw] = useState<string>(initialRw);
  const [selectedRt, setSelectedRt] = useState<string>(initialRt);

  // Sinkronkan saat filter global parent berubah
  useEffect(() => {
    setSelectedRw(initialRw);
  }, [initialRw]);

  useEffect(() => {
    setSelectedRt(initialRt);
  }, [initialRt]);

  // Ekstrak daftar RT unik untuk RW yang sedang aktif
  const cardAvailableRts = useMemo(() => {
    if (selectedRw === "all" || !allRtData.length) return [];
    const rts = allRtData
      .filter((d) => d.rw === selectedRw)
      .map((d) => d.rt);
    return Array.from(new Set(rts)).sort((a, b) => a.localeCompare(b));
  }, [allRtData, selectedRw]);

  // State filter periode preset & custom
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("6m");
  const [customStart, setCustomStart] = useState<string>(
    monthlyTrends[0]?.periodeKey ?? "2025-12",
  );
  const [customEnd, setCustomEnd] = useState<string>(
    monthlyTrends[monthlyTrends.length - 1]?.periodeKey ?? "2026-11",
  );

  // Hitung bobot wilayah terhadap agregat kelurahan
  const { weightKg, weightReq, scopeText } = useMemo(() => {
    if (!allRtData.length || (selectedRw === "all" && selectedRt === "all")) {
      return { weightKg: 1, weightReq: 1, scopeText: "Kelurahan Gempolsari" };
    }

    const kelurahanKg =
      allRtData.reduce((acc, item) => acc + (item.gempolinProcessedKg ?? 0), 0) || 1;
    const kelurahanReq =
      allRtData.reduce((acc, item) => acc + (item.gempolinRequests ?? 0), 0) || 1;

    const targetRtItems = allRtData.filter((item) => {
      if (selectedRw !== "all" && item.rw !== selectedRw) return false;
      if (selectedRt !== "all" && item.rt !== selectedRt) return false;
      return true;
    });

    const wilKg = targetRtItems.reduce(
      (acc, item) => acc + (item.gempolinProcessedKg ?? 0),
      0,
    );
    const wilReq = targetRtItems.reduce(
      (acc, item) => acc + (item.gempolinRequests ?? 0),
      0,
    );

    const text =
      selectedRw === "all"
        ? "Kelurahan Gempolsari"
        : selectedRt === "all"
        ? selectedRw
        : `${selectedRw} · ${selectedRt}`;

    return {
      weightKg: Math.max(0.01, wilKg / kelurahanKg),
      weightReq: Math.max(0.01, wilReq / kelurahanReq),
      scopeText: text,
    };
  }, [allRtData, selectedRw, selectedRt]);

  // Deret waktu bulanan yang disesuaikan dengan bobot wilayah
  const regionalMonthlyTrends = useMemo(() => {
    if (weightKg === 1 && weightReq === 1) return monthlyTrends;

    return monthlyTrends.map((item) => ({
      ...item,
      gempolinProcessedKg: Math.round(item.gempolinProcessedKg * weightKg),
      gempolinRequests: Math.round(item.gempolinRequests * weightReq),
    }));
  }, [monthlyTrends, weightKg, weightReq]);

  // Filter tren data sesuai periode yang dipilih
  const filteredTrends = useMemo(() => {
    if (!regionalMonthlyTrends || regionalMonthlyTrends.length === 0) return [];

    if (periodPreset === "3m") {
      return regionalMonthlyTrends.slice(-3);
    }
    if (periodPreset === "6m") {
      return regionalMonthlyTrends.slice(-6);
    }
    if (periodPreset === "1y") {
      return regionalMonthlyTrends.slice(-12);
    }

    // Mode custom
    const startIdx = regionalMonthlyTrends.findIndex(
      (item) => item.periodeKey === customStart,
    );
    const endIdx = regionalMonthlyTrends.findIndex(
      (item) => item.periodeKey === customEnd,
    );

    if (startIdx === -1 || endIdx === -1) {
      return regionalMonthlyTrends;
    }

    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);

    return regionalMonthlyTrends.slice(minIdx, maxIdx + 1);
  }, [regionalMonthlyTrends, periodPreset, customStart, customEnd]);

  // Hitung total tonase dan permintaan terakumulasi pada periode terpilih
  const { displayTotalKg, displayTotalRequests } = useMemo(() => {
    if (filteredTrends.length === 0) {
      return {
        displayTotalKg: fallbackProcessedKg,
        displayTotalRequests: fallbackRequests,
      };
    }

    const totalKg = filteredTrends.reduce(
      (sum, item) => sum + item.gempolinProcessedKg,
      0,
    );
    const totalReq = filteredTrends.reduce(
      (sum, item) => sum + item.gempolinRequests,
      0,
    );

    return {
      displayTotalKg: totalKg,
      displayTotalRequests: totalReq,
    };
  }, [filteredTrends, fallbackProcessedKg, fallbackRequests]);

  const categories = filteredTrends.map((t) => t.label);

  const gempolinOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [isDark ? "#10B981" : "#059669"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    stroke: { curve: "smooth", width: 2.5 },
    grid: {
      borderColor: isDark ? "#1E293B" : "#F1F5F9",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (val >= 1000) {
            return `${(val / 1000).toFixed(1)}t`;
          }
          return `${val}kg`;
        },
        style: {
          colors: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toLocaleString("id-ID")} kg terolah`,
      },
    },
  };

  const gempolinSeries = [
    {
      name: "Sampah Terolah",
      data: filteredTrends.map((t) => t.gempolinProcessedKg),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Header & Controls Filter (Wilayah + Periode) */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Rekapitulasi Operasional Layanan
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Dinamika volume sampah terolah dan pengangkutan layanan Gempolin
          </p>
        </div>

        {/* Filter Controls: Wilayah (RW & RT) + Periode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Wilayah RW */}
          {availableRws.length > 0 && (
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="wave-rw-filter"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Wilayah:
              </label>
              <select
                id="wave-rw-filter"
                value={selectedRw}
                onChange={(e) => {
                  setSelectedRw(e.target.value);
                  setSelectedRt("all");
                }}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="all">Semua RW</option>
                {availableRws.map((rw) => (
                  <option key={`wave-${rw}`} value={rw}>
                    {rw}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Wilayah RT (aktif jika RW spesifik dipilih) */}
          {selectedRw !== "all" && cardAvailableRts.length > 0 && (
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="wave-rt-filter"
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                RT:
              </label>
              <select
                id="wave-rt-filter"
                value={selectedRt}
                onChange={(e) => setSelectedRt(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="all">Semua RT ({selectedRw})</option>
                {cardAvailableRts.map((rt) => (
                  <option key={`wave-${selectedRw}-${rt}`} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Periode Chips */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setPeriodPreset("3m")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                periodPreset === "3m"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              3 Bulan
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset("6m")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                periodPreset === "6m"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              6 Bulan
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset("1y")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                periodPreset === "1y"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              1 Tahun
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset("custom")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                periodPreset === "custom"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Kustom
            </button>
          </div>
        </div>
      </div>

      {/* Baris Pemilih Rentang Waktu Kustom */}
      {periodPreset === "custom" && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-800/40">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Rentang Periode Kustom:
          </span>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="custom-start-period"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Dari:
            </label>
            <select
              id="custom-start-period"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {monthlyTrends.map((t) => (
                <option key={`start-${t.periodeKey}`} value={t.periodeKey}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="custom-end-period"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Sampai:
            </label>
            <select
              id="custom-end-period"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {monthlyTrends.map((t) => (
                <option key={`end-${t.periodeKey}`} value={t.periodeKey}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-[11px] text-gray-400">
            ({filteredTrends.length} bulan terpilih)
          </span>
        </div>
      )}

      {/* Ringkasan Akumulasi & Wave Chart */}
      <div className="mt-5 space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
          <div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Layanan Gempolin
            </span>
            <p className="text-xs text-gray-400">
              {periodPreset === "custom"
                ? `Akumulasi ${filteredTrends[0]?.label ?? ""} – ${filteredTrends[filteredTrends.length - 1]?.label ?? ""} · ${scopeText}`
                : `Akumulasi ${filteredTrends.length} Bulan Terakhir · ${scopeText}`}
            </p>
          </div>
          <div className="text-start sm:text-end">
            <span className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {displayTotalKg.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal">kg</span>
            </span>
            <p className="text-[11px] tabular-nums text-gray-400">
              {displayTotalRequests.toLocaleString("id-ID")} total permintaan
              layanan
            </p>
          </div>
        </div>

        {filteredTrends.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-xs text-gray-400">
            Tidak ada data tren pada periode yang dipilih.
          </div>
        ) : (
          <ReactApexChart
            options={gempolinOptions}
            series={gempolinSeries}
            type="area"
            height={220}
          />
        )}
      </div>
    </div>
  );
}
