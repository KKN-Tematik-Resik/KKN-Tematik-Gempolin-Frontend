"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
  AlertIcon,
  CheckCircleIcon,
  MinusIcon,
  RegenerateIcon,
  SearchIcon,
} from "@/icons";
import type { RtMonitoringRow } from "@/types/admin-dashboard";

interface RtMonitoringSectionProps {
  initialData: RtMonitoringRow[];
}

const ITEMS_PER_PAGE = 10;

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
  if (current > 3) pages.push("ellipsis-start");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (current < total - 2) pages.push("ellipsis-end");
  pages.push(total);
  return pages;
}

export default function RtMonitoringSection({
  initialData,
}: RtMonitoringSectionProps) {
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");
  const [selectedRw, setSelectedRw] = useState<string>("all");
  const [selectedRt, setSelectedRt] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeNote, setActiveNote] = useState<{
    wilayah: string;
    text: string;
  } | null>(null);

  const rwOptions = useMemo(() => {
    return Array.from(new Set(initialData.map((d) => d.rw))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [initialData]);

  const rtOptions = useMemo(() => {
    const scoped =
      selectedRw === "all"
        ? initialData
        : initialData.filter((d) => d.rw === selectedRw);
    return Array.from(new Set(scoped.map((d) => d.rt))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [initialData, selectedRw]);

  const handleRwChange = (newRw: string) => {
    setSelectedRw(newRw);
    setSelectedRt("all");
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialData.filter((row) => {
      if (selectedPeriode !== "all" && row.periode !== selectedPeriode) {
        return false;
      }
      if (selectedRw !== "all" && row.rw !== selectedRw) return false;
      if (selectedRt !== "all" && row.rt !== selectedRt) return false;

      if (
        selectedSource === "gempolin" &&
        (row.gempolinRequests === null || row.gempolinRequests === 0)
      ) {
        return false;
      }
      if (
        selectedSource === "demografi" &&
        (row.totalRumah === null || row.totalRumah === 0)
      ) {
        return false;
      }

      if (
        selectedQuality !== "all" &&
        row.statusKualitas !== selectedQuality
      ) {
        return false;
      }

      if (query !== "") {
        const wilayah = `${row.rw} ${row.rt}`.toLowerCase();
        const matchesCatatan = row.catatanAnomali
          ? row.catatanAnomali.toLowerCase().includes(query)
          : false;
        if (!wilayah.includes(query) && !matchesCatatan) return false;
      }

      return true;
    });
  }, [
    initialData,
    selectedPeriode,
    selectedRw,
    selectedRt,
    selectedSource,
    selectedQuality,
    searchQuery,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, activePage]);

  const hasActiveFilters =
    selectedPeriode !== "all" ||
    selectedRw !== "all" ||
    selectedRt !== "all" ||
    selectedSource !== "all" ||
    selectedQuality !== "all" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedPeriode("all");
    setSelectedRw("all");
    setSelectedRt("all");
    setSelectedSource("all");
    setSelectedQuality("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const renderQualityBadge = (status: RtMonitoringRow["statusKualitas"]) => {
    switch (status) {
      case "lengkap":
        return (
          <Badge variant="light" color="success" size="sm">
            <CheckCircleIcon className="size-3" />
            Lengkap
          </Badge>
        );
      case "ditandai":
        return (
          <Badge variant="light" color="warning" size="sm">
            <AlertIcon className="size-3" />
            Ditandai
          </Badge>
        );
      case "kosong":
        return (
          <Badge variant="light" color="gray" size="sm">
            <MinusIcon className="size-3" />
            Kosong
          </Badge>
        );
    }
  };

  const startItem =
    filteredData.length > 0 ? (activePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(activePage * ITEMS_PER_PAGE, filteredData.length);
  const pageNumbers = getPageNumbers(activePage, totalPages);

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Tabel */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Pemantauan Data Wilayah (RW & RT)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Daftar rincian data demografi partisipasi warga dan operasional
          pengolahan Gempolin di tingkat RW/RT.
        </p>
      </div>

      {/* Filter Bar 2 Baris Rapi: Pencarian + Reset, lalu 5 Dimensi Filter Sejajar */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800/80 dark:bg-white/[0.02]">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari wilayah RW/RT atau keterangan catatan..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 ps-8 pe-3 text-xs text-gray-800 placeholder-gray-400 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <SearchIcon className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="xs"
            disabled={!hasActiveFilters}
            onClick={handleResetFilters}
            className="gap-1.5 text-xs"
          >
            <RegenerateIcon className="size-3.5" />
            <span>Reset Filter</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label
              htmlFor="filter-periode"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Periode
            </label>
            <select
              id="filter-periode"
              value={selectedPeriode}
              onChange={(e) => {
                setSelectedPeriode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Periode</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-10">Oktober 2026</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-rw"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Wilayah RW
            </label>
            <select
              id="filter-rw"
              value={selectedRw}
              onChange={(e) => handleRwChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua RW</option>
              {rwOptions.map((rw) => (
                <option key={rw} value={rw}>
                  {rw}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-rt"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Wilayah RT
            </label>
            <select
              id="filter-rt"
              value={selectedRt}
              onChange={(e) => {
                setSelectedRt(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua RT</option>
              {rtOptions.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-source"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Sumber Data
            </label>
            <select
              id="filter-source"
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Sumber Data</option>
              <option value="demografi">Demografi & Partisipasi</option>
              <option value="gempolin">Layanan Gempolin</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-quality"
              className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Status Kualitas
            </label>
            <select
              id="filter-quality"
              value={selectedQuality}
              onChange={(e) => {
                setSelectedQuality(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 transition outline-none hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="lengkap">Lengkap (Valid)</option>
              <option value="ditandai">Ditandai (Anomali)</option>
              <option value="kosong">Kosong (Belum Ada Data)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Data 9 Kolom Rapi */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <Table className="text-start text-xs">
          <TableHeader className="border-b border-gray-200 bg-gray-50/90 font-semibold text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
            <TableRow>
              <TableCell isHeader className="w-12 py-3 ps-4 pe-2 text-center">
                No
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-start">
                RW
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-start">
                RT
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-end">
                Rumah
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-end">
                KK
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-end">
                Memilah
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-end">
                Mengolah
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-end">
                Gempolin (Terolah)
              </TableCell>
              <TableCell isHeader className="px-3 py-3 text-center">
                Status
              </TableCell>
              <TableCell isHeader className="py-3 ps-3 pe-4 text-center">
                Catatan
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const rowNumber = (activePage - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <TableRow
                    key={row.id}
                    className="transition hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="py-3 ps-4 pe-2 text-center text-gray-500 tabular-nums dark:text-gray-400">
                      {rowNumber}
                    </TableCell>

                    <TableCell className="px-3 py-3 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                      {row.rw}
                    </TableCell>

                    <TableCell className="px-3 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      {row.rt}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-end text-gray-700 tabular-nums dark:text-gray-300">
                      {row.totalRumah !== null && row.totalRumah > 0
                        ? row.totalRumah.toLocaleString("id-ID")
                        : "—"}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-end text-gray-700 tabular-nums dark:text-gray-300">
                      {row.totalKk !== null && row.totalKk > 0
                        ? row.totalKk.toLocaleString("id-ID")
                        : "—"}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-end">
                      {row.partisipasiMemilahPct !== null ? (
                        <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                          {row.partisipasiMemilahPct.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge variant="light" color="gray" size="sm">
                          Data tidak tersedia
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-end">
                      {row.partisipasiMengolahPct !== null ? (
                        <span className="font-semibold text-brand-600 tabular-nums dark:text-brand-400">
                          {row.partisipasiMengolahPct.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge variant="light" color="gray" size="sm">
                          Data tidak tersedia
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-end whitespace-nowrap text-gray-700 tabular-nums dark:text-gray-300">
                      {row.gempolinProcessedKg !== null &&
                      row.gempolinProcessedKg > 0 ? (
                        <span>
                          {row.gempolinProcessedKg.toLocaleString("id-ID")}{" "}
                          <span className="text-[11px] text-gray-500">kg</span>
                          <span className="ms-1 text-[11px] text-gray-400">
                            ({row.gempolinRequests} req)
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell className="px-3 py-3 text-center">
                      {renderQualityBadge(row.statusKualitas)}
                    </TableCell>

                    <TableCell className="py-3 ps-3 pe-4 text-center">
                      {row.catatanAnomali ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveNote({
                              wilayah: `${row.rw} · ${row.rt}`,
                              text: row.catatanAnomali ?? "",
                            })
                          }
                          title={row.catatanAnomali}
                          className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 transition hover:bg-amber-100 hover:text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                        >
                          Lihat Catatan
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">
                      Tidak ada data RT yang sesuai dengan kombinasi filter yang
                      dipilih.
                    </p>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={handleResetFilters}
                      className="mt-1"
                    >
                      Kembalikan Semua Filter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Paginasi Terpadu Dual-Mode */}
      <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
        <p className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {startItem}–{endItem}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {filteredData.length}
          </span>{" "}
          data RT
        </p>

        {totalPages > 1 ? (
          <>
            {/* Mobile Compact Stepper */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={activePage <= 1}
                onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
              >
                Sebelumnya
              </Button>
              <span className="text-xs font-medium text-gray-700 tabular-nums dark:text-gray-300">
                Hal. {activePage} dari {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={activePage >= totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, activePage + 1))
                }
              >
                Berikutnya
              </Button>
            </div>

            {/* Desktop Full Pagination */}
            <Pagination className="mx-0 hidden w-auto justify-end sm:flex">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="Sebelumnya"
                    onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                    disabled={activePage <= 1}
                    className="cursor-pointer text-xs"
                  />
                </PaginationItem>

                {pageNumbers.map((page) =>
                  typeof page === "string" ? (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === activePage}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer text-xs tabular-nums"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    text="Berikutnya"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, activePage + 1))
                    }
                    disabled={activePage >= totalPages}
                    className="cursor-pointer text-xs"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : null}
      </div>

      {/* Dialog Catatan Verifikasi */}
      <Dialog
        open={activeNote !== null}
        onOpenChange={(open) => {
          if (!open) setActiveNote(null);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <AlertIcon className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Catatan Verifikasi {activeNote?.wilayah}</span>
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {activeNote?.text}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setActiveNote(null)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
