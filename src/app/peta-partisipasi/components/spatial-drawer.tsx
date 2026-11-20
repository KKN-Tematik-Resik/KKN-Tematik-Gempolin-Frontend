"use client";

import { useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon, CheckCircleIcon } from "@/icons";
import {
  formatPercentage,
  getParticipationColor,
} from "@/utils/calculations";
import { getRtFullReport } from "@/data/mock/spatial-participation";
import { useTheme } from "@/context/theme-context";
import type { ParticipationClass } from "@/types/spatial";

export interface SpatialDrawerProps {
  rt: string | null;
  rw: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function getBadgeVariant(
  pClass: ParticipationClass,
): "success" | "warning" | "error" | "gray" {
  if (pClass === 1 || pClass === 2) return "success";
  if (pClass === 3 || pClass === 4) return "warning";
  if (pClass === 5) return "error";
  return "gray";
}

export default function SpatialDrawer({
  rt,
  rw,
  isOpen,
  onClose,
}: SpatialDrawerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ambil profil lengkap RT secara reaktif
  const report = useMemo(() => {
    if (!rt || !rw) return null;
    return getRtFullReport(rt, rw);
  }, [rt, rw]);

  // Kunci scroll halaman belakang dan tangani tombol Escape
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !report) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spatial-drawer-title"
    >
      {/* Backdrop semi-transparan */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel Slide-over Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-s border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900">
        {/* Header Drawer */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6 dark:border-gray-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Rapor Partisipasi RT
            </span>
            <h2
              id="spatial-drawer-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white"
            >
              {report.rt} / {report.rw}
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Kelurahan Gempolsari, Kec. Bandung Kulon
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Tutup panel rapor RT"
            className="rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        {/* Konten Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 sm:p-6">
          {/* Bagian 1: Demografi Wilayah RT (3 Kartu) */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Demografi Wilayah
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Rumah
                </span>
                <span className="mt-1 font-mono text-lg font-extrabold text-gray-900 tabular-nums sm:text-xl dark:text-white">
                  {report.demographics.totalRumah.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  KK (Keluarga)
                </span>
                <span className="mt-1 font-mono text-lg font-extrabold text-gray-900 tabular-nums sm:text-xl dark:text-white">
                  {report.demographics.totalKk.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Jiwa (Warga)
                </span>
                <span className="mt-1 font-mono text-lg font-extrabold text-gray-900 tabular-nums sm:text-xl dark:text-white">
                  {report.demographics.totalWarga.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Bagian 2: 6 Indikator Pengelolaan Sampah */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Capaian 6 Indikator Partisipasi
              </h3>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                Pilah & Olah Sampah
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {report.indicators.map((ind) => {
                const colorHex = getParticipationColor(
                  ind.participationClass,
                  isDark,
                );
                const unitLabel =
                  ind.objectType === "rumah"
                    ? "Rumah"
                    : ind.objectType === "kk"
                      ? "KK"
                      : "Jiwa";

                return (
                  <div
                    key={ind.key}
                    className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
                  >
                    {/* Header Baris Indikator */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {ind.label}
                      </span>
                      <Badge
                        color={getBadgeVariant(ind.participationClass)}
                        variant="light"
                        size="sm"
                      >
                        <span
                          className="me-1 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: colorHex }}
                          aria-hidden="true"
                        />
                        {ind.statusLabel}
                      </Badge>
                    </div>

                    {/* Persentase dan Rasio Riil */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-mono text-lg font-extrabold text-gray-900 tabular-nums sm:text-xl dark:text-white">
                        {formatPercentage(ind.percentage)}
                      </span>
                      <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
                        {ind.denominator > 0 ? (
                          <>
                            <strong className="text-gray-800 dark:text-gray-200">
                              {ind.numerator.toLocaleString("id-ID")}
                            </strong>{" "}
                            dari {ind.denominator.toLocaleString("id-ID")}{" "}
                            {unitLabel}
                          </>
                        ) : (
                          "Belum ada data warga terdaftar"
                        )}
                      </span>
                    </div>

                    {/* Progress Bar Visual */}
                    <div
                      className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                      role="progressbar"
                      aria-valuenow={ind.percentage ?? 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(ind.percentage ?? 0, 100)}%`,
                          backgroundColor: colorHex,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bagian 3: Disclaimer Kepatuhan Privasi Warga */}
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
            <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">Privasi Warga Terlindungi </p>
              <p className="mt-0.5 text-emerald-800/90 leading-relaxed dark:text-emerald-300/90">
                Seluruh data profil di atas disajikan murni secara agregat pada
                tingkat rukun tetangga (RT). Sistem tidak menampilkan nama warga,
                nomor rumah, maupun alamat pribadi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="border-t border-gray-100 p-5 sm:p-6 dark:border-gray-800">
          <div className="mb-3 text-start text-[11px] text-gray-400 dark:text-gray-500">
            *Data diperbarui secara periodik • Waktu Indonesia Barat (WIB)
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full justify-center"
          >
            Tutup Rapor RT
          </Button>
        </div>
      </div>
    </div>
  );
}
