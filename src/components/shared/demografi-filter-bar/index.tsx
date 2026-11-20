"use client";

import { FilterIcon, MapIcon, TableIcon } from "@/icons";
import type { ObjekType } from "@/types/demografi";
import React from "react";

export interface DemografiFilterBarProps {
  activeObjek: ObjekType;
  selectedRw: string;
  rwOptions: Array<{ value: string; label: string }>;
  activeView: "table" | "map";
  onObjekChange: (objek: ObjekType) => void;
  onRwChange: (rw: string) => void;
  onViewChange: (view: "table" | "map") => void;
  onReset: () => void;
  isPending?: boolean;
}

const OBJEK_ITEMS: Array<{ id: ObjekType; label: string }> = [
  { id: "rumah", label: "Rumah" },
  { id: "kk", label: "Kepala Keluarga (KK)" },
  { id: "warga", label: "Warga (Jiwa)" },
];

export default function DemografiFilterBar({
  activeObjek,
  selectedRw,
  rwOptions,
  activeView,
  onObjekChange,
  onRwChange,
  onViewChange,
  onReset,
  isPending = false,
}: DemografiFilterBarProps) {
  const isFiltered =
    activeObjek !== "rumah" ||
    (selectedRw !== "" && selectedRw !== "all") ||
    activeView !== "table";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Segmented Control: Objek Toggle */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:me-2">
          Objek Analisis:
        </span>
        <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800/80">
          {OBJEK_ITEMS.map((item) => {
            const isActive = activeObjek === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onObjekChange(item.id)}
                disabled={isPending}
                className={`relative rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-xs dark:bg-brand-500"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                } ${isPending ? "cursor-wait opacity-70" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Wilayah & Mode Tampilan & Tombol Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Mode: Tabel vs Peta Interaktif */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={() => onViewChange("table")}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
              activeView === "table"
                ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            <TableIcon className="size-3.5" />
            <span>Tabel Hierarki</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange("map")}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
              activeView === "map"
                ? "bg-brand-600 text-white shadow-xs dark:bg-brand-500"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            <MapIcon className="size-3.5" />
            <span>Peta Spasial</span>
          </button>
        </div>

        {/* Dropdown Wilayah RW */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-rw-select"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Wilayah:
          </label>
          <select
            id="filter-rw-select"
            value={selectedRw}
            onChange={(e) => onRwChange(e.target.value)}
            disabled={isPending}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-800 transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua RW (Kelurahan)</option>
            {rwOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isFiltered ? (
          <button
            type="button"
            onClick={onReset}
            disabled={isPending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-transparent px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <FilterIcon className="size-3.5" />
            <span>Reset</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
