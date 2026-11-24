"use client";

import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, InfoCircleIcon } from "@/icons";
import type { GempolinBulananSummary } from "@/types/gempolin";
import { formatNumber, formatWeightKg } from "@/utils";
import React, { useMemo, useState } from "react";

export interface GempolinMonthlyTableProps {
  data: GempolinBulananSummary[];
  activePeriode?: string;
  onSelectDetail: (item: GempolinBulananSummary) => void;
}

const ITEMS_PER_PAGE = 6;

function getSelisihBadgeClass(selisih: number): string {
  if (selisih > 0) {
    return "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
  }
  if (selisih < 0) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
}

export default function GempolinMonthlyTable({
  data,
  activePeriode,
  onSelectDetail,
}: GempolinMonthlyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Urutkan dari bulan terbaru ke terlama
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.periode.localeCompare(a.periode));
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, activePage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Riwayat operasional 1 tahun terakhir. Klik{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Detail Harian
          </span>{" "}
          untuk mengaudit catatan harian per wilayah RT.
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold text-gray-900 tabular-nums dark:text-white">
            {sortedData.length > 0
              ? `${(activePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  activePage * ITEMS_PER_PAGE,
                  sortedData.length,
                )}`
              : "0"}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-900 tabular-nums dark:text-white">
            {sortedData.length}
          </span>{" "}
          bulan
        </div>
      </div>

      {/* Tabel Konten */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-900/40">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 ps-5 pe-4 text-start text-xs font-semibold tracking-wider text-gray-500 uppercase sm:ps-6 dark:text-gray-400"
                >
                  Periode / Bulan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Total Permintaan
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Berat Terolah
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          className="inline-flex cursor-help items-center gap-1 font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <span>Berat Verifikasi</span>
                          <InfoCircleIcon className="size-3.5 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs whitespace-normal text-start text-xs leading-relaxed"
                        >
                          Berat setelah verifikasi lapangan. Berbeda dengan Berat
                          Terolah yang mencerminkan hasil olah aktual (BR-03).
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Selisih (Residu)
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 ps-4 pe-5 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase sm:pe-6 dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.map((row) => {
                const totalVerifikasi = row.totalVerifikasi ?? row.totalTerolah;
                const selisih = totalVerifikasi - row.totalTerolah;
                const isCurrentActive = row.periode === activePeriode;

                return (
                  <TableRow
                    key={row.periode}
                    className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="py-3.5 ps-5 pe-4 text-start text-sm font-semibold text-gray-900 sm:ps-6 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{row.label}</span>
                        {isCurrentActive ? (
                          <Badge color="success" size="sm" variant="light">
                            Aktif
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                      {formatNumber(row.totalRequest)} request
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-end text-sm font-bold text-gray-900 tabular-nums dark:text-white">
                      {formatWeightKg(row.totalTerolah)}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                      {formatWeightKg(totalVerifikasi)}
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-end">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${getSelisihBadgeClass(
                          selisih,
                        )}`}
                      >
                        {selisih > 0 ? `+${formatNumber(selisih)}` : `${formatNumber(selisih)}`} kg
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 ps-4 pe-5 text-center sm:pe-6">
                      <button
                        type="button"
                        onClick={() => onSelectDetail(row)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-950/40 dark:hover:text-brand-400"
                      >
                        <EyeIcon className="size-3.5" />
                        <span>Detail Harian</span>
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Navigasi Paginasi */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Halaman{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {activePage}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {totalPages}
            </span>
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Sebelumnya"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage <= 1}
                  className="cursor-pointer text-xs"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === activePage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer text-xs tabular-nums"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  text="Berikutnya"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage >= totalPages}
                  className="cursor-pointer text-xs"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
