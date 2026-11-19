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
import { InfoCircleIcon } from "@/icons";
import type { GempolinRtSummary } from "@/types/gempolin";
import { formatNumber, formatWeightKg } from "@/utils";
import React, { useMemo } from "react";

export interface GempolinRtTableProps {
  data: GempolinRtSummary[];
}

export default function GempolinRtTable({ data }: GempolinRtTableProps) {
  // Hitung agregasi total tingkat kelurahan (BR-06)
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-900/40">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 ps-5 pe-4 text-start text-xs font-semibold tracking-wider text-gray-500 uppercase sm:ps-6 dark:text-gray-400"
              >
                Wilayah RT
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
            {data.map((row) => {
              const selisih = row.totalVerifikasi - row.totalTerolah;
              const hasData = row.totalTerolah > 0;

              return (
                <TableRow
                  key={row.rtId}
                  className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="py-3.5 ps-5 pe-4 text-start text-sm font-medium text-gray-900 sm:ps-6 dark:text-white">
                    {row.rtNama}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                    {formatNumber(row.totalRequest)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-end text-sm font-medium text-gray-900 tabular-nums dark:text-white">
                    {hasData ? (
                      formatWeightKg(row.totalTerolah)
                    ) : (
                      <Badge color="warning" size="sm">
                        Data tidak tersedia
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-end text-sm text-gray-700 tabular-nums dark:text-gray-300">
                    {formatWeightKg(row.totalVerifikasi)}
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
            })}

            {/* Baris Total / Agregasi Kelurahan (BR-06) */}
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
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${
                    totalSelisih > 0
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
                      : totalSelisih < 0
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {totalSelisih > 0 ? `+${totalSelisih}` : `${totalSelisih}`} kg
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
