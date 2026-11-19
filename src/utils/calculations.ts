import type { ParticipationClass } from "@/types/spatial";

/**
 * Utility functions for domain calculations (Gempolin).
 */

export interface DeltaResult {
  absolute: number;
  percentage: number | null;
}

/**
 * Calculates absolute and percentage change between current and previous values.
 * In accordance with BR-07, if previous value is 0 or less, percentage returns null.
 */
export function calculateDelta(current: number, previous: number): DeltaResult {
  const absolute = current - previous;
  if (previous <= 0) {
    return { absolute, percentage: null };
  }
  const percentage = Math.round(((current - previous) / previous) * 100);
  return { absolute, percentage };
}

/**
 * Type guard to check if a numeric data value is valid and available (BR-07).
 */
export function isDataAvailable(value: number | null | undefined): value is number {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

/**
 * BR-05 & BR-07: Rumus Persentase Partisipasi
 * Mengembalikan null jika penyebut nol, negatif, atau data tidak tersedia
 */
export function calculateParticipationRate(
  numerator: number,
  denominator: number,
): number | null {
  if (
    denominator <= 0 ||
    Number.isNaN(denominator) ||
    Number.isNaN(numerator) ||
    numerator < 0
  ) {
    return null;
  }
  return (numerator / denominator) * 100;
}

/**
 * BR-08: Klasifikasi 5-Kelas Persentase Partisipasi
 * Kelas 1: 80% - 100% (Sangat Tinggi)
 * Kelas 2: 60% - <80% (Tinggi)
 * Kelas 3: 40% - <60% (Sedang)
 * Kelas 4: 20% - <40% (Rendah)
 * Kelas 5: 0% - <20% (Sangat Rendah)
 * Null: Data Tidak Tersedia (BR-07)
 */
export function getParticipationClass(
  percentage: number | null,
): ParticipationClass {
  if (percentage === null || Number.isNaN(percentage) || percentage < 0) {
    return null;
  }
  if (percentage >= 80) return 1;
  if (percentage >= 60) return 2;
  if (percentage >= 40) return 3;
  if (percentage >= 20) return 4;
  return 5;
}

/**
 * Label semantik untuk nama kelas partisipasi (NFR-23)
 */
export function getParticipationClassName(pClass: ParticipationClass): string {
  switch (pClass) {
    case 1:
      return "Sangat Tinggi (80%–100%)";
    case 2:
      return "Tinggi (60%–<80%)";
    case 3:
      return "Sedang (40%–<60%)";
    case 4:
      return "Rendah (20%–<40%)";
    case 5:
      return "Sangat Rendah (0%–<20%)";
    default:
      return "Data Tidak Tersedia";
  }
}

/**
 * Palet warna 5-kelas ramah buta warna sesuai matriks desain sistem
 */
export function getParticipationColor(
  pClass: ParticipationClass,
  isDark = false,
): string {
  switch (pClass) {
    case 1:
      return isDark ? "#22C55E" : "#15803D";
    case 2:
      return isDark ? "#4ADE80" : "#22C55E";
    case 3:
      return isDark ? "#FACC15" : "#EAB308";
    case 4:
      return isDark ? "#FB923C" : "#F97316";
    case 5:
      return isDark ? "#F87171" : "#DC2626";
    default:
      return isDark ? "#4B5563" : "#D1D5DB";
  }
}

/**
 * Format persentase untuk tampilan UI (menambahkan class tabular-nums)
 */
export function formatPercentage(percentage: number | null): string {
  if (percentage === null) {
    return "Data tidak tersedia";
  }
  return `${percentage.toFixed(1)}%`;
}
