"use client";

import { Badge } from "@/components/ui/badge";
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
import { ChevronDownIcon, ChevronRightIcon, InfoCircleIcon } from "@/icons";
import type { GempolinRtSummary } from "@/types/gempolin";
import { formatNumber, formatWeightKg } from "@/utils";
import React, { useMemo, useState } from "react";

export interface GempolinRtTableProps {
  data: GempolinRtSummary[];
}

interface GempolinRwGroup {
  rwId: string;
  rwNama: string;
  totalRequest: number;
  totalTerolah: number;
  totalVerifikasi: number;
  daftarRt: GempolinRtSummary[];
}

function getSelisihBadgeClass(selisih: number, isTotal = false): string {
  if (selisih > 0) {
    return isTotal
      ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
      : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
  }
  if (selisih < 0) {
    return isTotal
      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
      : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
  }
  return isTotal
    ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
}

export default function GempolinRtTable({ data }: GempolinRtTableProps) {
  const groupedByRw = useMemo<GempolinRwGroup[]>(() => {
    const map = new Map<string, GempolinRwGroup>();
    for (const row of data) {
      const group = map.get(row.rwId);
      if (group) {
        group.totalRequest += row.totalRequest;
        group.totalTerolah += row.totalTerolah;
        group.totalVerifikasi += row.totalVerifikasi;
        group.daftarRt.push(row);
      } else {
        map.set(row.rwId, {
          rwId: row.rwId,
          rwNama: row.rwNama,
          totalRequest: row.totalRequest,
          totalTerolah: row.totalTerolah,
          totalVerifikasi: row.totalVerifikasi,
          daftarRt: [row],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.rwId.localeCompare(b.rwId),
    );
  }, [data]);

  const [expandedRws, setExpandedRws] = useState<Set<string>>(
    () => new Set(groupedByRw.slice(0, 1).map((rw) => rw.rwId)),
  );

  const toggleRw = (rwId: string) => {
    setExpandedRws((prev) => {
      const next = new Set(prev);
      if (next.has(rwId)) {
        next.delete(rwId);
      } else {
        next.add(rwId);
      }
      return next;
    });
  };

  const allExpanded =
    groupedByRw.length > 0 && expandedRws.size === groupedByRw.length;

  const toggleExpandAll = () => {
    setExpandedRws(
      allExpanded ? new Set() : new Set(groupedByRw.map((rw) => rw.rwId)),
    );
  };

  // Hitung agregasi total tingkat kelurahan
  const totals = useMemo(() => {
    return data.reduce(
      (acc, curr) => ({
        totalRequest: acc.totalRequest + curr.totalRequest,
        totalTerolah: acc.totalTerolah + curr.totalTerolah,
        totalVerifikasi: acc.totalVerifikasi + curr.totalVerifikasi,
      }),
      { totalRequest: 0, totalTerolah: 0, totalVerifikasi: 0 },
    );
  }, [data]);

  const totalSelisih = totals.totalVerifikasi - totals.totalTerolah;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="tabular-nums">
          Cakupan: {groupedByRw.length} RW · {data.length} RT terdata
        </span>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {allExpanded ? "Tutup Semua RT" : "Buka Semua RT"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-900/40">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 ps-5 pe-4 text-start text-xs font-semibold tracking-wider text-gray-500 uppercase sm:ps-6 dark:text-gray-400"
                >
                  Wilayah (RW / RT)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Total Request
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
                          Berat setelah verifikasi lapangan. Berbeda dengan
                          Berat Terolah yang mencerminkan hasil olah aktual.
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
              {groupedByRw.map((rw) => {
                const isExpanded = expandedRws.has(rw.rwId);
                const rwSelisih = rw.totalVerifikasi - rw.totalTerolah;

                return (
                  <React.Fragment key={rw.rwId}>
                    {/* Baris Induk RW */}
                    <TableRow
                      onClick={() => toggleRw(rw.rwId)}
                      className="cursor-pointer bg-gray-50/50 transition-colors hover:bg-gray-100/70 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                    >
                      <TableCell className="py-3.5 ps-5 pe-4 text-start text-sm font-semibold text-gray-900 sm:ps-6 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 dark:text-gray-500">
                            {isExpanded ? (
                              <ChevronDownIcon className="size-4" />
                            ) : (
                              <ChevronRightIcon className="size-4" />
                            )}
                          </span>
                          <span>{rw.rwNama}</span>
                          <span className="text-xs font-normal text-gray-400 tabular-nums dark:text-gray-500">
                            ({rw.daftarRt.length} RT)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm font-semibold text-gray-800 tabular-nums dark:text-gray-200">
                        {formatNumber(rw.totalRequest)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm font-semibold text-gray-900 tabular-nums dark:text-white">
                        {formatWeightKg(rw.totalTerolah)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-end text-sm font-semibold text-gray-800 tabular-nums dark:text-gray-200">
                        {formatWeightKg(rw.totalVerifikasi)}
                      </TableCell>
                      <TableCell className="py-3.5 ps-4 pe-5 text-end text-sm font-semibold tabular-nums sm:pe-6">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${getSelisihBadgeClass(rwSelisih)}`}
                        >
                          {rwSelisih > 0 ? `+${rwSelisih}` : `${rwSelisih}`} kg
                        </span>
                      </TableCell>
                    </TableRow>

                    {/* Baris Anak RT */}
                    {isExpanded
                      ? rw.daftarRt.map((row) => {
                          const selisih =
                            row.totalVerifikasi - row.totalTerolah;
                          const hasData = row.totalTerolah > 0;

                          return (
                            <TableRow
                              key={row.rtId}
                              className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                            >
                              <TableCell className="py-3 ps-11 pe-4 text-start text-sm font-medium text-gray-700 sm:ps-12 dark:text-gray-300">
                                {row.rtNama}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                                {formatNumber(row.totalRequest)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-end text-sm font-medium text-gray-900 tabular-nums dark:text-white">
                                {hasData ? (
                                  formatWeightKg(row.totalTerolah)
                                ) : (
                                  <Badge color="warning" size="sm">
                                    Data tidak tersedia
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                                {formatWeightKg(row.totalVerifikasi)}
                              </TableCell>
                              <TableCell className="py-3 ps-4 pe-5 text-end text-sm font-medium tabular-nums sm:pe-6">
                                <span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${getSelisihBadgeClass(selisih)}`}
                                >
                                  {selisih > 0 ? `+${selisih}` : `${selisih}`}{" "}
                                  kg
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : null}
                  </React.Fragment>
                );
              })}

              {/* Baris Total / Agregasi Kelurahan */}
              <TableRow className="border-t-2 border-gray-200 bg-gray-50/80 font-semibold dark:border-gray-700 dark:bg-white/[0.04]">
                <TableCell className="py-3.5 ps-5 pe-4 text-start text-sm font-bold text-gray-900 sm:ps-6 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span>Total Kelurahan</span>
                    <Badge color="primary" size="sm" variant="light">
                      Agregat
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-end text-sm font-bold text-gray-900 tabular-nums dark:text-white">
                  {formatNumber(totals.totalRequest)}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-end text-sm font-bold text-brand-700 tabular-nums dark:text-brand-400">
                  {formatWeightKg(totals.totalTerolah)}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-end text-sm font-bold text-gray-900 tabular-nums dark:text-white">
                  {formatWeightKg(totals.totalVerifikasi)}
                </TableCell>
                <TableCell className="py-3.5 ps-4 pe-5 text-end text-sm font-bold tabular-nums sm:pe-6">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${getSelisihBadgeClass(totalSelisih, true)}`}
                  >
                    {totalSelisih > 0 ? `+${totalSelisih}` : `${totalSelisih}`}{" "}
                    kg
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
