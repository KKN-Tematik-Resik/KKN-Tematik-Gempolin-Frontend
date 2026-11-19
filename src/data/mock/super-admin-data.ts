// Mock data untuk Super Admin — Daftar Admin Kelurahan (Draft)
// Data ini bersifat dummy/placeholder, belum terhubung backend.

import type { AdminUser } from "@/types/super-admin";

export const mockAdminUsers: AdminUser[] = [
  {
    id: "usr-001",
    namaLengkap: "Budi Santoso",
    username: "budi.santoso",
    kelurahan: "Gempolsari",
    status: "aktif",
    tanggalDibuat: "2024-01-15",
    terakhirLogin: "2024-11-18T08:32:00+07:00",
  },
  {
    id: "usr-002",
    namaLengkap: "Siti Rahayu",
    username: "siti.rahayu",
    kelurahan: "Gempolsari",
    status: "aktif",
    tanggalDibuat: "2024-03-20",
    terakhirLogin: "2024-11-17T14:15:00+07:00",
  },
  {
    id: "usr-003",
    namaLengkap: "Ahmad Fauzi",
    username: "ahmad.fauzi",
    kelurahan: "Gempolsari",
    status: "nonaktif",
    tanggalDibuat: "2024-05-10",
    terakhirLogin: "2024-09-01T09:00:00+07:00",
  },
  {
    id: "usr-004",
    namaLengkap: "Dewi Lestari",
    username: "dewi.lestari",
    kelurahan: "Gempolsari",
    status: "aktif",
    tanggalDibuat: "2024-07-01",
    terakhirLogin: null,
  },
  {
    id: "usr-005",
    namaLengkap: "Reza Firmansyah",
    username: "reza.firmansyah",
    kelurahan: "Gempolsari",
    status: "nonaktif",
    tanggalDibuat: "2024-08-22",
    terakhirLogin: "2024-10-05T11:00:00+07:00",
  },
];
