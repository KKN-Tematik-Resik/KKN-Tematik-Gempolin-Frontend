"use client";

import type { GempolinHarian } from "@/types/gempolin";
import { formatNumber } from "@/utils";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
  ),
});

export interface GempolinTrendChartProps {
  data: GempolinHarian[];
}

export default function GempolinTrendChart({ data }: GempolinTrendChartProps) {
  const { categories, values, averageVal, maxVal, maxDate } = useMemo(() => {
    // Kelompokkan beratTerolah berdasarkan tanggal
    const dailyMap = new Map<string, number>();

    for (const item of data) {
      const current = dailyMap.get(item.tanggal) ?? 0;
      dailyMap.set(item.tanggal, current + item.beratTerolah);
    }

    // Urutkan tanggal secara kronologis (ascending)
    const sortedDates = Array.from(dailyMap.keys()).sort();

    const formattedCats = sortedDates.map((dateStr) => {
      const parts = dateStr.split("-").map(Number);
      if (parts.length >= 3 && !parts.some(Number.isNaN)) {
        const [, month, day] = parts;
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
          "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
        ];
        return `${day} ${monthNames[month - 1] ?? ""}`;
      }
      return dateStr;
    });

    const seriesValues = sortedDates.map((date) => dailyMap.get(date) ?? 0);
    const sum = seriesValues.reduce((acc, v) => acc + v, 0);
    const avg =
      seriesValues.length > 0 ? Math.round(sum / seriesValues.length) : 0;
    const max = seriesValues.length > 0 ? Math.max(...seriesValues) : 0;
    const maxIdx = seriesValues.indexOf(max);
    const peakDate = maxIdx >= 0 ? (formattedCats[maxIdx] ?? "—") : "—";

    return {
      categories: formattedCats,
      values: seriesValues,
      averageVal: avg,
      maxVal: max,
      maxDate: peakDate,
    };
  }, [data]);

  const series = useMemo(
    () => [
      {
        name: "Berat Terolah",
        data: values,
      },
    ],
    [values],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 310,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
      },
      colors: ["#059669"], // Pine Green (Brand 600)
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          columnWidth: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      annotations: {
        yaxis: [
          {
            y: averageVal,
            borderColor: "#F59E0B", // Amber 500
            strokeDashArray: 5,
            borderWidth: 2,
            label: {
              borderColor: "#F59E0B",
              style: {
                color: "#FFFFFF",
                background: "#F59E0B",
                fontSize: "11px",
                fontWeight: 600,
              },
              text: `Rata-rata: ${formatNumber(averageVal)} kg`,
              position: "right",
              offsetX: -10,
            },
          },
        ],
      },
      grid: {
        borderColor: "rgba(156, 163, 175, 0.2)",
        strokeDashArray: 4,
        yaxis: {
          lines: { show: true },
        },
        xaxis: {
          lines: { show: false },
        },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: "#9CA3AF",
            fontSize: "11px",
          },
          rotate: -45,
          rotateAlways: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `${Math.round(val)} kg`,
          style: {
            colors: "#9CA3AF",
            fontSize: "11px",
          },
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val: number) => {
            const diff = val - averageVal;
            const diffText =
              diff > 0
                ? `(+${formatNumber(diff)} kg di atas rata-rata)`
                : diff < 0
                  ? `(${formatNumber(diff)} kg di bawah rata-rata)`
                  : "(Sama dengan rata-rata)";
            return `${formatNumber(val)} kg ${diffText}`;
          },
        },
      },
      legend: {
        show: false,
      },
    }),
    [categories, averageVal],
  );

  return (
    <div className="w-full space-y-3">
      {/* Legend & Stats Ringkasan Cepat */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-xs bg-brand-600" />
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Berat Terolah per Hari
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-amber-500" />
            <span className="font-medium text-amber-700 dark:text-amber-400">
              Garis Rata-Rata ({formatNumber(averageVal)} kg)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <span>
            Puncak:{" "}
            <strong className="text-gray-900 tabular-nums dark:text-white">
              {formatNumber(maxVal)} kg
            </strong>{" "}
            ({maxDate})
          </span>
        </div>
      </div>

      {/* Kontainer Grafik Batang */}
      <div className="overflow-hidden">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={310}
        />
      </div>
    </div>
  );
}
