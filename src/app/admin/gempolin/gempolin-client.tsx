"use client";

import ComponentCard from "@/components/common/component-card";
import ComparisonCard from "@/components/shared/comparison-card";
import GempolinDailyTable from "@/components/shared/gempolin-daily-table";
import GempolinMonthlyTable from "@/components/shared/gempolin-monthly-table";
import GempolinRtTable from "@/components/shared/gempolin-rt-table";
import GempolinTrendChart from "@/components/shared/gempolin-trend-chart";
import MetricCard from "@/components/shared/metric-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { CalendarIcon, FilterIcon, TaskIcon, TrashBinIcon } from "@/icons";
import type {
  GempolinBulananSummary,
  GempolinMockData,
} from "@/types/gempolin";
import { calculateDelta, formatNumber, formatWeightKg } from "@/utils";
import React, { useMemo, useState } from "react";
import { getDailyDataForMonth } from "./mock-data";

export interface GempolinClientProps {
  initialData: GempolinMockData;
}

export default function GempolinClient({ initialData }: GempolinClientProps) {
  const { getFilter, setFilters, resetFilters, isPending } =
    useDashboardFilters();

  const { riwayatBulanan, harian, perRt } = initialData;

  // State untuk modal dialog rincian harian per bulan
  const [detailBulan, setDetailBulan] = useState<GempolinBulananSummary | null>(
    null,
  );

  // State pilihan bulan khusus untuk grafik tren harian (terpisah mandiri)
  const [chartPeriode, setChartPeriode] = useState<string>(
    initialData.periode.periode,
  );

  // Baca pilihan periode aktif dan pembanding dari URL (Single Source of Truth)
  const defaultPeriode = initialData.periode.periode;
  const defaultBandingkan = initialData.periodeSebelumnya.periode;

  const selectedPeriode = getFilter("periode", defaultPeriode);
  const selectedBandingkan = getFilter("bandingkan", defaultBandingkan);

  // Ambil objek rekap bulanan yang sesuai dengan filter
  const currentBulanan = useMemo(() => {
    return (
      riwayatBulanan.find((b) => b.periode === selectedPeriode) ??
      riwayatBulanan[riwayatBulanan.length - 1] ??
      initialData.periode
    );
  }, [riwayatBulanan, selectedPeriode, initialData.periode]);

  const previousBulanan = useMemo(() => {
    return (
      riwayatBulanan.find((b) => b.periode === selectedBandingkan) ??
      initialData.periodeSebelumnya
    );
  }, [riwayatBulanan, selectedBandingkan, initialData.periodeSebelumnya]);

  // Kalkulasi tren delta antar-periode
  const requestTrend = useMemo(() => {
    return calculateDelta(
      currentBulanan.totalRequest,
      previousBulanan.totalRequest,
    );
  }, [currentBulanan.totalRequest, previousBulanan.totalRequest]);

  const tonaseTrend = useMemo(() => {
    return calculateDelta(
      currentBulanan.totalTerolah,
      previousBulanan.totalTerolah,
    );
  }, [currentBulanan.totalTerolah, previousBulanan.totalTerolah]);

  // Data harian khusus untuk grafik tren harian (independen)
  const chartHarian = useMemo(() => {
    return getDailyDataForMonth(chartPeriode, harian);
  }, [chartPeriode, harian]);

  const chartBulananLabel = useMemo(() => {
    return (
      riwayatBulanan.find((b) => b.periode === chartPeriode)?.label ??
      chartPeriode
    );
  }, [riwayatBulanan, chartPeriode]);

  // Data harian untuk bulan yang dibuka di modal dialog
  const detailDailyData = useMemo(() => {
    if (!detailBulan) return [];
    return getDailyDataForMonth(detailBulan.periode, harian);
  }, [detailBulan, harian]);

  const isFiltered =
    selectedPeriode !== defaultPeriode || selectedBandingkan !== defaultBandingkan;

  return (
    <div className="space-y-6">
      {/* Panel Filter Periode Bulanan & Pembanding */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <CalendarIcon className="size-4" />
            </span>
            <label
              htmlFor="filter-periode-select"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Bulan Utama:
            </label>
            <select
              id="filter-periode-select"
              value={selectedPeriode}
              onChange={(e) => setFilters({ periode: e.target.value })}
              disabled={isPending}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-800 transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {riwayatBulanan.map((b) => (
                <option key={b.periode} value={b.periode}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-bandingkan-select"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Bandingkan:
            </label>
            <select
              id="filter-bandingkan-select"
              value={selectedBandingkan}
              onChange={(e) => setFilters({ bandingkan: e.target.value })}
              disabled={isPending}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-800 transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {riwayatBulanan.map((b) => (
                <option key={b.periode} value={b.periode}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFiltered ? (
          <button
            type="button"
            onClick={() => resetFilters()}
            disabled={isPending}
            className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-gray-200 bg-transparent px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <FilterIcon className="size-3.5" />
            <span>Reset Periode</span>
          </button>
        ) : null}
      </div>

      {/* Baris 1: KPI Cards Dinamis Sesuai Bulan Terpilih */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <MetricCard
          title={`Total Permintaan (${currentBulanan.label})`}
          value={currentBulanan.totalRequest}
          unit="request"
          icon={
            <TaskIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: requestTrend.percentage,
            isPositive: requestTrend.absolute >= 0,
            comparisonLabel: `vs ${previousBulanan.label}`,
          }}
        />

        <MetricCard
          title={`Total Sampah Terolah (${currentBulanan.label})`}
          value={currentBulanan.totalTerolah}
          unit="kg"
          icon={
            <TrashBinIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: tonaseTrend.percentage,
            isPositive: tonaseTrend.absolute >= 0,
            comparisonLabel: `vs ${previousBulanan.label}`,
          }}
        />
      </div>

      {/* Baris 2: Kartu Komparasi Antar-Periode (FR-28) */}
      <ComponentCard
        title="Perbandingan Antar-Periode"
        desc="Komparasi langsung performa operasional antara bulan utama dan bulan pembanding yang dipilih"
      >
        <ComparisonCard
          currentLabel={currentBulanan.label}
          previousLabel={previousBulanan.label}
          currentValue={currentBulanan.totalTerolah}
          previousValue={previousBulanan.totalTerolah}
          unit="kg"
          currentRequest={currentBulanan.totalRequest}
          previousRequest={previousBulanan.totalRequest}
        />
      </ComponentCard>

      {/* Baris 4: Tren Harian Berat Terolah */}
      <ComponentCard
        title="Tren Harian Tonase Terolah"
        desc={`Distribusi harian berat sampah yang berhasil diolah pada periode ${chartBulananLabel} (WIB)`}
        headerAction={
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <CalendarIcon className="size-4" />
            </span>
            <select
              id="chart-periode-select"
              aria-label="Pilih Bulan Tren Harian"
              value={chartPeriode}
              onChange={(e) => setChartPeriode(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-800 transition-colors focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {riwayatBulanan.map((b) => (
                <option key={b.periode} value={b.periode}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <GempolinTrendChart data={chartHarian} />
      </ComponentCard>

      {/* Baris 5: Rekap per Wilayah RW & RT */}
      <ComponentCard
        title={`Rekapitulasi per Wilayah (RW & RT) - ${currentBulanan.label}`}
        desc="Rincian akumulasi permintaan dan tonase per RW dan RT dengan verifikasi lapangan"
      >
        <GempolinRtTable data={perRt} />
      </ComponentCard>

      {/* Baris 6: Riwayat Rekapitulasi Bulanan */}
      <ComponentCard
        title="Riwayat Rekapitulasi Bulanan"
        desc="Rangkuman kinerja operasional pengolahan sampah Gempolin per periode bulanan 1 tahun terakhir"
      >
        <GempolinMonthlyTable
          data={riwayatBulanan}
          activePeriode={selectedPeriode}
          onSelectDetail={(bulan) => setDetailBulan(bulan)}
        />
      </ComponentCard>

      {/* Modal Dialog Rincian Harian per Bulan */}
      <Dialog
        open={Boolean(detailBulan)}
        onOpenChange={(open) => {
          if (!open) setDetailBulan(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <CalendarIcon className="size-5 text-brand-600 dark:text-brand-400" />
              <span>Log Rincian Harian — {detailBulan?.label}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Catatan detail operasional penjemputan dan pengolahan sampah harian per wilayah RT.
            </DialogDescription>
          </DialogHeader>

          {detailBulan ? (
            <div className="space-y-4">
              {/* Ringkasan Cepat Bulan Terpilih */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                  <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Total Permintaan
                  </span>
                  <p className="mt-1 text-base font-bold text-gray-900 tabular-nums dark:text-white">
                    {formatNumber(detailBulan.totalRequest)} request
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                  <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Total Terolah
                  </span>
                  <p className="mt-1 text-base font-bold text-gray-900 tabular-nums dark:text-white">
                    {formatWeightKg(detailBulan.totalTerolah)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                  <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Berat Verifikasi
                  </span>
                  <p className="mt-1 text-base font-bold text-gray-900 tabular-nums dark:text-white">
                    {formatWeightKg(
                      detailBulan.totalVerifikasi ?? detailBulan.totalTerolah,
                    )}
                  </p>
                </div>
              </div>

              {/* Tabel Detail Harian */}
              <GempolinDailyTable data={detailDailyData} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
