"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { formatNumber, formatPercentageDelta } from "@/utils";
import React from "react";

export interface MetricCardProps {
  title: string;
  value: number | null;
  unit?: string;
  sublabel?: string;
  trend?: {
    percentage: number | null;
    isPositive: boolean;
    comparisonLabel: string;
  };
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function MetricCard({
  title,
  value,
  unit,
  sublabel,
  trend,
  icon,
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-9 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-3 h-4 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const isAvailable = value !== null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {icon ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        {isAvailable ? (
          <>
            <span className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums dark:text-white">
              {formatNumber(value)}
            </span>
            {unit ? (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {unit}
              </span>
            ) : null}
          </>
        ) : (
          <Badge color="warning" size="sm">
            Data tidak tersedia
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {trend ? (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center text-xs font-semibold tabular-nums ${
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.percentage !== null ? (
                <>
                  {trend.isPositive ? (
                    <ArrowUpIcon className="size-3.5" />
                  ) : (
                    <ArrowDownIcon className="size-3.5" />
                  )}
                  {formatPercentageDelta(trend.percentage)}
                </>
              ) : (
                "—"
              )}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {trend.comparisonLabel}
            </span>
          </div>
        ) : sublabel ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
