"use client";

import { useTheme } from "@/context/theme-context";
import { getParticipationColor } from "@/utils/calculations";
import { cn } from "@/utils";
import React from "react";

export interface SpatialLegendProps {
  activeClasses: number[];
  onToggleClass: (classNum: number) => void;
  countsByClass: Record<number | "none", number>;
}

interface LegendEntry {
  classNum: number;
  label: string;
  range: string;
}

const LEGEND_ENTRIES: LegendEntry[] = [
  { classNum: 1, label: "Sangat Tinggi", range: "80%–100%" },
  { classNum: 2, label: "Tinggi", range: "60%–<80%" },
  { classNum: 3, label: "Sedang", range: "40%–<60%" },
  { classNum: 4, label: "Rendah", range: "20%–<40%" },
  { classNum: 5, label: "Sangat Rendah", range: "0%–<20%" },
];

export default function SpatialLegend({
  activeClasses,
  onToggleClass,
  countsByClass,
}: SpatialLegendProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      aria-label="Legenda Tingkat Partisipasi 5-Kelas"
      className="flex flex-col gap-2 rounded-2xl border border-gray-200/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-md sm:p-4 dark:border-gray-800/80 dark:bg-gray-900/95"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider dark:text-gray-200">
          Legenda Partisipasi
        </span>
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
          (Klik untuk filter)
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {LEGEND_ENTRIES.map((entry) => {
          const isActive =
            activeClasses.length === 0 || activeClasses.includes(entry.classNum);
          const color = getParticipationColor(
            entry.classNum as 1 | 2 | 3 | 4 | 5,
            isDark,
          );
          const count = countsByClass[entry.classNum] || 0;

          return (
            <button
              key={entry.classNum}
              type="button"
              onClick={() => onToggleClass(entry.classNum)}
              className={cn(
                "group flex items-center justify-between gap-2.5 rounded-lg px-2 py-1 text-start transition-all",
                isActive
                  ? "bg-gray-50 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800/50 dark:text-white dark:hover:bg-gray-800"
                  : "text-gray-400 opacity-50 hover:opacity-75 dark:text-gray-500",
              )}
              aria-pressed={isActive}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-3.5 shrink-0 rounded-md shadow-xs transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-semibold">{entry.label}</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {entry.range}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold tabular-nums text-gray-600 dark:text-gray-300">
                {count} RT
              </span>
            </button>
          );
        })}

        {/* Baris Status: Data Tidak Tersedia (BR-07) */}
        <div className="flex items-center justify-between gap-2.5 rounded-lg border-t border-dashed border-gray-200 px-2 pt-2 text-gray-600 dark:border-gray-800 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span
              className="size-3.5 shrink-0 rounded-md shadow-xs"
              style={{
                backgroundColor: getParticipationColor(null, isDark),
              }}
              aria-hidden="true"
            />
            <span className="font-medium">Data Tidak Tersedia</span>
          </div>
          <span className="font-mono text-[11px] font-bold tabular-nums text-gray-600 dark:text-gray-400">
            {countsByClass.none || 0} RT
          </span>
        </div>
      </div>
    </aside>
  );
}
