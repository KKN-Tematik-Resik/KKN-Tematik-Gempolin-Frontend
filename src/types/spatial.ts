/**
 * Tipe data spasial dan partisipasi pengelolaan sampah Kelurahan Gempolsari
 * Standar TypeScript Strict: Zero any
 */

export type ParticipationIndicatorKey =
  | "rumah_memilah"
  | "rumah_mengolah"
  | "kk_memilah"
  | "kk_mengolah"
  | "warga_memilah"
  | "warga_mengolah";

export type ParticipationClass = 1 | 2 | 3 | 4 | 5 | null;

export interface RtIndicatorData {
  numerator: number;
  denominator: number;
}

export interface RtParticipationRecord {
  rt: string; // e.g. "RT 001"
  rw: string; // e.g. "RW 001"
  indicators: Record<ParticipationIndicatorKey, RtIndicatorData>;
}

export interface RtFeatureProperties {
  OBJECTID: number;
  RT: string;
  RW: string;
  Shape_Leng?: number;
  Shape_Area?: number;
}

export interface SpatialSummaryItem {
  rt: string;
  rw: string;
  indicatorKey: ParticipationIndicatorKey;
  numerator: number;
  denominator: number;
  percentage: number | null;
  participationClass: ParticipationClass;
  statusLabel: string;
}

export interface RtReportIndicatorItem {
  key: ParticipationIndicatorKey;
  label: string;
  objectType: "rumah" | "kk" | "warga";
  activity: "memilah" | "mengolah";
  numerator: number;
  denominator: number;
  percentage: number | null;
  participationClass: ParticipationClass;
  statusLabel: string;
}

export interface RtFullReport {
  rt: string;
  rw: string;
  demographics: {
    totalRumah: number;
    totalKk: number;
    totalWarga: number;
  };
  indicators: RtReportIndicatorItem[];
}

