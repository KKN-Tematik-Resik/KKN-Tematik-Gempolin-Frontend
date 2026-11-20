"use client";

import SourceStatusTable from "./source-status-table";
import SummaryCards from "./summary-cards";
import SyncAuditTable from "./sync-audit-table";
import type {
  SourceStatusItem,
  SyncAuditLogItem,
  SyncSummaryStats,
} from "@/types/sinkronisasi";

// Dummy data ringkasan KPI sistem
const dummySummaryStats: SyncSummaryStats = {
  statusSistem: "normal",
  totalSumber: 2,
  sumberMutakhir: 2,
  sumberPerluPembaruan: 0,
  totalImporBulanIni: 6,
};

// Dummy data status kemutakhiran per sumber (BR-11)
const dummySourceStatuses: SourceStatusItem[] = [
  {
    id: "src-gempolin",
    namaSumber: "Rekap Pengolahan Gempolin",
    kategori: "Operasional Timbangan KSM",
    frekuensi: "Mingguan (Setiap Senin)",
    periodeLaporan: "Minggu II Nov 2026",
    waktuSumber: "17 Nov 2026, 17:30 WIB",
    waktuImpor: "18 Nov 2026, 08:30 WIB",
    status: "mutakhir",
    keterangan: "Data mingguan terbaru telah berhasil diimpor dan diverifikasi.",
    href: "/admin/gempolin",
  },
  {
    id: "src-demografi",
    namaSumber: "Demografi & Partisipasi Warga",
    kategori: "Survei Rumah Tangga & Pilah Sampah",
    frekuensi: "Bulanan (Awal Bulan)",
    periodeLaporan: "November 2026",
    waktuSumber: "01 Nov 2026, 10:00 WIB",
    waktuImpor: "02 Nov 2026, 09:15 WIB",
    status: "mutakhir",
    keterangan: "Data demografi bulan berjalan valid dan aktif digunakan di dashboard.",
    href: "/admin/demografi",
  },
];

// Dummy audit log transaksi impor atomik (BR-10)
const dummyAuditLogs: SyncAuditLogItem[] = [
  {
    id: "log-001",
    waktuImpor: "18 Nov 2026, 08:30 WIB",
    namaBerkas: "rekap_gempolin_minggu2_nov2026.xlsx",
    sumberData: "Rekap Pengolahan Gempolin",
    adminPelaksana: "Admin Kelurahan Gempolsari",
    barisBerhasil: 128,
    barisDitolak: 0,
    status: "sukses",
    catatan: "Pembaruan mingguan berhasil diproses penuh.",
  },
  {
    id: "log-002",
    waktuImpor: "10 Nov 2026, 09:00 WIB",
    namaBerkas: "rekap_gempolin_minggu1_nov2026.xlsx",
    sumberData: "Rekap Pengolahan Gempolin",
    adminPelaksana: "Admin Kelurahan Gempolsari",
    barisBerhasil: 115,
    barisDitolak: 0,
    status: "sukses",
    catatan: "Pembaruan mingguan berhasil diproses penuh.",
  },
  {
    id: "log-003",
    waktuImpor: "02 Nov 2026, 09:15 WIB",
    namaBerkas: "demografi_partisipasi_nov2026.xlsx",
    sumberData: "Demografi & Partisipasi Warga",
    adminPelaksana: "Admin Kelurahan Gempolsari",
    barisBerhasil: 1840,
    barisDitolak: 0,
    status: "sukses",
    catatan: "Data bulanan 6 RW dan 38 RT terverifikasi lengkap.",
  },
  {
    id: "log-004",
    waktuImpor: "01 Nov 2026, 14:00 WIB",
    namaBerkas: "bank_sampah_rekap_okt2026.xlsx",
    sumberData: "Informasi Bank Sampah",
    adminPelaksana: "Admin Kelurahan Gempolsari",
    barisBerhasil: 320,
    barisDitolak: 0,
    status: "sukses",
    catatan: "Rekap agregat timbangan unit bank sampah tersimpan.",
  },
  {
    id: "log-005",
    waktuImpor: "25 Okt 2026, 11:20 WIB",
    namaBerkas: "draft_rekap_rw03_format_salah.xlsx",
    sumberData: "Demografi & Partisipasi Warga",
    adminPelaksana: "Admin Kelurahan Gempolsari",
    barisBerhasil: 0,
    barisDitolak: 15,
    status: "rollback",
    catatan: "Struktur kolom tidak sesuai skema template. Transaksi dibatalkan otomatis.",
  },
];

export default function SinkronisasiSection() {
  return (
    <div className="space-y-6">
      {/* 1. Tiga Kartu KPI Ringkasan Status Sistem */}
      <SummaryCards stats={dummySummaryStats} />

      {/* 2. Tabel Status Kemutakhiran Sumber Data (BR-11) */}
      <SourceStatusTable sources={dummySourceStatuses} />

      {/* 3. Tabel Riwayat Impor & Audit Log Transaksi (BR-10) */}
      <SyncAuditTable logs={dummyAuditLogs} />
    </div>
  );
}
