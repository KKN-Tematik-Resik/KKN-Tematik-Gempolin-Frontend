// Super Admin — TypeScript Types (Draft)
// Fitur ini di luar SRS resmi, bersifat rekayasa sementara (draft).
// Peran Super Admin: hanya CRUD akun Admin Kelurahan.

export type AdminStatus = "aktif" | "nonaktif";

export interface AdminUser {
  id: string;
  namaLengkap: string;
  username: string;
  kelurahan: string;
  status: AdminStatus;
  tanggalDibuat: string; // ISO date string
  terakhirLogin: string | null; // ISO date string, null jika belum pernah login
}

// Form state untuk Create / Edit
export interface AdminFormValues {
  namaLengkap: string;
  username: string;
  kelurahan: string;
  status: AdminStatus;
  password: string; // Wajib saat Create, opsional saat Edit (kosong = tidak diubah)
}

export type AdminModalMode = "create" | "edit" | "closed";
