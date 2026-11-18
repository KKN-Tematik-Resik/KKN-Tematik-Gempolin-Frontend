"use client";

import { useMemo, useState } from "react";
import { RtMonitoringRow } from "@/types/admin-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SearchIcon,
  CheckCircleIcon,
  AlertIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RegenerateIcon,
  XIcon,
} from "@/icons";

interface Props {
  initialData: RtMonitoringRow[];
}

export default function RtMonitoringSection({ initialData }: Props) {
  // Filter 4 dimensi kriteria FR-18
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");
  const [selectedRw, setSelectedRw] = useState<string>("all");
  const [selectedRt, setSelectedRt] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedQuality, setSelectedQuality] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // State untuk modal pop-up detail catatan anomali
  const [activeNote, setActiveNote] = useState<{
    wilayah: string;
    text: string;
  } | null>(null);

  // Daftar opsi RW yang unik dari dataset
  const rwOptions = useMemo(() => {
    const rws = Array.from(new Set(initialData.map((d) => d.rw)));
    return rws.sort((a, b) => a.localeCompare(b));
  }, [initialData]);

  // Daftar opsi RT dinamis berdasarkan RW yang sedang dipilih
  const rtOptions = useMemo(() => {
    if (selectedRw === "all") {
      const rts = Array.from(new Set(initialData.map((d) => d.rt)));
      return rts.sort((a, b) => a.localeCompare(b));
    }
    const filteredRts = initialData
      .filter((d) => d.rw === selectedRw)
      .map((d) => d.rt);
    return Array.from(new Set(filteredRts)).sort((a, b) => a.localeCompare(b));
  }, [initialData, selectedRw]);

  // Handler pergantian RW (sekaligus reset pilihan RT)
  const handleRwChange = (newRw: string) => {
    setSelectedRw(newRw);
    setSelectedRt("all");
    setCurrentPage(1);
  };

  // Filter data berdasarkan 4 dimensi kriteria FR-18
  const filteredData = useMemo(() => {
    return initialData.filter((row) => {
      // 1. Filter Periode
      if (selectedPeriode !== "all" && row.periode !== selectedPeriode) {
        return false;
      }

      // 2. Filter Wilayah (RW & RT)
      if (selectedRw !== "all" && row.rw !== selectedRw) {
        return false;
      }
      if (selectedRt !== "all" && row.rt !== selectedRt) {
        return false;
      }

      // 3. Filter Sumber Data (Gempolin, Demografi, Bank Sampah)
      if (selectedSource === "gempolin") {
        if (row.gempolinRequests === null || row.gempolinRequests === 0) {
          return false;
        }
      } else if (selectedSource === "demografi") {
        if (row.totalRumah === null || row.totalRumah === 0) {
          return false;
        }
      } else if (selectedSource === "bank_sampah") {
        if (row.bankSampahKg === null || row.bankSampahKg === 0) {
          return false;
        }
      }

      // 4. Filter Status Kualitas Data (Lengkap, Ditandai, Kosong)
      if (selectedQuality !== "all" && row.statusKualitas !== selectedQuality) {
        return false;
      }

      // 5. Pencarian Cepat Teks (Nomor RT / Catatan)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesWilayah =
          row.rt.toLowerCase().includes(query) ||
          row.rw.toLowerCase().includes(query);
        const matchesCatatan = row.catatanAnomali
          ? row.catatanAnomali.toLowerCase().includes(query)
          : false;

        if (!matchesWilayah && !matchesCatatan) {
          return false;
        }
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

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleResetFilters = () => {
    setSelectedPeriode("all");
    setSelectedRw("all");
    setSelectedRt("all");
    setSelectedSource("all");
    setSelectedQuality("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getQualityBadge = (status: string) => {
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
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      {/* Header Standar Tabel (Tanpa Duplikasi Counter di Kanan Atas) */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Data Pengelolaan Sampah per RT
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Daftar rincian data demografi warga, operasional pengangkutan Gempolin, dan bank sampah di tingkat RT.
        </p>
      </div>

      {/* Filter Bar Standar Lengkap Sesuai Spesifikasi FR-18 */}
      <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800/80 dark:bg-white/2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* 1. Filter Periode Data */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Periode
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => {
                setSelectedPeriode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Periode</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-10">Oktober 2026</option>
            </select>
          </div>

          {/* 2. Filter Wilayah RW */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Wilayah RW
            </label>
            <select
              value={selectedRw}
              onChange={(e) => handleRwChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua RW</option>
              {rwOptions.map((rw) => (
                <option key={rw} value={rw}>
                  {rw}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter Wilayah RT */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Wilayah RT
            </label>
            <select
              value={selectedRt}
              onChange={(e) => {
                setSelectedRt(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua RT</option>
              {rtOptions.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Filter Sumber Data */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Sumber Data
            </label>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Sumber Data</option>
              <option value="demografi">Demografi & Partisipasi</option>
              <option value="gempolin">Layanan Gempolin</option>
              <option value="bank_sampah">Bank Sampah & IoT</option>
            </select>
          </div>

          {/* 5. Filter Status Kualitas Data */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Status Kualitas
            </label>
            <select
              value={selectedQuality}
              onChange={(e) => {
                setSelectedQuality(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs text-gray-800 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="lengkap">Lengkap (Valid)</option>
              <option value="ditandai">Ditandai (Anomali)</option>
              <option value="kosong">Kosong (Belum Ada Data)</option>
            </select>
          </div>

          {/* 6. Tombol Atur Ulang Filter */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="w-full gap-1.5 text-xs text-gray-700 dark:text-gray-300"
            >
              <RegenerateIcon className="size-3.5" />
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Baris Pencarian Teks */}
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan nomor RT atau keterangan catatan..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pe-3 ps-8 text-xs text-gray-800 placeholder-gray-400 outline-none transition hover:border-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <SearchIcon className="absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Standar Layout Tabel dengan Kolom RW dan RT Terpisah */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <Table className="text-left text-xs">
          <TableHeader className="border-b border-gray-200 bg-gray-50/90 font-medium text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
            <TableRow>
              <TableCell isHeader className="w-12 py-3 ps-4 pe-2 text-center">
                No
              </TableCell>
              <TableCell isHeader className="py-3 px-3">
                RW
              </TableCell>
              <TableCell isHeader className="py-3 px-3">
                RT
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                Rumah
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                KK
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                Partisipasi Memilah
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                Partisipasi Mengolah
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                Gempolin (Terolah)
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-right">
                Bank Sampah
              </TableCell>
              <TableCell isHeader className="py-3 px-3 text-center">
                Status Kualitas
              </TableCell>
              <TableCell isHeader className="py-3 ps-3 pe-4 text-center">
                Catatan
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <TableRow
                    key={row.id}
                    className="transition hover:bg-gray-50/70 dark:hover:bg-white/2"
                  >
                    {/* Nomor Urut */}
                    <TableCell className="py-3 ps-4 pe-2 text-center tabular-nums text-gray-500 dark:text-gray-400">
                      {rowNumber}
                    </TableCell>

                    {/* RW */}
                    <TableCell className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {row.rw}
                    </TableCell>

                    {/* RT */}
                    <TableCell className="py-3 px-3 font-semibold text-gray-900 dark:text-white">
                      {row.rt}
                    </TableCell>

                    {/* Total Rumah */}
                    <TableCell className="py-3 px-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {row.totalRumah !== null && row.totalRumah > 0
                        ? row.totalRumah.toLocaleString("id-ID")
                        : "-"}
                    </TableCell>

                    {/* Total KK */}
                    <TableCell className="py-3 px-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {row.totalKk !== null && row.totalKk > 0
                        ? row.totalKk.toLocaleString("id-ID")
                        : "-"}
                    </TableCell>

                    {/* Partisipasi Memilah */}
                    <TableCell className="py-3 px-3 text-right">
                      {row.partisipasiMemilahPct !== null ? (
                        <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {row.partisipasiMemilahPct.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge variant="light" color="gray" size="sm">
                          Data belum tersedia
                        </Badge>
                      )}
                    </TableCell>

                    {/* Partisipasi Mengolah */}
                    <TableCell className="py-3 px-3 text-right">
                      {row.partisipasiMengolahPct !== null ? (
                        <span className="font-semibold tabular-nums text-brand-600 dark:text-brand-400">
                          {row.partisipasiMengolahPct.toFixed(1)}%
                        </span>
                      ) : (
                        <Badge variant="light" color="gray" size="sm">
                          Data belum tersedia
                        </Badge>
                      )}
                    </TableCell>

                    {/* Data Gempolin Terolah */}
                    <TableCell className="py-3 px-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {row.gempolinProcessedKg !== null && row.gempolinProcessedKg > 0 ? (
                        <span>
                          {row.gempolinProcessedKg.toLocaleString("id-ID")}{" "}
                          <span className="text-[11px] text-gray-500">kg</span>
                          <span className="ms-1 text-[11px] text-gray-400">
                            ({row.gempolinRequests} req)
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Data Bank Sampah */}
                    <TableCell className="py-3 px-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {row.bankSampahKg !== null && row.bankSampahKg > 0 ? (
                        <span>
                          {row.bankSampahKg.toLocaleString("id-ID")}{" "}
                          <span className="text-[11px] text-gray-500">kg</span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Status Kualitas Data */}
                    <TableCell className="py-3 px-3 text-center">
                      {getQualityBadge(row.statusKualitas)}
                    </TableCell>

                    {/* Catatan Anomali */}
                    <TableCell className="py-3 ps-3 pe-4 text-center">
                      {row.catatanAnomali ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveNote({
                              wilayah: `${row.rw} · ${row.rt}`,
                              text: row.catatanAnomali!,
                            })
                          }
                          title={row.catatanAnomali}
                          className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 transition hover:bg-amber-100 hover:text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                        >
                          <span>Lihat Catatan</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">
                      Tidak ada data RT yang sesuai dengan kombinasi filter yang dipilih.
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

      {/* Pagination Footer Standar */}
      <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-semibold tabular-nums text-gray-800 dark:text-gray-200">
            {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          </span>{" "}
          sampai{" "}
          <span className="font-semibold tabular-nums text-gray-800 dark:text-gray-200">
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold tabular-nums text-gray-800 dark:text-gray-200">
            {filteredData.length}
          </span>{" "}
          data RT
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeftIcon className="size-3.5" />
              Sebelumnya
            </Button>
            <span className="px-2 text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Selanjutnya
              <ChevronRightIcon className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Modal Pop-up Catatan Anomali Bersih */}
      {activeNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <AlertIcon className="size-5 text-amber-600 dark:text-amber-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Catatan Verifikasi {activeNote.wilayah}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="py-4">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {activeNote.text}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setActiveNote(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
