import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ComparisonCard from "@/components/shared/comparison-card";
import GempolinDailyTable from "@/components/shared/gempolin-daily-table";
import GempolinRtTable from "@/components/shared/gempolin-rt-table";
import GempolinTrendChart from "@/components/shared/gempolin-trend-chart";
import MetricCard from "@/components/shared/metric-card";
import ImportActionBar from "@/components/sinkronisasi/import-action-bar";
import type { ImportPreviewData } from "@/components/sinkronisasi/import-dialog";
import { TaskIcon, TrashBinIcon } from "@/icons";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import { calculateDelta } from "@/utils";
import type { Metadata } from "next";
import { gempolinMockData } from "./mock-data";

export const metadata: Metadata = {
  title: "Rekap Pengolahan Gempolin | Gempolin Kelurahan Gempolsari",
  description:
    "Rekapitulasi Operasional Pengolahan Sampah Gempolin - Kelurahan Gempolsari",
};

export default function GempolinPage() {
  const { periode, periodeSebelumnya, harian, perRt } = gempolinMockData;

  const gempolinSource: SourceStatusItem = {
    id: "gempolin",
    namaSumber: "Rekap Pengolahan Gempolin",
    kategori: "Operasional Timbangan KSM",
    frekuensi: "Mingguan",
    periodeLaporan: periode.label,
    waktuSumber: "-",
    waktuImpor: "-",
    status: "perlu_pembaruan",
    keterangan: "",
  };

  const gempolinPreview: ImportPreviewData = {
    columns: [
      { key: "tanggal", label: "Tanggal (WIB)", align: "start" },
      { key: "wilayah", label: "Wilayah (RW/RT)", align: "start" },
      { key: "requestCount", label: "Request", align: "end" },
      { key: "beratTerolah", label: "Terolah (kg)", align: "end" },
      { key: "beratVerifikasi", label: "Verifikasi (kg)", align: "end" },
    ],
    rows: harian.slice(0, 6).map((item) => ({
      id: `${item.tanggal}-${item.rtId}`,
      tanggal: item.tanggal,
      wilayah: `${item.rwNama} / ${item.rtNama}`,
      requestCount: item.requestCount,
      beratTerolah: item.beratTerolah,
      beratVerifikasi: item.beratVerifikasi,
    })),
    totalRows: harian.length,
  };

  const requestTrend = calculateDelta(
    periode.totalRequest,
    periodeSebelumnya.totalRequest,
  );
  const tonaseTrend = calculateDelta(
    periode.totalTerolah,
    periodeSebelumnya.totalTerolah,
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Rekap Pengolahan Gempolin" />

      <ImportActionBar
        title="Pembaruan Data Rekap Gempolin"
        defaultSubtitle={`Periode aktif: ${periode.label} · Siklus Pembaruan: Mingguan (WIB)`}
        buttonLabel="Impor Rekap Gempolin"
        successEntityLabel="Rekap pengolahan Gempolin"
        rowUnit="catatan harian"
        source={gempolinSource}
        preview={gempolinPreview}
      />

      {/* Baris 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <MetricCard
          title="Total Permintaan Bulan Ini"
          value={periode.totalRequest}
          unit="request"
          icon={
            <TaskIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: requestTrend.percentage,
            isPositive: requestTrend.absolute >= 0,
            comparisonLabel: "vs bulan lalu",
          }}
        />

        <MetricCard
          title="Total Sampah Terolah"
          value={periode.totalTerolah}
          unit="kg"
          icon={
            <TrashBinIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: tonaseTrend.percentage,
            isPositive: tonaseTrend.absolute >= 0,
            comparisonLabel: "vs bulan lalu",
          }}
        />
      </div>

      {/* Baris 2: Kartu Komparasi Antar-Periode */}
      <ComponentCard
        title="Perbandingan Antar-Periode"
        desc="Komparasi performa operasional pengolahan sampah dengan periode sebelumnya"
      >
        <ComparisonCard
          currentLabel={periode.label}
          previousLabel={periodeSebelumnya.label}
          currentValue={periode.totalTerolah}
          previousValue={periodeSebelumnya.totalTerolah}
          unit="kg"
          currentRequest={periode.totalRequest}
          previousRequest={periodeSebelumnya.totalRequest}
        />
      </ComponentCard>

      {/* Baris 3: Tren Harian Berat Terolah */}
      <ComponentCard
        title="Tren Harian Tonase Terolah"
        desc="Distribusi harian berat sampah yang berhasil diolah dalam zona waktu WIB"
      >
        <GempolinTrendChart data={harian} />
      </ComponentCard>

      {/* Baris 4: Rekap per Wilayah RW & RT */}
      <ComponentCard
        title="Rekapitulasi per Wilayah (RW & RT)"
        desc="Rincian akumulasi permintaan dan tonase per RW dan RT dengan verifikasi lapangan"
      >
        <GempolinRtTable data={perRt} />
      </ComponentCard>

      {/* Baris 5: Log Rincian Harian */}
      <ComponentCard
        title="Log Rincian Harian"
        desc="Catatan detail operasional harian pengolahan sampah Gempolin"
      >
        <GempolinDailyTable data={harian} />
      </ComponentCard>
    </div>
  );
}
