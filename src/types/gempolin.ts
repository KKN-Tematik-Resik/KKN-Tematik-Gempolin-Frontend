export interface GempolinHarian {
  tanggal: string; // ISO date string "YYYY-MM-DD", zona WIB
  beratTerolah: number; // kg, berat yang benar-benar diolah
  beratVerifikasi: number; // kg, berat setelah verifikasi
  rwId: string; // e.g. "RW-01"
  rwNama: string; // e.g. "RW 01"
  rtId: string; // e.g. "RW-01-RT-01"
  rtNama: string; // e.g. "RT 01"
  requestCount: number; // jumlah request pengolahan hari itu
}

export interface GempolinRtSummary {
  rwId: string;
  rwNama: string;
  rtId: string;
  rtNama: string;
  totalRequest: number;
  totalTerolah: number; // kg
  totalVerifikasi: number; // kg
}

export interface GempolinPeriodeSummary {
  periode: string; // "2026-11" (YYYY-MM)
  label: string; // "November 2026"
  totalRequest: number;
  totalTerolah: number; // kg
}

export interface GempolinMockData {
  periode: GempolinPeriodeSummary;
  periodeSebelumnya: GempolinPeriodeSummary;
  harian: GempolinHarian[];
  perRt: GempolinRtSummary[];
}
