export type DataSourceType = "gempolin" | "demografi" | "bank_sampah";

export type QualityStatus = "lengkap" | "ditandai" | "kosong";

export interface DataSourceStatus {
  source: DataSourceType;
  name: string;
  sourceTypeLabel: string;
  status: "terkini" | "perlu_diperbarui" | "sinkronisasi_berjalan";
  dataPeriod: string;
  sourceUpdatedAt: string;
  lastImportAt: string;
  recordCount: number;
  syncResult: string;
  isOutdated: boolean;
}

export interface OperationalMetrics {
  totalRequests: number;
  totalProcessedWeightKg: number;
  verifiedWeightKg: number;
  flaggedRowsCount: number;
  rejectedRowsCount: number;
  lastImportDate: string;
}

// FR-15 & FR-18: Struktur Baris Pemantauan RT mencakup Demografi, Gempolin, dan Bank Sampah
export interface RtMonitoringRow {
  id: string;
  rw: string;
  rt: string;
  kodeWilayah: string;
  periode: string;
  totalRumah: number | null;
  totalKk: number | null;
  totalWarga: number | null;
  rumahMemilah: number | null;
  rumahMengolah: number | null;
  partisipasiMemilahPct: number | null;
  partisipasiMengolahPct: number | null;
  gempolinRequests: number | null;
  gempolinProcessedKg: number | null;
  bankSampahKg: number | null;
  statusKualitas: QualityStatus;
  catatanAnomali?: string;
  terakhirDiperbarui: string;
}

// FR-18: Filter periode, wilayah (kelurahan, RW, RT), sumber data, dan status kualitas data
export interface AdminDashboardFilterState {
  periode: string;
  rw: string;
  rt: string;
  sumberData: string;
  statusKualitas: string;
  searchQuery: string;
}
