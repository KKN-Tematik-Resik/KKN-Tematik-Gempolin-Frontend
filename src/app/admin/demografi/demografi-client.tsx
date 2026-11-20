"use client";

import SpatialDrawer from "@/app/peta-partisipasi/components/spatial-drawer";
import SpatialLegend from "@/app/peta-partisipasi/components/spatial-legend";
import SpatialMapCanvas from "@/app/peta-partisipasi/components/spatial-map-canvas";
import type { SelectedRtInfo } from "@/app/peta-partisipasi/components/spatial-map-inner";
import DemografiFilterBar from "@/components/shared/demografi-filter-bar";
import DemografiHierarchyTable from "@/components/shared/demografi-hierarchy-table";
import IndicatorCard from "@/components/shared/indicator-card";
import MetricCard from "@/components/shared/metric-card";
import { getSpatialParticipationList } from "@/data/mock/spatial-participation";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { BoxIcon, CheckCircleIcon, UploadIcon, UserCircleIcon, UsersIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import ImportDialog, {
  type ImportPreviewData,
} from "@/components/sinkronisasi/import-dialog";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import type {
  AktivitasType,
  DemografiDataset,
  ObjekType,
} from "@/types/demografi";
import type { ParticipationIndicatorKey } from "@/types/spatial";
import { aggregateDemografiMetrics, calculateParticipationRate } from "@/utils";
import React, { useCallback, useMemo, useState } from "react";

export interface DemografiClientProps {
  initialData: DemografiDataset;
}

const OBJEK_DISPLAY_NAMES: Record<ObjekType, string> = {
  rumah: "Rumah",
  kk: "Kepala Keluarga (KK)",
  warga: "Warga (Jiwa)",
};

const DEMOGRAFI_SOURCE: SourceStatusItem = {
  id: "demografi",
  namaSumber: "Data Demografi & 6 Indikator Partisipasi",
  kategori: "Sensus Warga Kelurahan",
  frekuensi: "Bulanan",
  periodeLaporan: "November 2026",
  waktuSumber: "-",
  waktuImpor: "-",
  status: "perlu_pembaruan",
  keterangan: "",
};

export default function DemografiClient({ initialData }: DemografiClientProps) {
  const { getFilter, setFilters, resetFilters, isPending } =
    useDashboardFilters();

  // Membaca nilai filter dari URL (Single Source of Truth)
  const rawObjek = getFilter("objek", "rumah");
  const activeObjek: ObjekType =
    rawObjek === "kk" || rawObjek === "warga" ? rawObjek : "rumah";

  const selectedRw = getFilter("rw", "all");

  const rawView = getFilter("view", "table");
  const activeView: "table" | "map" = rawView === "map" ? "map" : "table";

  const rawAktivitas = getFilter("aktivitas", "memilah");
  const activeAktivitas: AktivitasType =
    rawAktivitas === "mengolah" ? "mengolah" : "memilah";

  // State lokal untuk interaksi peta spasial
  const [activeClasses, setActiveClasses] = useState<number[]>([1, 2, 3, 4, 5]);
  const [selectedRt, setSelectedRt] = useState<SelectedRtInfo | null>(null);

  // State modal impor data demografi & notifikasi kemutakhiran
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [lastImportInfo, setLastImportInfo] = useState<{
    fileName: string;
    timestamp: string;
  } | null>(null);

  const handleImportSuccess = (fileName: string) => {
    const now = new Date();
    const timeStr = `${now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
    setLastImportInfo({ fileName, timestamp: timeStr });
  };

  // Pratinjau tabel impor (agregat RT/RW tanpa data pribadi warga)
  const demografiPreview = useMemo<ImportPreviewData>(() => {
    const allRows = initialData.daftarRw.flatMap((rw) =>
      rw.daftarRt.map((rt) => ({
        id: rt.id,
        wilayah: `${rt.kodeRw} / ${rt.kodeRt}`,
        rumahTerdata: rt.rumah.terdata,
        rumahMemilah: rt.rumah.memilah,
        rumahMengolah: rt.rumah.mengolah,
        kkTerdata: rt.kk.terdata,
        wargaTerdata: rt.warga.terdata,
      })),
    );
    return {
      columns: [
        { key: "wilayah", label: "Wilayah (RW/RT)", align: "start" },
        { key: "rumahTerdata", label: "Rumah Terdata", align: "end" },
        { key: "rumahMemilah", label: "Memilah", align: "end" },
        { key: "rumahMengolah", label: "Mengolah", align: "end" },
        { key: "kkTerdata", label: "KK Terdata", align: "end" },
        { key: "wargaTerdata", label: "Warga (Jiwa)", align: "end" },
      ],
      rows: allRows.slice(0, 6),
      totalRows: allRows.length,
    };
  }, [initialData.daftarRw]);

  // Opsi dropdown RW
  const rwOptions = useMemo(() => {
    return initialData.daftarRw.map((rw) => ({
      value: rw.kodeRw.replace(/\s+/g, "").toLowerCase(),
      label: rw.namaRw,
    }));
  }, [initialData.daftarRw]);

  // Saring data berdasarkan RW yang dipilih untuk indikator aktif
  const filteredRwList = useMemo(() => {
    if (!selectedRw || selectedRw === "all") {
      return initialData.daftarRw;
    }
    return initialData.daftarRw.filter(
      (rw) =>
        rw.kodeRw.replace(/\s+/g, "").toLowerCase() ===
        selectedRw.replace(/\s+/g, "").toLowerCase(),
    );
  }, [initialData.daftarRw, selectedRw]);

  // Agregasi capaian indikator aktif
  const activeMetrics = useMemo(() => {
    const list = filteredRwList.map((rw) => rw[activeObjek]);
    const summary = aggregateDemografiMetrics(list);
    const rateMemilah = calculateParticipationRate(summary.memilah, summary.terdata);
    const rateMengolah = calculateParticipationRate(summary.mengolah, summary.terdata);

    return {
      terdata: summary.terdata,
      memilah: summary.memilah,
      mengolah: summary.mengolah,
      rateMemilah,
      rateMengolah,
    };
  }, [filteredRwList, activeObjek]);

  // Normalisasi kode RW untuk kueri data spasial (misal: "01" -> "RW 001")
  const normalizedRwForSpatial = useMemo(() => {
    if (!selectedRw || selectedRw === "all") return "all";
    const num = selectedRw.replace(/\D/g, "");
    return num ? `RW ${num.padStart(3, "0")}` : "all";
  }, [selectedRw]);

  // Kunci indikator partisipasi untuk peta (misal: "rumah_memilah", "kk_mengolah")
  const spatialIndicatorKey: ParticipationIndicatorKey =
    `${activeObjek}_${activeAktivitas}` as ParticipationIndicatorKey;

  // Data spasial 67 RT untuk indikator aktif
  const allSpatialItems = useMemo(() => {
    return getSpatialParticipationList({
      indicator: spatialIndicatorKey,
      rw: "all",
    });
  }, [spatialIndicatorKey]);

  // Rekap jumlah RT per kelas klasifikasi untuk legenda peta
  const countsByClass = useMemo(() => {
    const counts: Record<number | "none", number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      none: 0,
    };
    allSpatialItems.forEach((item) => {
      if (item.participationClass === null) {
        counts.none += 1;
      } else {
        counts[item.participationClass] =
          (counts[item.participationClass] || 0) + 1;
      }
    });
    return counts;
  }, [allSpatialItems]);

  // Data spasial yang sudah difilter berdasarkan RW aktif
  const filteredSpatialItems = useMemo(() => {
    return getSpatialParticipationList({
      indicator: spatialIndicatorKey,
      rw: normalizedRwForSpatial,
      classes: activeClasses,
    });
  }, [spatialIndicatorKey, normalizedRwForSpatial, activeClasses]);

  const handleToggleClass = useCallback((classNum: number) => {
    setActiveClasses((prev) => {
      if (prev.includes(classNum)) {
        if (prev.length === 1) return [1, 2, 3, 4, 5];
        return prev.filter((c) => c !== classNum);
      }
      return [...prev, classNum];
    });
  }, []);

  const wilayahLabel =
    selectedRw && selectedRw !== "all"
      ? `Wilayah ${filteredRwList[0]?.namaRw ?? selectedRw.toUpperCase()}`
      : "Seluruh Kelurahan Gempolsari";

  const objekName = OBJEK_DISPLAY_NAMES[activeObjek];

  return (
    <div className="space-y-6">
      {/* Action Bar: Status Kemutakhiran & Tombol Impor Data Demografi */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <div className="flex items-center gap-2">
        
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pembaruan Data Demografi
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
            {lastImportInfo
              ? `Dimutakhirkan: ${lastImportInfo.timestamp} via ${lastImportInfo.fileName}`
              : "Periode aktif: November 2026 · Siklus Pembaruan: Bulanan (WIB)"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 text-xs"
          >
            <UploadIcon className="size-4" />
            <span>Impor Data Demografi</span>
          </Button>
        </div>
      </div>

      {/* Banner Feedback Berhasil Dimutakhirkan */}
      {lastImportInfo && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircleIcon className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Data demografi {demografiPreview.totalRows} RT berhasil dimutakhirkan dari berkas{" "}
              <strong>{lastImportInfo.fileName}</strong> pada {lastImportInfo.timestamp}.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLastImportInfo(null)}
            className="font-medium text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 3 Kartu Ringkasan Demografi Tingkat Kelurahan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        <MetricCard
          title="Total Rumah Terdata"
          value={initialData.summary.rumah.terdata}
          unit="Rumah"
          sublabel="Tercatat di 6 RW Kelurahan Gempolsari"
          icon={<BoxIcon className="size-5" />}
        />
        <MetricCard
          title="Total Kepala Keluarga (KK)"
          value={initialData.summary.kk.terdata}
          unit="KK"
          sublabel="Kepala Keluarga terdaftar resmi"
          icon={<UsersIcon className="size-5" />}
        />
        <MetricCard
          title="Total Warga Terdata (Jiwa)"
          value={initialData.summary.warga.terdata}
          unit="Jiwa"
          sublabel="Penduduk terdata di sistem pilah-olah"
          icon={<UserCircleIcon className="size-5" />}
        />
      </div>

      {/* Bar Filter: Toggle Objek + Dropdown RW + Toggle View Mode */}
      <DemografiFilterBar
        activeObjek={activeObjek}
        selectedRw={selectedRw}
        rwOptions={rwOptions}
        activeView={activeView}
        onObjekChange={(objek) => setFilters({ objek })}
        onRwChange={(rw) => setFilters({ rw })}
        onViewChange={(view) => setFilters({ view })}
        onReset={() => resetFilters()}
        isPending={isPending}
      />

      {/* 2 Kartu Indikator Partisipasi Berdasarkan Objek Aktif */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Capaian Indikator Partisipasi {objekName} ({wilayahLabel})
          </h3>
          <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
            Periode: {initialData.label}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <IndicatorCard
            label={`Tingkat ${objekName} Memilah`}
            numerator={activeMetrics.memilah}
            denominator={activeMetrics.terdata}
            percentage={activeMetrics.rateMemilah}
            activity="memilah"
            objectType={activeObjek}
            sublabel="Memilah sampah organik dan anorganik dari sumber"
          />
          <IndicatorCard
            label={`Tingkat ${objekName} Mengolah`}
            numerator={activeMetrics.mengolah}
            denominator={activeMetrics.terdata}
            percentage={activeMetrics.rateMengolah}
            activity="mengolah"
            objectType={activeObjek}
            sublabel="Mengolah sampah mandiri atau melalui bank sampah"
          />
        </div>
      </div>

      {/* Konten Dinamis: Peta Interaktif ATAU Tabel Data Hierarkis */}
      {activeView === "map" ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header Card Peta */}
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Peta Sebaran Partisipasi Spasial (RT & RW)
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Visualisasi geografis sebaran tingkat partisipasi {objekName} ({activeAktivitas === "memilah" ? "Memilah" : "Mengolah"}) per-wilayah RT.
              </p>
            </div>

            {/* Sub-kontrol Aktivitas */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Aktivitas:
              </span>
              <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setFilters({ aktivitas: "memilah" })}
                  disabled={isPending}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeAktivitas === "memilah"
                      ? "bg-brand-600 text-white shadow-xs dark:bg-brand-500"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Memilah Sampah
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ aktivitas: "mengolah" })}
                  disabled={isPending}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeAktivitas === "mengolah"
                      ? "bg-brand-600 text-white shadow-xs dark:bg-brand-500"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Mengolah Sampah
                </button>
              </div>
            </div>
          </div>

          {/* Body Card: Kanvas Peta + Legenda Mengambang */}
          <div className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
              <SpatialMapCanvas
                items={filteredSpatialItems}
                activeClasses={activeClasses}
                onSelectRt={(info) => setSelectedRt(info)}
              />

              {/* Floating Legend Overlay */}
              <div className="pointer-events-auto absolute bottom-4 left-4 z-10 max-w-xs">
                <SpatialLegend
                  activeClasses={activeClasses}
                  onToggleClass={handleToggleClass}
                  countsByClass={countsByClass}
                />
              </div>
            </div>
          </div>

          Footer Card
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500 sm:px-6 dark:border-gray-800 dark:text-gray-400">
            <span className="tabular-nums">
              Menampilkan {filteredSpatialItems.length} poligon RT ({wilayahLabel})
            </span>
          </div>

          {/* Drawer Detail RT Terpilih */}
          <SpatialDrawer
            rt={selectedRt?.rt ?? null}
            rw={selectedRt?.rw ?? null}
            isOpen={selectedRt !== null}
            onClose={() => setSelectedRt(null)}
          />
        </div>
      ) : (
        <DemografiHierarchyTable
          dataRw={initialData.daftarRw}
          activeObjek={activeObjek}
          selectedRwFilter={selectedRw}
        />
      )}

      {/* Modal Impor Data Demografi */}
      <ImportDialog
        isOpen={isImportOpen}
        onOpenChange={setIsImportOpen}
        source={DEMOGRAFI_SOURCE}
        preview={demografiPreview}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
