/**
 * Domain types for Demografi and 6 Indikator Partisipasi (A-04).
 * Adheres strictly to Zero `any` policy and system specs.
 */

export type ObjekType = "rumah" | "kk" | "warga";
export type AktivitasType = "memilah" | "mengolah";

export interface DemografiMetrics {
  terdata: number;
  memilah: number;
  mengolah: number;
}

export interface DemografiRtData {
  id: string;
  kodeRt: string;
  namaRt: string;
  kodeRw: string;
  rumah: DemografiMetrics;
  kk: DemografiMetrics;
  warga: DemografiMetrics;
}

export interface DemografiRwData {
  id: string;
  kodeRw: string;
  namaRw: string;
  rumah: DemografiMetrics;
  kk: DemografiMetrics;
  warga: DemografiMetrics;
  daftarRt: DemografiRtData[];
}

export interface DemografiKelurahanSummary {
  rumah: DemografiMetrics;
  kk: DemografiMetrics;
  warga: DemografiMetrics;
}

export interface DemografiDataset {
  periode: string;
  label: string;
  summary: DemografiKelurahanSummary;
  daftarRw: DemografiRwData[];
}
