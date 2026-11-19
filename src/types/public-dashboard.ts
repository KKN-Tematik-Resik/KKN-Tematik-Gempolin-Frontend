// TypeScript Strict Types untuk P-01: Dashboard Publik
// Mematuhi Zero any policy dan aturan privasi warga BR-01

export type ObjectFilterType = "rumah" | "kk" | "warga";

export interface PublicFilterState {
  periode: string; // ISO format "2026-11" atau "all"
  rw: string; // "all" atau "RW 01", dst.
  rt: string; // "all" atau "RT 01", dst.
}

export interface PublicRtItem {
  id: string;
  rw: string;
  rt: string;
  kodeWilayah: string;
  periode: string;
  // Demografi & Partisipasi
  totalRumah: number | null;
  totalKk: number | null;
  totalWarga: number | null;
  rumahMemilah: number | null;
  rumahMengolah: number | null;
  kkMemilah: number | null;
  kkMengolah: number | null;
  wargaMemilah: number | null;
  wargaMengolah: number | null;
  // Operasional Gempolin & Bank Sampah
  gempolinRequests: number | null;
  gempolinProcessedKg: number | null;
  bankSampahKg: number | null;
}

export interface AggregatedIndicator {
  numerator: number;
  denominator: number;
  percentage: number | null; // null jika denominator <= 0 (BR-07)
}

export interface PublicParticipationIndicators {
  rumahMemilah: AggregatedIndicator;
  rumahMengolah: AggregatedIndicator;
  kkMemilah: AggregatedIndicator;
  kkMengolah: AggregatedIndicator;
  wargaMemilah: AggregatedIndicator;
  wargaMengolah: AggregatedIndicator;
}

export interface MonthlyTrendItem {
  periodeKey: string;
  label: string; // contoh: "Jun", "Jul", "Agt", "Sep", "Okt", "Nov"
  gempolinProcessedKg: number;
  gempolinRequests: number;
  bankSampahKg: number;
}
