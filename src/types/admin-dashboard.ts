export type DataSourceType = "gempolin" | "demografi";

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

// Struktur baris pemantauan RT mencakup Demografi dan Gempolin
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
  statusKualitas: QualityStatus;
  catatanAnomali?: string;
  terakhirDiperbarui: string;
}

export interface AdminDashboardFilterState {
  periode: string;
  rw: string;
  rt: string;
  sumberData: string;
  statusKualitas: string;
  searchQuery: string;
}
