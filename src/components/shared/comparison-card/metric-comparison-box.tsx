import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { formatPercentageDelta } from "@/utils";
import React from "react";

export interface MetricComparisonBoxProps {
  icon: React.ReactNode;
  title: string;
  unitSubtitle: string;
  currentLabel: string;
  previousLabel: string;
  currentDisplay: string;
  previousDisplay: string;
  deltaAbsolute: number;
  deltaDisplay: string;
  deltaPercentage: number | null;
  deltaLabel: string;
}

export default function MetricComparisonBox({
  icon,
  title,
  unitSubtitle,
  currentLabel,
  previousLabel,
  currentDisplay,
  previousDisplay,
  deltaAbsolute,
  deltaDisplay,
  deltaPercentage,
  deltaLabel,
}: MetricComparisonBoxProps) {
  const isPositive = deltaAbsolute > 0;
  const isNegative = deltaAbsolute < 0;

  const badgeBg = isPositive
    ? "bg-green-50 text-green-700 border-green-200/70 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/60"
    : isNegative
      ? "bg-red-50 text-red-700 border-red-200/70 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60"
      : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";

  const deltaTextColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-gray-600 dark:text-gray-400";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 sm:p-5 transition-colors dark:border-gray-800 dark:bg-white/[0.02]">
      {/* Header: Ikon, Nama Metrik, Satuan & Badge Delta */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {unitSubtitle}
            </p>
          </div>
        </div>

        {/* Badge Persentase */}
        <div
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${badgeBg}`}
        >
          {deltaPercentage !== null ? (
            <>
              {isPositive ? (
                <ArrowUpIcon className="size-3" />
              ) : isNegative ? (
                <ArrowDownIcon className="size-3" />
              ) : null}
              <span>{formatPercentageDelta(deltaPercentage)}</span>
            </>
          ) : (
            <span>—</span>
          )}
          <span className="text-[10px] font-normal opacity-80">
            vs {previousLabel}
          </span>
        </div>
      </div>

      {/* Grid 3 Kolom Nilai Komparasi */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Kolom 1: Bulan Utama */}
        <div className="rounded-lg border border-gray-200/60 bg-white p-3 dark:border-gray-800/80 dark:bg-gray-900/40">
          <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Bulan Utama
          </span>
          <p className="truncate text-xs font-medium text-brand-600 dark:text-brand-400">
            {currentLabel}
          </p>
          <p className="mt-1.5 text-lg font-bold text-gray-900 tabular-nums dark:text-white">
            {currentDisplay}
          </p>
        </div>

        {/* Kolom 2: Bulan Pembanding */}
        <div className="rounded-lg border border-gray-200/60 bg-white p-3 dark:border-gray-800/80 dark:bg-gray-900/40">
          <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Pembanding
          </span>
          <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
            {previousLabel}
          </p>
          <p className="mt-1.5 text-lg font-semibold text-gray-700 tabular-nums dark:text-gray-300">
            {previousDisplay}
          </p>
        </div>

        {/* Kolom 3: Selisih Bersih */}
        <div className="rounded-lg border border-gray-200/60 bg-white p-3 dark:border-gray-800/80 dark:bg-gray-900/40">
          <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            {deltaLabel}
          </span>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Perubahan Bersih
          </p>
          <p
            className={`mt-1.5 text-lg font-bold tabular-nums ${deltaTextColor}`}
          >
            {deltaDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
