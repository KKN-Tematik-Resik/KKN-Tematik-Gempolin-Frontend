"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon, MapIcon, SearchIcon, TableIcon } from "@/icons";
import type { ParticipationIndicatorKey } from "@/types/spatial";
import { cn } from "@/utils";
import React from "react";

export interface SpatialFilterBarProps {
  indicator: ParticipationIndicatorKey;
  rw: string;
  rwList: string[];
  search: string;
  view: "map" | "table";
  onIndicatorChange: (val: ParticipationIndicatorKey) => void;
  onRwChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onViewChange: (val: "map" | "table") => void;
  onReset: () => void;
}

const INDICATOR_OPTIONS: Array<{
  key: ParticipationIndicatorKey;
  label: string;
}> = [
  { key: "rumah_memilah", label: "% Rumah Memilah" },
  { key: "rumah_mengolah", label: "% Rumah Mengolah" },
  { key: "kk_memilah", label: "% KK Memilah" },
  { key: "kk_mengolah", label: "% KK Mengolah" },
  { key: "warga_memilah", label: "% Warga Memilah" },
  { key: "warga_mengolah", label: "% Warga Mengolah" },
];

export default function SpatialFilterBar({
  indicator,
  rw,
  rwList,
  search,
  view,
  onIndicatorChange,
  onRwChange,
  onSearchChange,
  onViewChange,
  onReset,
}: SpatialFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:gap-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Kontrol Utama: Pemilih Indikator & Wilayah */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          {/* Dropdown Indikator */}
          <div className="flex flex-col gap-1 sm:w-60">
            <label
              htmlFor="filter-indikator"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400"
            >
              Indikator Partisipasi
            </label>
            <div className="relative">
              <select
                id="filter-indikator"
                value={indicator}
                onChange={(e) =>
                  onIndicatorChange(e.target.value as ParticipationIndicatorKey)
                }
                className="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {INDICATOR_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropdown RW */}
          <div className="flex flex-col gap-1 sm:w-44">
            <label
              htmlFor="filter-rw"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400"
            >
              Wilayah RW
            </label>
            <select
              id="filter-rw"
              value={rw}
              onChange={(e) => onRwChange(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Semua RW</option>
              {rwList.map((rwItem) => (
                <option key={rwItem} value={rwItem}>
                  {rwItem}
                </option>
              ))}
            </select>
          </div>

          {/* Pencarian RT */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:w-48">
            <label
              htmlFor="filter-search-rt"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400"
            >
              Cari RT
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                <SearchIcon className="size-4" />
              </div>
              <Input
                id="filter-search-rt"
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Contoh: RT 003"
                className="h-10 ps-9 text-sm rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Toggle Mode Tampilan & Tombol Reset */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 sm:justify-end sm:border-0 sm:pt-0 dark:border-gray-800">
          {/* Segmented Control: Peta / Tabel */}
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-800 dark:bg-gray-800/80">
            <button
              type="button"
              onClick={() => onViewChange("map")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                view === "map"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
              )}
              aria-pressed={view === "map"}
            >
              <MapIcon className="size-3.5" />
              <span>Peta</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange("table")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                view === "table"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
              )}
              aria-pressed={view === "table"}
            >
              <TableIcon className="size-3.5" />
              <span>Tabel</span>
            </button>
          </div>

          {/* Reset Filter Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
          >
            <FilterIcon className="size-3.5 text-gray-500" />
            <span>Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
