export type SourceStatusType = "mutakhir" | "perlu_pembaruan";

export interface SourceStatusItem {
  id: string;
  namaSumber: string;
  kategori: string;
  frekuensi: string;
  periodeLaporan: string;
  waktuSumber: string;
  waktuImpor: string;
  status: SourceStatusType;
  keterangan: string;
}

export type AuditStatusType = "sukses" | "rollback";

export interface SyncAuditLogItem {
  id: string;
  waktuImpor: string;
  namaBerkas: string;
  sumberData: string;
  adminPelaksana: string;
  barisBerhasil: number;
  barisDitolak: number;
  status: AuditStatusType;
  catatan: string;
}

export interface SyncSummaryStats {
  statusSistem: "normal" | "perlu_tindakan";
  totalSumber: number;
  sumberMutakhir: number;
  sumberPerluPembaruan: number;
  totalImporBulanIni: number;
}
