import type {
  ParticipationIndicatorKey,
  RtParticipationRecord,
  SpatialSummaryItem,
  RtFullReport,
  RtReportIndicatorItem,
} from "@/types/spatial";
import {
  calculateParticipationRate,
  getParticipationClass,
  getParticipationClassName,
} from "@/utils/calculations";

// 67 RT dan RW riil yang terpetakan 1-to-1 dengan public/data/gempolsari-rt.geojson
const RT_RW_PAIRS: Array<{ rt: string; rw: string }> = [
  { rt: "RT 001", rw: "RW 001" },
  { rt: "RT 001", rw: "RW 002" },
  { rt: "RT 001", rw: "RW 003" },
  { rt: "RT 001", rw: "RW 004" },
  { rt: "RT 001", rw: "RW 005" },
  { rt: "RT 001", rw: "RW 006" },
  { rt: "RT 001", rw: "RW 007" },
  { rt: "RT 001", rw: "RW 008" },
  { rt: "RT 001", rw: "RW 009" },
  { rt: "RT 001", rw: "RW 010" },
  { rt: "RT 002", rw: "RW 001" },
  { rt: "RT 002", rw: "RW 002" },
  { rt: "RT 002", rw: "RW 003" },
  { rt: "RT 002", rw: "RW 004" },
  { rt: "RT 002", rw: "RW 005" },
  { rt: "RT 002", rw: "RW 006" },
  { rt: "RT 002", rw: "RW 007" },
  { rt: "RT 002", rw: "RW 008" },
  { rt: "RT 002", rw: "RW 009" },
  { rt: "RT 002", rw: "RW 010" },
  { rt: "RT 003", rw: "RW 001" },
  { rt: "RT 003", rw: "RW 002" },
  { rt: "RT 003", rw: "RW 003" },
  { rt: "RT 003", rw: "RW 004" },
  { rt: "RT 003", rw: "RW 005" },
  { rt: "RT 003", rw: "RW 006" },
  { rt: "RT 003", rw: "RW 007" },
  { rt: "RT 003", rw: "RW 008" },
  { rt: "RT 003", rw: "RW 009" },
  { rt: "RT 003", rw: "RW 010" },
  { rt: "RT 004", rw: "RW 001" },
  { rt: "RT 004", rw: "RW 002" },
  { rt: "RT 004", rw: "RW 003" },
  { rt: "RT 004", rw: "RW 004" },
  { rt: "RT 004", rw: "RW 005" },
  { rt: "RT 004", rw: "RW 006" },
  { rt: "RT 004", rw: "RW 007" },
  { rt: "RT 004", rw: "RW 008" },
  { rt: "RT 004", rw: "RW 009" },
  { rt: "RT 004", rw: "RW 010" },
  { rt: "RT 005", rw: "RW 002" },
  { rt: "RT 005", rw: "RW 004" },
  { rt: "RT 005", rw: "RW 005" },
  { rt: "RT 005", rw: "RW 006" },
  { rt: "RT 005", rw: "RW 007" },
  { rt: "RT 005", rw: "RW 008" },
  { rt: "RT 005", rw: "RW 009" },
  { rt: "RT 005", rw: "RW 010" },
  { rt: "RT 006", rw: "RW 002" },
  { rt: "RT 006", rw: "RW 004" },
  { rt: "RT 006", rw: "RW 005" },
  { rt: "RT 006", rw: "RW 008" },
  { rt: "RT 006", rw: "RW 009" },
  { rt: "RT 006", rw: "RW 010" },
  { rt: "RT 007", rw: "RW 004" },
  { rt: "RT 007", rw: "RW 005" },
  { rt: "RT 007", rw: "RW 008" },
  { rt: "RT 007", rw: "RW 009" },
  { rt: "RT 007", rw: "RW 010" },
  { rt: "RT 008", rw: "RW 004" },
  { rt: "RT 008", rw: "RW 010" },
  { rt: "RT 009", rw: "RW 004" },
  { rt: "RT 009", rw: "RW 010" },
  { rt: "RT 010", rw: "RW 004" },
  { rt: "RT 011", rw: "RW 004" },
  { rt: "RT 012", rw: "RW 004" },
  { rt: "RT 013", rw: "RW 004" },
];

/**
 * Pola deterministik untuk memproduksi angka mock yang realistis dan beragam
 */
function createMockRtRecord(rt: string, rw: string, index: number): RtParticipationRecord {
  // Skenario batas BR-07: RT 013 RW 004 memiliki penyebut 0 (area baru / belum ada warga)
  if (rt === "RT 013" && rw === "RW 004") {
    return {
      rt,
      rw,
      indicators: {
        rumah_memilah: { numerator: 0, denominator: 0 },
        rumah_mengolah: { numerator: 0, denominator: 0 },
        kk_memilah: { numerator: 0, denominator: 0 },
        kk_mengolah: { numerator: 0, denominator: 0 },
        warga_memilah: { numerator: 0, denominator: 0 },
        warga_mengolah: { numerator: 0, denominator: 0 },
      },
    };
  }

  // Base demografi rata-rata RT di Kelurahan Gempolsari
  const baseRumah = 60 + ((index * 7) % 65); // 60 - 124 rumah
  const baseKk = Math.round(baseRumah * 1.2);  // ~1.2 KK per rumah
  const baseWarga = Math.round(baseKk * 3.4);  // ~3.4 jiwa per KK

  // Faktor rasio partisipasi beragam dari 12% s.d. 95%
  const factor = (15 + ((index * 13) % 82)) / 100;
  const processFactor = factor * 0.75; // Mengolah biasanya sedikit lebih rendah dari memilah

  return {
    rt,
    rw,
    indicators: {
      rumah_memilah: {
        numerator: Math.round(baseRumah * factor),
        denominator: baseRumah,
      },
      rumah_mengolah: {
        numerator: Math.round(baseRumah * processFactor),
        denominator: baseRumah,
      },
      kk_memilah: {
        numerator: Math.round(baseKk * factor),
        denominator: baseKk,
      },
      kk_mengolah: {
        numerator: Math.round(baseKk * processFactor),
        denominator: baseKk,
      },
      warga_memilah: {
        numerator: Math.round(baseWarga * factor),
        denominator: baseWarga,
      },
      warga_mengolah: {
        numerator: Math.round(baseWarga * processFactor),
        denominator: baseWarga,
      },
    },
  };
}

export const MOCK_SPATIAL_PARTICIPATION: RtParticipationRecord[] = RT_RW_PAIRS.map(
  (pair, index) => createMockRtRecord(pair.rt, pair.rw, index),
);

/**
 * Daftar RW unik terurut (RW 001 s.d. RW 010)
 */
export function getRwList(): string[] {
  const rwSet = new Set(RT_RW_PAIRS.map((p) => p.rw));
  return Array.from(rwSet).sort();
}

/**
 * Query filter dan transformasi data partisipasi spasial
 */
export function getSpatialParticipationList(params: {
  indicator: ParticipationIndicatorKey;
  rw?: string;
  search?: string;
  classes?: number[];
}): SpatialSummaryItem[] {
  const { indicator, rw, search, classes } = params;

  return MOCK_SPATIAL_PARTICIPATION.filter((record) => {
    // Filter RW
    if (rw && rw !== "all" && record.rw !== rw) {
      return false;
    }

    // Filter Pencarian RT
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      const matchRt = record.rt.toLowerCase().includes(q);
      const matchRw = record.rw.toLowerCase().includes(q);
      if (!matchRt && !matchRw) {
        return false;
      }
    }

    // Filter Kelas
    if (classes && classes.length > 0) {
      const ind = record.indicators[indicator];
      const rate = calculateParticipationRate(ind.numerator, ind.denominator);
      const pClass = getParticipationClass(rate);
      if (pClass !== null && !classes.includes(pClass)) {
        return false;
      }
    }

    return true;
  }).map((record) => {
    const ind = record.indicators[indicator];
    const percentage = calculateParticipationRate(ind.numerator, ind.denominator);
    const participationClass = getParticipationClass(percentage);
    const statusLabel = getParticipationClassName(participationClass);

    return {
      rt: record.rt,
      rw: record.rw,
      indicatorKey: indicator,
      numerator: ind.numerator,
      denominator: ind.denominator,
      percentage,
      participationClass,
      statusLabel,
    };
  });
}

const REPORT_INDICATORS: Array<{
  key: ParticipationIndicatorKey;
  label: string;
  objectType: "rumah" | "kk" | "warga";
  activity: "memilah" | "mengolah";
}> = [
  {
    key: "rumah_memilah",
    label: "Rumah Memilah",
    objectType: "rumah",
    activity: "memilah",
  },
  {
    key: "rumah_mengolah",
    label: "Rumah Mengolah",
    objectType: "rumah",
    activity: "mengolah",
  },
  {
    key: "kk_memilah",
    label: "KK Memilah",
    objectType: "kk",
    activity: "memilah",
  },
  {
    key: "kk_mengolah",
    label: "KK Mengolah",
    objectType: "kk",
    activity: "mengolah",
  },
  {
    key: "warga_memilah",
    label: "Warga Memilah",
    objectType: "warga",
    activity: "memilah",
  },
  {
    key: "warga_mengolah",
    label: "Warga Mengolah",
    objectType: "warga",
    activity: "mengolah",
  },
];

/**
 * Mengambil profil komprehensif RT (seluruh demografi & 6 indikator persampahan)
 * Mematuhi BR-01: Tidak ada nama/identitas warga perorangan
 */
export function getRtFullReport(rt: string, rw: string): RtFullReport | null {
  const normalizedRt = rt.trim().toLowerCase();
  const normalizedRw = rw.trim().toLowerCase();

  const record = MOCK_SPATIAL_PARTICIPATION.find(
    (item) =>
      item.rt.trim().toLowerCase() === normalizedRt &&
      item.rw.trim().toLowerCase() === normalizedRw,
  );

  if (!record) {
    return null;
  }

  const indicators: RtReportIndicatorItem[] = REPORT_INDICATORS.map((meta) => {
    const ind = record.indicators[meta.key];
    const percentage = calculateParticipationRate(ind.numerator, ind.denominator);
    const participationClass = getParticipationClass(percentage);
    const statusLabel = getParticipationClassName(participationClass);

    return {
      key: meta.key,
      label: meta.label,
      objectType: meta.objectType,
      activity: meta.activity,
      numerator: ind.numerator,
      denominator: ind.denominator,
      percentage,
      participationClass,
      statusLabel,
    };
  });

  return {
    rt: record.rt,
    rw: record.rw,
    demographics: {
      totalRumah: record.indicators.rumah_memilah.denominator,
      totalKk: record.indicators.kk_memilah.denominator,
      totalWarga: record.indicators.warga_memilah.denominator,
    },
    indicators,
  };
}

