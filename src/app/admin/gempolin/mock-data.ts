import type {
  GempolinBulananSummary,
  GempolinHarian,
  GempolinMockData,
  GempolinRtSummary,
} from "@/types/gempolin";

const harian: GempolinHarian[] = [
  { tanggal: "2026-11-01", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 78, beratVerifikasi: 82 },
  { tanggal: "2026-11-02", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 65, beratVerifikasi: 68 },
  { tanggal: "2026-11-03", rwId: "RW-02", rwNama: "RW 02", rtId: "RW-02-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 82, beratVerifikasi: 85 },
  { tanggal: "2026-11-04", rwId: "RW-02", rwNama: "RW 02", rtId: "RW-02-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 70, beratVerifikasi: 74 },
  { tanggal: "2026-11-05", rwId: "RW-03", rwNama: "RW 03", rtId: "RW-03-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 88, beratVerifikasi: 92 },
  { tanggal: "2026-11-06", rwId: "RW-03", rwNama: "RW 03", rtId: "RW-03-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 60, beratVerifikasi: 63 },
  { tanggal: "2026-11-07", rwId: "RW-04", rwNama: "RW 04", rtId: "RW-04-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 95, beratVerifikasi: 100 },
  { tanggal: "2026-11-08", rwId: "RW-04", rwNama: "RW 04", rtId: "RW-04-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 72, beratVerifikasi: 75 },
  { tanggal: "2026-11-09", rwId: "RW-05", rwNama: "RW 05", rtId: "RW-05-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 85, beratVerifikasi: 89 },
  { tanggal: "2026-11-10", rwId: "RW-05", rwNama: "RW 05", rtId: "RW-05-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 68, beratVerifikasi: 71 },
  { tanggal: "2026-11-11", rwId: "RW-06", rwNama: "RW 06", rtId: "RW-06-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 79, beratVerifikasi: 83 },
  { tanggal: "2026-11-12", rwId: "RW-06", rwNama: "RW 06", rtId: "RW-06-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 55, beratVerifikasi: 58 },
  { tanggal: "2026-11-13", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-03", rtNama: "RT 03", requestCount: 2, beratTerolah: 92, beratVerifikasi: 96 },
  { tanggal: "2026-11-14", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-04", rtNama: "RT 04", requestCount: 2, beratTerolah: 81, beratVerifikasi: 84 },
  { tanggal: "2026-11-15", rwId: "RW-02", rwNama: "RW 02", rtId: "RW-02-RT-03", rtNama: "RT 03", requestCount: 2, beratTerolah: 90, beratVerifikasi: 95 },
  { tanggal: "2026-11-16", rwId: "RW-03", rwNama: "RW 03", rtId: "RW-03-RT-03", rtNama: "RT 03", requestCount: 1, beratTerolah: 64, beratVerifikasi: 67 },
  { tanggal: "2026-11-17", rwId: "RW-03", rwNama: "RW 03", rtId: "RW-03-RT-04", rtNama: "RT 04", requestCount: 2, beratTerolah: 77, beratVerifikasi: 81 },
  { tanggal: "2026-11-18", rwId: "RW-04", rwNama: "RW 04", rtId: "RW-04-RT-03", rtNama: "RT 03", requestCount: 1, beratTerolah: 58, beratVerifikasi: 61 },
  { tanggal: "2026-11-19", rwId: "RW-05", rwNama: "RW 05", rtId: "RW-05-RT-03", rtNama: "RT 03", requestCount: 2, beratTerolah: 86, beratVerifikasi: 90 },
  { tanggal: "2026-11-20", rwId: "RW-06", rwNama: "RW 06", rtId: "RW-06-RT-03", rtNama: "RT 03", requestCount: 2, beratTerolah: 74, beratVerifikasi: 78 },
  { tanggal: "2026-11-21", rwId: "RW-06", rwNama: "RW 06", rtId: "RW-06-RT-04", rtNama: "RT 04", requestCount: 2, beratTerolah: 91, beratVerifikasi: 95 },
  { tanggal: "2026-11-22", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-01", rtNama: "RT 01", requestCount: 1, beratTerolah: 66, beratVerifikasi: 69 },
  { tanggal: "2026-11-23", rwId: "RW-02", rwNama: "RW 02", rtId: "RW-02-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 83, beratVerifikasi: 87 },
  { tanggal: "2026-11-24", rwId: "RW-03", rwNama: "RW 03", rtId: "RW-03-RT-01", rtNama: "RT 01", requestCount: 1, beratTerolah: 59, beratVerifikasi: 62 },
  { tanggal: "2026-11-25", rwId: "RW-04", rwNama: "RW 04", rtId: "RW-04-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 89, beratVerifikasi: 94 },
  { tanggal: "2026-11-26", rwId: "RW-05", rwNama: "RW 05", rtId: "RW-05-RT-01", rtNama: "RT 01", requestCount: 1, beratTerolah: 76, beratVerifikasi: 79 },
  { tanggal: "2026-11-27", rwId: "RW-06", rwNama: "RW 06", rtId: "RW-06-RT-01", rtNama: "RT 01", requestCount: 2, beratTerolah: 84, beratVerifikasi: 88 },
  { tanggal: "2026-11-28", rwId: "RW-01", rwNama: "RW 01", rtId: "RW-01-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 63, beratVerifikasi: 65 },
  { tanggal: "2026-11-29", rwId: "RW-02", rwNama: "RW 02", rtId: "RW-02-RT-02", rtNama: "RT 02", requestCount: 2, beratTerolah: 85, beratVerifikasi: 89 },
  { tanggal: "2026-11-30", rwId: "RW-04", rwNama: "RW 04", rtId: "RW-04-RT-02", rtNama: "RT 02", requestCount: 1, beratTerolah: 70, beratVerifikasi: 73 },
];

// Turunkan rekap per RT (dengan konteks RW) dan total periode langsung dari catatan harian
const perRtMap = new Map<string, GempolinRtSummary>();
for (const item of harian) {
  const existing = perRtMap.get(item.rtId);
  if (existing) {
    existing.totalRequest += item.requestCount;
    existing.totalTerolah += item.beratTerolah;
    existing.totalVerifikasi += item.beratVerifikasi;
  } else {
    perRtMap.set(item.rtId, {
      rwId: item.rwId,
      rwNama: item.rwNama,
      rtId: item.rtId,
      rtNama: item.rtNama,
      totalRequest: item.requestCount,
      totalTerolah: item.beratTerolah,
      totalVerifikasi: item.beratVerifikasi,
    });
  }
}

const perRt: GempolinRtSummary[] = Array.from(perRtMap.values()).sort((a, b) =>
  a.rtId.localeCompare(b.rtId),
);

const totalRequest = harian.reduce((sum, item) => sum + item.requestCount, 0);
const totalTerolah = harian.reduce((sum, item) => sum + item.beratTerolah, 0);
const totalVerifikasi = harian.reduce(
  (sum, item) => sum + item.beratVerifikasi,
  0,
);

export const riwayatBulanan12Bulan: GempolinBulananSummary[] = [
  { periode: "2025-12", label: "Desember 2025", singkatan: "Des 25", totalRequest: 36, totalTerolah: 1780, totalVerifikasi: 1850 },
  { periode: "2026-01", label: "Januari 2026", singkatan: "Jan 26", totalRequest: 38, totalTerolah: 1850, totalVerifikasi: 1920 },
  { periode: "2026-02", label: "Februari 2026", singkatan: "Feb 26", totalRequest: 35, totalTerolah: 1720, totalVerifikasi: 1790 },
  { periode: "2026-03", label: "Maret 2026", singkatan: "Mar 26", totalRequest: 40, totalTerolah: 1940, totalVerifikasi: 2010 },
  { periode: "2026-04", label: "April 2026", singkatan: "Apr 26", totalRequest: 42, totalTerolah: 2050, totalVerifikasi: 2130 },
  { periode: "2026-05", label: "Mei 2026", singkatan: "Mei 26", totalRequest: 45, totalTerolah: 2180, totalVerifikasi: 2260 },
  { periode: "2026-06", label: "Juni 2026", singkatan: "Jun 26", totalRequest: 43, totalTerolah: 2100, totalVerifikasi: 2180 },
  { periode: "2026-07", label: "Juli 2026", singkatan: "Jul 26", totalRequest: 46, totalTerolah: 2240, totalVerifikasi: 2320 },
  { periode: "2026-08", label: "Agustus 2026", singkatan: "Agu 26", totalRequest: 48, totalTerolah: 2310, totalVerifikasi: 2390 },
  { periode: "2026-09", label: "September 2026", singkatan: "Sep 26", totalRequest: 44, totalTerolah: 2160, totalVerifikasi: 2240 },
  { periode: "2026-10", label: "Oktober 2026", singkatan: "Okt 26", totalRequest: 42, totalTerolah: 2100, totalVerifikasi: 2190 },
  { periode: "2026-11", label: "November 2026", singkatan: "Nov 26", totalRequest, totalTerolah, totalVerifikasi },
];

export const gempolinMockData: GempolinMockData = {
  periode: {
    periode: "2026-11",
    label: "November 2026",
    totalRequest,
    totalTerolah,
  },
  periodeSebelumnya: {
    periode: "2026-10",
    label: "Oktober 2026",
    totalRequest: 42,
    totalTerolah: 2100,
  },
  riwayatBulanan: riwayatBulanan12Bulan,
  perRt,
  harian,
};

export function getDailyDataForMonth(
  periode: string,
  baseHarian: GempolinHarian[],
): GempolinHarian[] {
  if (periode === "2026-11") {
    return baseHarian;
  }
  const [yearStr, monthStr] = periode.split("-");
  const year = Number(yearStr) || 2026;
  const month = Number(monthStr) || 11;
  const daysInMonth = new Date(year, month, 0).getDate();

  return baseHarian.map((item) => {
    const rawDay = Number(item.tanggal.slice(8, 10)) || 1;
    const day = Math.min(rawDay, daysInMonth);
    const dayStr = String(day).padStart(2, "0");
    return {
      ...item,
      tanggal: `${periode}-${dayStr}`,
    };
  });
}

