export interface GempolinHarian {
  tanggal: string; // ISO date string "YYYY-MM-DD", zona WIB
  beratTerolah: number; // kg, berat yang benar-benar diolah
  beratVerifikasi: number; // kg, berat setelah verifikasi (berbeda makna — BR-03)
  rtId: string; // e.g. "RT-01"
  rtNama: string; // e.g. "RT 01"
  requestCount: number; // jumlah request pengolahan hari itu
}

export interface GempolinRtSummary {
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
