"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ChevronRightIcon } from "@/icons";
import type { DemografiRwData, ObjekType } from "@/types/demografi";
import {
  aggregateDemografiMetrics,
  calculateParticipationRate,
  formatNumber,
} from "@/utils";
import React, { useMemo, useState } from "react";

export interface DemografiHierarchyTableProps {
  dataRw: DemografiRwData[];
  activeObjek: ObjekType;
  selectedRwFilter?: string;
}

const OBJEK_HEADER_LABELS: Record<
  ObjekType,
  { terdata: string; memilah: string; mengolah: string; unit: string }
> = {
  rumah: {
    terdata: "Rumah Terdata",
    memilah: "Rumah Memilah",
    mengolah: "Rumah Mengolah",
    unit: "Rumah",
  },
  kk: {
    terdata: "KK Terdata",
    memilah: "KK Memilah",
    mengolah: "KK Mengolah",
    unit: "KK",
  },
  warga: {
    terdata: "Warga Terdata",
    memilah: "Warga Memilah",
    mengolah: "Warga Mengolah",
    unit: "Jiwa",
  },
};

export default function DemografiHierarchyTable({
  dataRw,
  activeObjek,
  selectedRwFilter = "all",
}: DemografiHierarchyTableProps) {
  // Saring data berdasarkan filter RW jika aktif
  const filteredDataRw = useMemo(() => {
    if (!selectedRwFilter || selectedRwFilter === "all") {
      return dataRw;
    }
    return dataRw.filter(
      (rw) =>
        rw.kodeRw.toLowerCase().replace(/\s+/g, "") ===
        selectedRwFilter.toLowerCase().replace(/\s+/g, ""),
    );
  }, [dataRw, selectedRwFilter]);

  // State untuk menyimpan daftar kodeRw yang sedang di-expand (default: semua terbuka)
  const [expandedRws, setExpandedRws] = useState<Set<string>>(() => {
    return new Set(dataRw.map((rw) => rw.kodeRw));
  });

  const toggleExpand = (kodeRw: string) => {
    setExpandedRws((prev) => {
      const next = new Set(prev);
      if (next.has(kodeRw)) {
        next.delete(kodeRw);
      } else {
        next.add(kodeRw);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (expandedRws.size === filteredDataRw.length) {
      setExpandedRws(new Set());
    } else {
      setExpandedRws(new Set(filteredDataRw.map((rw) => rw.kodeRw)));
    }
  };

  // Kalkulasi total agregat kelurahan (sum pembilang / sum penyebut)
  const kelurahanAggregate = useMemo(() => {
    const allMetrics = filteredDataRw.map((rw) => rw[activeObjek]);
    const summary = aggregateDemografiMetrics(allMetrics);
    const rateMemilah = calculateParticipationRate(summary.memilah, summary.terdata);
    const rateMengolah = calculateParticipationRate(summary.mengolah, summary.terdata);

    return {
      metrics: summary,
      rateMemilah,
      rateMengolah,
      totalRt: filteredDataRw.reduce((acc, rw) => acc + rw.daftarRt.length, 0),
    };
  }, [filteredDataRw, activeObjek]);

  const headerConfig = OBJEK_HEADER_LABELS[activeObjek];
  const allExpanded =
    filteredDataRw.length > 0 && expandedRws.size === filteredDataRw.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Bar Tabel */}
      <div className="flex flex-col gap-2 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Hierarki Capaian Partisipasi Wilayah (RW & RT)
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Kalkulasi tingkat RW murni dari akumulasi pembilang dan penyebut RT
            di bawahnya.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {allExpanded ? "Tutup Semua RT" : "Buka Semua RT"}
        </button>
      </div>

      {/* Tabel Data Hierarkis */}
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
                {headerConfig.terdata}
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                {headerConfig.memilah}
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                {headerConfig.mengolah}
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                % Memilah
              </TableCell>
              <TableCell
                isHeader
                className="py-3 ps-4 pe-5 text-end text-xs font-semibold tracking-wider text-gray-500 uppercase sm:pe-6 dark:text-gray-400"
              >
                % Mengolah
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {filteredDataRw.map((rw) => {
              const isExpanded = expandedRws.has(rw.kodeRw);
              const rwMetrics = rw[activeObjek];
              const rwRateMemilah = calculateParticipationRate(
                rwMetrics.memilah,
                rwMetrics.terdata,
              );
              const rwRateMengolah = calculateParticipationRate(
                rwMetrics.mengolah,
                rwMetrics.terdata,
              );

              return (
                <React.Fragment key={rw.id}>
                  {/* Baris Tingkat RW (Agregat) */}
                  <TableRow
                    onClick={() => toggleExpand(rw.kodeRw)}
                    className="cursor-pointer bg-gray-50/40 font-semibold transition-colors hover:bg-gray-100/70 dark:bg-gray-800/30 dark:hover:bg-gray-800/60"
                  >
                    <TableCell className="py-3.5 ps-5 pe-4 sm:ps-6">
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded text-gray-500 dark:text-gray-400">
                          {isExpanded ? (
                            <ChevronDownIcon className="size-4" />
                          ) : (
                            <ChevronRightIcon className="size-4" />
                          )}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {rw.namaRw}
                        </span>
                        <span className="ms-1 rounded-full bg-gray-200/80 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {rw.daftarRt.length} RT
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-end font-semibold text-gray-900 tabular-nums dark:text-white">
                      {formatNumber(rwMetrics.terdata)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-end font-semibold text-gray-900 tabular-nums dark:text-white">
                      {formatNumber(rwMetrics.memilah)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-end font-semibold text-gray-900 tabular-nums dark:text-white">
                      {formatNumber(rwMetrics.mengolah)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-end font-semibold tabular-nums">
                      {rwRateMemilah !== null ? (
                        <span className="text-brand-600 dark:text-brand-400">
                          {rwRateMemilah.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge color="gray" variant="light">
                          Data tidak tersedia
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 ps-4 pe-5 text-end font-semibold tabular-nums sm:pe-6">
                      {rwRateMengolah !== null ? (
                        <span className="text-brand-600 dark:text-brand-400">
                          {rwRateMengolah.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge color="gray" variant="light">
                          Data tidak tersedia
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Baris-baris Tingkat RT di Bawah RW Terkait (Hierarkis) */}
                  {isExpanded
                    ? rw.daftarRt.map((rt) => {
                        const rtMetrics = rt[activeObjek];
                        const rtRateMemilah = calculateParticipationRate(
                          rtMetrics.memilah,
                          rtMetrics.terdata,
                        );
                        const rtRateMengolah = calculateParticipationRate(
                          rtMetrics.mengolah,
                          rtMetrics.terdata,
                        );

                        return (
                          <TableRow
                            key={rt.id}
                            className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                          >
                            <TableCell className="py-2.5 ps-11 pe-4 sm:ps-12">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 dark:text-gray-600">
                                  └─
                                </span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {rt.namaRt}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-end text-xs text-gray-600 tabular-nums dark:text-gray-400">
                              {formatNumber(rtMetrics.terdata)}
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-end text-xs text-gray-600 tabular-nums dark:text-gray-400">
                              {formatNumber(rtMetrics.memilah)}
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-end text-xs text-gray-600 tabular-nums dark:text-gray-400">
                              {formatNumber(rtMetrics.mengolah)}
                            </TableCell>
                            <TableCell className="px-4 py-2.5 text-end text-xs tabular-nums">
                              {rtRateMemilah !== null ? (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {rtRateMemilah.toFixed(1)}%
                                </span>
                              ) : (
                                <Badge color="gray" variant="light" size="sm">
                                  Data tidak tersedia
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-2.5 ps-4 pe-5 text-end text-xs tabular-nums sm:pe-6">
                              {rtRateMengolah !== null ? (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {rtRateMengolah.toFixed(1)}%
                                </span>
                              ) : (
                                <Badge color="gray" variant="light" size="sm">
                                  Data tidak tersedia
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </React.Fragment>
              );
            })}

            {/* Baris Total Ringkasan Kelurahan */}
            <TableRow className="border-t-2 border-gray-200 bg-gray-100/70 font-bold dark:border-gray-700 dark:bg-gray-800/80">
              <TableCell className="py-4 ps-5 pe-4 text-gray-900 sm:ps-6 dark:text-white">
                <span>Total Agregat Kelurahan Gempolsari</span>
              </TableCell>
              <TableCell className="px-4 py-4 text-end text-gray-900 tabular-nums dark:text-white">
                {formatNumber(kelurahanAggregate.metrics.terdata)}
              </TableCell>
              <TableCell className="px-4 py-4 text-end text-gray-900 tabular-nums dark:text-white">
                {formatNumber(kelurahanAggregate.metrics.memilah)}
              </TableCell>
              <TableCell className="px-4 py-4 text-end text-gray-900 tabular-nums dark:text-white">
                {formatNumber(kelurahanAggregate.metrics.mengolah)}
              </TableCell>
              <TableCell className="px-4 py-4 text-end text-brand-600 tabular-nums dark:text-brand-400">
                {kelurahanAggregate.rateMemilah !== null
                  ? `${kelurahanAggregate.rateMemilah.toFixed(1)}%`
                  : "Data tidak tersedia"}
              </TableCell>
              <TableCell className="py-4 ps-4 pe-5 text-end text-brand-600 tabular-nums sm:pe-6 dark:text-brand-400">
                {kelurahanAggregate.rateMengolah !== null
                  ? `${kelurahanAggregate.rateMengolah.toFixed(1)}%`
                  : "Data tidak tersedia"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Footer Ringkasan Data */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-gray-800 dark:text-gray-400">
        <span className="tabular-nums">
          Menampilkan {filteredDataRw.length} RW ({kelurahanAggregate.totalRt} RT terdaftar)
        </span>
      </div>
    </div>
  );
}
