import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ImportActionBar from "@/components/sinkronisasi/import-action-bar";
import type { ImportPreviewData } from "@/components/sinkronisasi/import-dialog";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import type { Metadata } from "next";
import GempolinClient from "./gempolin-client";
import { gempolinMockData } from "./mock-data";

export const metadata: Metadata = {
  title: "Rekap Pengolahan Gempolin | Gempolin Kelurahan Gempolsari",
  description:
    "Rekapitulasi Operasional Pengolahan Sampah Gempolin - Kelurahan Gempolsari",
};

export default function GempolinPage() {
  const { periode, harian } = gempolinMockData;

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

      <GempolinClient initialData={gempolinMockData} />
    </div>
  );
}
