"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress-bar";
import { RegenerateIcon, TrashBinIcon } from "@/icons";
import type { AktivitasType, ObjekType } from "@/types/demografi";
import { formatNumber } from "@/utils";
import React from "react";

export interface IndicatorCardProps {
  label: string;
  numerator: number;
  denominator: number;
  percentage: number | null;
  activity: AktivitasType;
  objectType: ObjekType;
  sublabel?: string;
  isLoading?: boolean;
}

const OBJECT_LABELS: Record<ObjekType, string> = {
  rumah: "Rumah",
  kk: "KK",
  warga: "Warga",
};

export default function IndicatorCard({
  label,
  numerator,
  denominator,
  percentage,
  activity,
  objectType,
  sublabel,
  isLoading = false,
}: IndicatorCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-9 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 h-2 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const isAvailable = percentage !== null;
  const objectUnit = OBJECT_LABELS[objectType];
  const progressValue = isAvailable ? Math.min(Math.max(percentage, 0), 100) : 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            {activity === "memilah" ? (
              <TrashBinIcon className="size-4.5" />
            ) : (
              <RegenerateIcon className="size-4.5" />
            )}
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {isAvailable ? (
            <span className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums dark:text-white">
              {percentage.toFixed(1)}%
            </span>
          ) : (
            <Badge color="gray" variant="light">
              Data tidak tersedia
            </Badge>
          )}
        </div>

        <p className="mt-1 text-xs text-gray-500 tabular-nums dark:text-gray-400">
          {isAvailable
            ? `${formatNumber(numerator)} dari ${formatNumber(denominator)} ${objectUnit}`
            : `Penyebut belum terdata (0 ${objectUnit})`}
        </p>
      </div>

      <div className="mt-5">
        <Progress value={progressValue} className="w-full" />
        {sublabel ? (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {sublabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
