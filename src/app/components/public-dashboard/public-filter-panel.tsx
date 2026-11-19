"use client";

import { ChevronDownIcon, RegenerateIcon } from "@/icons";
import type { PublicFilterState } from "@/types/public-dashboard";

interface PublicFilterPanelProps {
  filter: PublicFilterState;
  onChangeFilter: (newFilter: PublicFilterState) => void;
  availableRws: string[];
  availableRts: string[];
}

export default function PublicFilterPanel({
  filter,
  onChangeFilter,
  availableRws,
  availableRts,
}: PublicFilterPanelProps) {
  const handlePeriodeChange = (periode: string) => {
    onChangeFilter({ ...filter, periode });
  };

  const handleRwChange = (rw: string) => {
    onChangeFilter({ ...filter, rw, rt: "all" });
  };

  const handleRtChange = (rt: string) => {
    onChangeFilter({ ...filter, rt });
  };

  const handleReset = () => {
    onChangeFilter({
      periode: "2026-11",
      rw: "all",
      rt: "all",
    });
  };

  const isFiltered =
    filter.periode !== "2026-11" || filter.rw !== "all" || filter.rt !== "all";

  const scopeLabel =
    filter.rw === "all"
      ? "Seluruh Kelurahan Gempolsari (10 RW, 67 RT)"
      : filter.rt === "all"
        ? `Wilayah ${filter.rw} (Seluruh RT)`
        : `Wilayah ${filter.rw} · ${filter.rt}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Indikator Wilayah Terpilih */}
        <div className="flex items-center gap-2.5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Cakupan Wilayah
            </span>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {scopeLabel}
            </p>
          </div>
        </div>

        {/* Baris Tombol Filter RT, RW, Periode */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* 1. Filter Periode */}
          <div className="relative min-w-[130px]">
            <label htmlFor="filter-periode" className="sr-only">
              Filter Periode
            </label>
            <select
              id="filter-periode"
              value={filter.periode}
              onChange={(e) => handlePeriodeChange(e.target.value)}
              className="h-9.5 w-full appearance-none rounded-lg border border-gray-300 bg-white ps-3 pe-8 text-xs font-medium text-gray-900 shadow-2xs outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
            >
              <option value="2026-11">Nov 2026 (Terkini)</option>
              <option value="2026-10">Okt 2026</option>
              <option value="2026-09">Sep 2026</option>
              <option value="all">Semua Bulan</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400 dark:text-gray-400">
              <ChevronDownIcon className="size-3.5" />
            </span>
          </div>

          {/* 2. Filter RW */}
          <div className="relative min-w-[120px]">
            <label htmlFor="filter-rw" className="sr-only">
              Filter RW
            </label>
            <select
              id="filter-rw"
              value={filter.rw}
              onChange={(e) => handleRwChange(e.target.value)}
              className="h-9.5 w-full appearance-none rounded-lg border border-gray-300 bg-white ps-3 pe-8 text-xs font-medium text-gray-900 shadow-2xs outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
            >
              <option value="all">Semua RW</option>
              {availableRws.map((rw) => (
                <option key={rw} value={rw}>
                  {rw}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400 dark:text-gray-400">
              <ChevronDownIcon className="size-3.5" />
            </span>
          </div>

          {/* 3. Filter RT */}
          <div className="relative min-w-[120px]">
            <label htmlFor="filter-rt" className="sr-only">
              Filter RT
            </label>
            <select
              id="filter-rt"
              value={filter.rt}
              onChange={(e) => handleRtChange(e.target.value)}
              disabled={filter.rw === "all"}
              className="h-9.5 w-full appearance-none rounded-lg border border-gray-300 bg-white ps-3 pe-8 text-xs font-medium text-gray-900 shadow-2xs outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20 dark:disabled:border-gray-800 dark:disabled:bg-gray-850 dark:disabled:text-gray-500 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
            >
              <option value="all">
                {filter.rw === "all" ? "Semua RT" : "Semua RT"}
              </option>
              {availableRts.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400 dark:text-gray-400">
              <ChevronDownIcon className="size-3.5" />
            </span>
          </div>

          {/* 4. Tombol Reset Filter */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="flex h-9.5 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <RegenerateIcon className="size-3.5 text-gray-500 dark:text-gray-400" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
