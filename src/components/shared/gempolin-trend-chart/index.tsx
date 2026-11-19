"use client";

import type { GempolinHarian } from "@/types/gempolin";
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
  const { categories, values } = useMemo(() => {
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

    return {
      categories: formattedCats,
      values: seriesValues,
    };
  }, [data]);

  const series = useMemo(
    () => [
      {
        name: "Berat Terolah (kg)",
        data: values,
      },
    ],
    [values],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 310,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
      },
      colors: ["#059669"], // Pine Green (Brand 600)
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100],
        },
      },
      dataLabels: {
        enabled: false,
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
            fontSize: "12px",
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
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val: number) => `${val} kg`,
        },
      },
      legend: {
        show: false,
      },
    }),
    [categories],
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
}
