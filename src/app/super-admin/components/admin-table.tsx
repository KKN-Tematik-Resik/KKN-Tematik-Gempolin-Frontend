"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashBinIcon,
  UserIcon,
} from "@/icons";
import type { AdminStatus, AdminUser } from "@/types/super-admin";
import { useMemo, useState } from "react";

interface AdminTableProps {
  admins: AdminUser[];
  onAddNew: () => void;
  onEdit: (admin: AdminUser) => void;
  onDelete: (admin: AdminUser) => void;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return "Belum pernah login";
  try {
    const d = new Date(isoString);
    const datePart = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    const timePart = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
    return `${datePart}, ${timePart} WIB`;
  } catch {
    return isoString;
  }
}

export default function AdminTable({
  admins,
  onAddNew,
  onEdit,
  onDelete,
}: AdminTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminStatus>("all");

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchSearch =
        admin.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
        admin.username.toLowerCase().includes(search.toLowerCase()) ||
        admin.kelurahan.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : admin.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [admins, search, statusFilter]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Header Bar: Filter, Pencarian, & Tombol Tambah */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Pencarian */}
          <div className="relative w-full max-w-xs">
            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
              <SearchIcon className="size-4" />
            </span>
            <Input
              type="text"
              placeholder="Cari nama atau username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Status:
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-800 dark:bg-gray-800/60">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("aktif")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === "aktif"
                    ? "bg-white text-emerald-700 shadow-xs dark:bg-gray-700 dark:text-emerald-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("nonaktif")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === "nonaktif"
                    ? "bg-white text-gray-700 shadow-xs dark:bg-gray-700 dark:text-gray-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Nonaktif
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Tambah Admin Baru */}
        <div>
          <Button
            onClick={onAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5"
          >
            <PlusIcon className="size-4" />
            <span>Tambah Admin</span>
          </Button>
        </div>
      </div>

      {/* Tabel Data Admin */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40">
              <TableCell isHeader className="py-3.5 ps-4 pe-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Nama Lengkap
              </TableCell>
              <TableCell isHeader className="py-3.5 px-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Username
              </TableCell>
              <TableCell isHeader className="py-3.5 px-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Kelurahan
              </TableCell>
              <TableCell isHeader className="py-3.5 px-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="py-3.5 px-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tanggal Dibuat
              </TableCell>
              <TableCell isHeader className="py-3.5 px-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Terakhir Login
              </TableCell>
              <TableCell isHeader className="py-3.5 ps-3 pe-4 text-end text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserIcon className="size-8 text-gray-300 dark:text-gray-600" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      Tidak ada akun admin yang cocok
                    </p>
                    <p className="text-xs text-gray-400">
                      Coba ubah kata kunci pencarian atau filter status.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50/70 dark:border-gray-800/80 dark:hover:bg-gray-800/40"
                >
                  {/* Nama Lengkap */}
                  <TableCell className="py-3.5 ps-4 pe-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {admin.namaLengkap
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {admin.namaLengkap}
                      </span>
                    </div>
                  </TableCell>

                  {/* Username */}
                  <TableCell className="py-3.5 px-3">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      @{admin.username}
                    </span>
                  </TableCell>

                  {/* Kelurahan */}
                  <TableCell className="py-3.5 px-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {admin.kelurahan}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 px-3">
                    {admin.status === "aktif" ? (
                      <Badge variant="light" color="success" size="sm">
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="light" color="gray" size="sm">
                        Nonaktif
                      </Badge>
                    )}
                  </TableCell>

                  {/* Tanggal Dibuat */}
                  <TableCell className="py-3.5 px-3">
                    <span className="text-xs tabular-nums text-gray-600 dark:text-gray-400">
                      {formatDate(admin.tanggalDibuat)}
                    </span>
                  </TableCell>

                  {/* Terakhir Login */}
                  <TableCell className="py-3.5 px-3">
                    <span
                      className={`text-xs tabular-nums ${
                        admin.terakhirLogin
                          ? "text-gray-600 dark:text-gray-400"
                          : "italic text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {formatDateTime(admin.terakhirLogin)}
                    </span>
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="py-3.5 ps-3 pe-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(admin)}
                        className="text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                        title="Edit Akun"
                      >
                        <PencilIcon className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(admin)}
                        className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        title="Hapus Akun"
                      >
                        <TrashBinIcon className="size-4" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div>
          Menampilkan <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{filteredAdmins.length}</span> dari <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{admins.length}</span> akun admin
        </div>
      </div>
    </div>
  );
}
