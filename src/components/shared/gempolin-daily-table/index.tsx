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
import { BoxIcon, FilterIcon, InfoCircleIcon, SearchIcon } from "@/icons";
import type { GempolinHarian } from "@/types/gempolin";
import { formatNumber, formatWeightKg, formatWibDate } from "@/utils";
import React, { useMemo, useState } from "react";

export interface GempolinDailyTableProps {
  data: GempolinHarian[];
}

const ITEMS_PER_PAGE = 10;

export default function GempolinDailyTable({ data }: GempolinDailyTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRt, setSelectedRt] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Daftar RT unik untuk opsi filter
  const rtOptions = useMemo(() => {
    const rts = Array.from(new Set(data.map((item) => item.rtNama))).sort();
    return rts;
  }, [data]);

  // Urutkan dan filter data
  const filteredData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
      .filter((row) => {
        const matchesRt =
          selectedRt === "all" || row.rtNama === selectedRt;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          row.tanggal.toLowerCase().includes(query) ||
          row.rtNama.toLowerCase().includes(query) ||
          formatWibDate(row.tanggal).toLowerCase().includes(query);

        return matchesRt && matchesSearch;
      });
  }, [data, selectedRt, searchQuery]);

  // Reset page saat filter berubah
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, activePage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Input Pencarian */}
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
              <SearchIcon className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Cari tanggal atau RT..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white ps-9 pe-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Filter RT */}
          <div className="relative w-full sm:w-44">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
              <FilterIcon className="size-4" />
            </span>
            <select
              aria-label="Filter Wilayah RT"
              value={selectedRt}
              onChange={(e) => {
                setSelectedRt(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white ps-9 pe-8 text-sm text-gray-900 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua RT</option>
              {rtOptions.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold text-gray-900 tabular-nums dark:text-white">
            {filteredData.length > 0
              ? `${(activePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  activePage * ITEMS_PER_PAGE,
                  filteredData.length,
                )}`
              : "0"}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-900 tabular-nums dark:text-white">
            {filteredData.length}
          </span>{" "}
          catatan
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
                  Tanggal (WIB)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Wilayah RT
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Request
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
                  className="py-3 ps-4 pe-5 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase sm:pe-6 dark:text-gray-400"
                >
                  Selisih
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const selisih = row.beratVerifikasi - row.beratTerolah;

                  return (
                    <TableRow
                      key={`${row.tanggal}-${row.rtId}`}
                      className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="py-3.5 ps-5 pe-4 text-start text-sm font-medium text-gray-900 tabular-nums sm:ps-6 dark:text-white">
                        {formatWibDate(row.tanggal)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-start text-sm text-gray-700 dark:text-gray-300">
                        <Badge color="light" size="sm" variant="light">
                          {row.rtNama}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                        {formatNumber(row.requestCount)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm font-semibold text-gray-900 tabular-nums dark:text-white">
                        {formatWeightKg(row.beratTerolah)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                        {formatWeightKg(row.beratVerifikasi)}
                      </TableCell>
                      <TableCell className="py-3.5 ps-4 pe-5 text-end text-sm font-medium tabular-nums sm:pe-6">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                            selisih > 0
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                              : selisih < 0
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {selisih > 0 ? `+${selisih}` : `${selisih}`} kg
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <BoxIcon className="size-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Tidak ada catatan ditemukan
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Coba sesuaikan kata kunci pencarian atau filter RT Anda.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
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
