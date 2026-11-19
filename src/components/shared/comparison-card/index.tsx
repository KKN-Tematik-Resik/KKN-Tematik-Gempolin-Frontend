import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import {
  calculateDelta,
  formatNumber,
  formatPercentageDelta,
  formatWeightKg,
} from "@/utils";
import React from "react";

export interface ComparisonCardProps {
  currentLabel: string;
  previousLabel: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  currentRequest: number;
  previousRequest: number;
}

export default function ComparisonCard({
  currentLabel,
  previousLabel,
  currentValue,
  previousValue,
  unit,
  currentRequest,
  previousRequest,
}: ComparisonCardProps) {
  const tonaseDelta = calculateDelta(currentValue, previousValue);
  const requestDelta = calculateDelta(currentRequest, previousRequest);

  const isTonasePositive = tonaseDelta.absolute >= 0;
  const isRequestPositive = requestDelta.absolute >= 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Kolom 1: Tonase Bulan Berjalan */}
        <div className="flex flex-col justify-between border-b border-gray-100 pb-4 sm:border-b-0 sm:border-e sm:pb-0 sm:pe-6 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-400">
              Periode Berjalan
            </span>
            <h4 className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {currentLabel}
            </h4>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums dark:text-white">
              {formatWeightKg(currentValue)}
            </span>
            <p className="mt-1 text-xs text-gray-500 tabular-nums dark:text-gray-400">
              {formatNumber(currentRequest)} total request
            </p>
          </div>
        </div>

        {/* Kolom 2: Tonase Periode Sebelumnya */}
        <div className="flex flex-col justify-between border-b border-gray-100 pb-4 sm:border-b-0 lg:border-e lg:pb-0 lg:pe-6 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Periode Lalu
            </span>
            <h4 className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {previousLabel}
            </h4>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-gray-700 tabular-nums dark:text-gray-300">
              {formatWeightKg(previousValue)}
            </span>
            <p className="mt-1 text-xs text-gray-500 tabular-nums dark:text-gray-400">
              {formatNumber(previousRequest)} total request
            </p>
          </div>
        </div>

        {/* Kolom 3: Selisih Berat Terolah (FR-27) */}
        <div className="flex flex-col justify-between border-b border-gray-100 pb-4 sm:border-b-0 sm:border-e sm:pb-0 sm:pe-6 dark:border-gray-800">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Selisih Tonase Terolah
            </span>
            <h4 className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Perubahan Volume
            </h4>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold tracking-tight tabular-nums ${
                  isTonasePositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isTonasePositive ? "+" : ""}
                {formatNumber(tonaseDelta.absolute)} {unit}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`inline-flex items-center text-xs font-semibold tabular-nums ${
                  isTonasePositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {tonaseDelta.percentage !== null ? (
                  <>
                    {isTonasePositive ? (
                      <ArrowUpIcon className="size-3" />
                    ) : (
                      <ArrowDownIcon className="size-3" />
                    )}
                    {formatPercentageDelta(tonaseDelta.percentage)}
                  </>
                ) : (
                  "—"
                )}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs bulan lalu
              </span>
            </div>
          </div>
        </div>

        {/* Kolom 4: Selisih Request (FR-27) */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Selisih Permintaan
            </span>
            <h4 className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Aktivitas Request
            </h4>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold tracking-tight tabular-nums ${
                  isRequestPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isRequestPositive ? "+" : ""}
                {formatNumber(requestDelta.absolute)} request
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`inline-flex items-center text-xs font-semibold tabular-nums ${
                  isRequestPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {requestDelta.percentage !== null ? (
                  <>
                    {isRequestPositive ? (
                      <ArrowUpIcon className="size-3" />
                    ) : (
                      <ArrowDownIcon className="size-3" />
                    )}
                    {formatPercentageDelta(requestDelta.percentage)}
                  </>
                ) : (
                  "—"
                )}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs bulan lalu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
