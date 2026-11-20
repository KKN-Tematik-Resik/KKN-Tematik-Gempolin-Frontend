import type {
  DemografiDataset,
  DemografiRtData,
  DemografiRwData,
} from "@/types/demografi";
import { aggregateDemografiMetrics } from "@/utils/calculations";

// Data per RT di Kelurahan Gempolsari (RW 01 s.d. RW 06)
const rawRtData: Record<string, Omit<DemografiRtData, "id" | "kodeRw">[]> = {
  "RW 01": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 110, memilah: 85, mengolah: 58 },
      kk: { terdata: 125, memilah: 95, mengolah: 62 },
      warga: { terdata: 420, memilah: 320, mengolah: 210 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 95, memilah: 72, mengolah: 46 },
      kk: { terdata: 105, memilah: 80, mengolah: 50 },
      warga: { terdata: 360, memilah: 275, mengolah: 170 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 130, memilah: 102, mengolah: 74 },
      kk: { terdata: 145, memilah: 115, mengolah: 82 },
      warga: { terdata: 490, memilah: 390, mengolah: 278 },
    },
    {
      kodeRt: "RT 04",
      namaRt: "RT 04",
      rumah: { terdata: 88, memilah: 60, mengolah: 38 },
      kk: { terdata: 98, memilah: 68, mengolah: 42 },
      warga: { terdata: 330, memilah: 230, mengolah: 145 },
    },
  ],
  "RW 02": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 140, memilah: 112, mengolah: 80 },
      kk: { terdata: 155, memilah: 124, mengolah: 88 },
      warga: { terdata: 520, memilah: 415, mengolah: 295 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 105, memilah: 78, mengolah: 52 },
      kk: { terdata: 118, memilah: 86, mengolah: 58 },
      warga: { terdata: 395, memilah: 290, mengolah: 195 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 120, memilah: 94, mengolah: 66 },
      kk: { terdata: 132, memilah: 104, mengolah: 72 },
      warga: { terdata: 440, memilah: 350, mengolah: 242 },
    },
  ],
  "RW 03": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 90, memilah: 65, mengolah: 40 },
      kk: { terdata: 100, memilah: 72, mengolah: 44 },
      warga: { terdata: 340, memilah: 245, mengolah: 150 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 115, memilah: 88, mengolah: 60 },
      kk: { terdata: 128, memilah: 98, mengolah: 66 },
      warga: { terdata: 430, memilah: 330, mengolah: 222 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 80, memilah: 55, mengolah: 34 },
      kk: { terdata: 90, memilah: 62, mengolah: 38 },
      warga: { terdata: 300, memilah: 208, mengolah: 128 },
    },
    {
      kodeRt: "RT 04",
      namaRt: "RT 04",
      rumah: { terdata: 105, memilah: 82, mengolah: 55 },
      kk: { terdata: 116, memilah: 91, mengolah: 61 },
      warga: { terdata: 390, memilah: 305, mengolah: 205 },
    },
  ],
  "RW 04": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 125, memilah: 96, mengolah: 68 },
      kk: { terdata: 138, memilah: 106, mengolah: 75 },
      warga: { terdata: 465, memilah: 360, mengolah: 255 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 100, memilah: 75, mengolah: 48 },
      kk: { terdata: 112, memilah: 84, mengolah: 54 },
      warga: { terdata: 375, memilah: 280, mengolah: 180 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 110, memilah: 84, mengolah: 56 },
      kk: { terdata: 122, memilah: 93, mengolah: 62 },
      warga: { terdata: 410, memilah: 312, mengolah: 208 },
    },
  ],
  "RW 05": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 85, memilah: 62, mengolah: 41 },
      kk: { terdata: 95, memilah: 69, mengolah: 45 },
      warga: { terdata: 320, memilah: 232, mengolah: 152 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 100, memilah: 76, mengolah: 50 },
      kk: { terdata: 110, memilah: 84, mengolah: 55 },
      warga: { terdata: 370, memilah: 282, mengolah: 185 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 95, memilah: 70, mengolah: 45 },
      kk: { terdata: 106, memilah: 78, mengolah: 50 },
      warga: { terdata: 355, memilah: 260, mengolah: 168 },
    },
  ],
  "RW 06": [
    {
      kodeRt: "RT 01",
      namaRt: "RT 01",
      rumah: { terdata: 130, memilah: 105, mengolah: 75 },
      kk: { terdata: 145, memilah: 116, mengolah: 83 },
      warga: { terdata: 485, memilah: 390, mengolah: 280 },
    },
    {
      kodeRt: "RT 02",
      namaRt: "RT 02",
      rumah: { terdata: 115, memilah: 89, mengolah: 61 },
      kk: { terdata: 128, memilah: 98, mengolah: 67 },
      warga: { terdata: 430, memilah: 330, mengolah: 225 },
    },
    {
      kodeRt: "RT 03",
      namaRt: "RT 03",
      rumah: { terdata: 105, memilah: 80, mengolah: 54 },
      kk: { terdata: 116, memilah: 88, mengolah: 60 },
      warga: { terdata: 390, memilah: 298, mengolah: 202 },
    },
    {
      kodeRt: "RT 04",
      namaRt: "RT 04",
      rumah: { terdata: 90, memilah: 68, mengolah: 44 },
      kk: { terdata: 100, memilah: 75, mengolah: 49 },
      warga: { terdata: 335, memilah: 252, mengolah: 165 },
    },
    // RT 05: Wilayah dengan data belum terdata (0)
    {
      kodeRt: "RT 05",
      namaRt: "RT 05",
      rumah: { terdata: 0, memilah: 0, mengolah: 0 },
      kk: { terdata: 0, memilah: 0, mengolah: 0 },
      warga: { terdata: 0, memilah: 0, mengolah: 0 },
    },
  ],
};

// Bangun struktur DemografiRwData dengan agregasi murni
export const mockDaftarRw: DemografiRwData[] = Object.entries(rawRtData).map(
  ([kodeRw, rtList]) => {
    const daftarRt: DemografiRtData[] = rtList.map((rt) => ({
      ...rt,
      id: `${kodeRw}-${rt.kodeRt}`,
      kodeRw,
    }));

    return {
      id: kodeRw,
      kodeRw,
      namaRw: kodeRw,
      rumah: aggregateDemografiMetrics(daftarRt.map((rt) => rt.rumah)),
      kk: aggregateDemografiMetrics(daftarRt.map((rt) => rt.kk)),
      warga: aggregateDemografiMetrics(daftarRt.map((rt) => rt.warga)),
      daftarRt,
    };
  },
);

// Agregasi seluruh RW untuk tingkat Kelurahan Gempolsari
export const mockKelurahanSummary = {
  rumah: aggregateDemografiMetrics(mockDaftarRw.map((rw) => rw.rumah)),
  kk: aggregateDemografiMetrics(mockDaftarRw.map((rw) => rw.kk)),
  warga: aggregateDemografiMetrics(mockDaftarRw.map((rw) => rw.warga)),
};

export const mockDemografiDataset: DemografiDataset = {
  periode: "2026-11",
  label: "November 2026",
  summary: mockKelurahanSummary,
  daftarRw: mockDaftarRw,
};
