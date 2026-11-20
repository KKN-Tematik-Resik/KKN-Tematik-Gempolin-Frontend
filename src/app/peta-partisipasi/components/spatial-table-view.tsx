"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MapIcon } from "@/icons";
import type { SpatialSummaryItem } from "@/types/spatial";
import { formatPercentage } from "@/utils/calculations";
import React, { useState } from "react";

export interface SpatialTableViewProps {
  items: SpatialSummaryItem[];
  onSelectRt?: (rt: string, rw: string) => void;
}

const PAGE_SIZE = 10;

function getClassBadge(pClass: number | null) {
  switch (pClass) {
    case 1:
      return (
        <Badge color="success" variant="light" size="sm">
          Sangat Tinggi
        </Badge>
      );
    case 2:
      return (
        <Badge color="success" variant="light" size="sm">
          Tinggi
        </Badge>
      );
    case 3:
      return (
        <Badge color="warning" variant="light" size="sm">
          Sedang
        </Badge>
      );
    case 4:
      return (
        <Badge color="warning" variant="light" size="sm">
          Rendah
        </Badge>
      );
    case 5:
      return (
        <Badge color="error" variant="light" size="sm">
          Sangat Rendah
        </Badge>
      );
    default:
      return (
        <Badge color="gray" variant="light" size="sm">
          Data tidak tersedia
        </Badge>
      );
  }
}

// Windowed compact pagination: selalu 5 slot (Prev · 1 · ... · N · Next)
// sehingga lebar kontrol tidak berubah berapa pun totalPages.
function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis-end", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis-start", currentPage, "ellipsis-end", totalPages];
}

export default function SpatialTableView({
  items,
  onSelectRt,
}: SpatialTableViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, items.length);

  const paginatedItems = items.slice(startIdx, endIdx);
  const pages = getPageNumbers(safePage, totalPages);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Tidak ada data RT yang cocok dengan kriteria pencarian atau filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Wilayah Administrasi
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Realisasi Partisipasi
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Total Terdata
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Persentase (%)
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Klasifikasi
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300"
              >
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedItems.map((item) => (
              <TableRow
                key={`${item.rw}-${item.rt}`}
                className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
              >
                {/* Hanya menampilkan agregat RT & RW */}
                <TableCell className="px-4 py-3.5 text-start font-medium text-gray-900 dark:text-white">
                  <span>{item.rt}</span>{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({item.rw})
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3.5 text-end font-mono tabular-nums text-gray-700 dark:text-gray-300">
                  {item.denominator > 0
                    ? item.numerator.toLocaleString("id-ID")
                    : "-"}
                </TableCell>

                <TableCell className="px-4 py-3.5 text-end font-mono tabular-nums text-gray-700 dark:text-gray-300">
                  {item.denominator > 0
                    ? item.denominator.toLocaleString("id-ID")
                    : "-"}
                </TableCell>

                <TableCell className="px-4 py-3.5 text-end font-mono font-bold tabular-nums text-gray-900 dark:text-white">
                  {formatPercentage(item.percentage)}
                </TableCell>

                <TableCell className="px-4 py-3.5 text-start">
                  {getClassBadge(item.participationClass)}
                </TableCell>

                <TableCell className="px-4 py-3.5 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => onSelectRt?.(item.rt, item.rw)}
                    className="gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    title={`Lihat detail ${item.rt} ${item.rw}`}
                  >
                    <MapIcon className="size-3.5" />
                    <span>Detail</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Navigasi Paginasi Terintegrasi */}
      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900/50">
        {/* Ringkasan Jumlah Data */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <strong className="font-semibold text-gray-800 tabular-nums dark:text-gray-200">
            {startIdx + 1}–{endIdx}
          </strong>{" "}
          dari{" "}
          <strong className="font-semibold text-gray-800 tabular-nums dark:text-gray-200">
            {items.length}
          </strong>{" "}
          wilayah RT
        </span>

        {/* Kontrol Paginasi (Hanya muncul jika lebih dari 1 halaman) */}
        {totalPages > 1 && (
          <div>
            {/* Tampilan Seluler (< sm) */}
            <div className="flex items-center justify-between sm:hidden">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Hal. {safePage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <PaginationPrevious
                  size="icon"
                  variant="outline"
                  disabled={safePage <= 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage > 1) setCurrentPage(safePage - 1);
                  }}
                />
                <PaginationNext
                  size="icon"
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage < totalPages) setCurrentPage(safePage + 1);
                  }}
                />
              </div>
            </div>

            {/* Tampilan Desktop (>= sm) */}
            <div className="hidden sm:block">
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      size="icon"
                      variant="outline"
                      disabled={safePage <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        if (safePage > 1) setCurrentPage(safePage - 1);
                      }}
                    />
                  </PaginationItem>

                  {pages.map((item) => {
                    if (item === "ellipsis-start" || item === "ellipsis-end") {
                      return (
                        <PaginationItem key={item}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    const page = item;
                    const isActive = safePage === page;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          size="icon"
                          variant="outline"
                          isActive={isActive}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      size="icon"
                      variant="outline"
                      disabled={safePage >= totalPages}
                      onClick={(e) => {
                        e.preventDefault();
                        if (safePage < totalPages) setCurrentPage(safePage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

