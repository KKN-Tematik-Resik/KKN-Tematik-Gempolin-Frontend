"use client";

import PageBreadcrumb from "@/components/common/page-breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  GroupIcon,
  XIcon,
} from "@/icons";
import type { AdminFormValues, AdminModalMode, AdminUser } from "@/types/super-admin";
import { useState } from "react";
import AdminFormModal from "./admin-form-modal";
import AdminTable from "./admin-table";
import DeleteConfirmModal from "./delete-confirm-modal";

interface SuperAdminShellProps {
  initialAdmins: AdminUser[];
}

function createNewAdmin(values: AdminFormValues, currentCount: number): AdminUser {
  const idSuffix = String(currentCount + 1).padStart(3, "0");
  const today = new Date().toISOString().split("T")[0];
  return {
    id: `usr-${idSuffix}`,
    namaLengkap: values.namaLengkap,
    username: values.username,
    kelurahan: values.kelurahan,
    status: values.status,
    tanggalDibuat: today,
    terakhirLogin: null,
  };
}

export default function SuperAdminShell({
  initialAdmins,
}: SuperAdminShellProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [modalMode, setModalMode] = useState<AdminModalMode>("closed");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminUser | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Perhitungan KPI Ringkasan
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.status === "aktif").length;
  const inactiveAdmins = totalAdmins - activeAdmins;

  // Handler CRUD
  const handleAddNew = () => {
    setSelectedAdmin(null);
    setModalMode("create");
  };

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setModalMode("edit");
  };

  const handleDeleteRequest = (admin: AdminUser) => {
    setDeleteAdminTarget(admin);
  };

  const handleSave = (values: AdminFormValues, id?: string) => {
    if (id) {
      // Edit mode
      setAdmins((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                namaLengkap: values.namaLengkap,
                username: values.username,
                kelurahan: values.kelurahan,
                status: values.status,
              }
            : item,
        ),
      );
      showToast(`Akun ${values.namaLengkap} berhasil diperbarui.`);
    } else {
      // Create mode
      const newAdmin = createNewAdmin(values, admins.length);
      setAdmins((prev) => [newAdmin, ...prev]);
      showToast(`Akun admin baru ${values.namaLengkap} berhasil ditambahkan.`);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const target = admins.find((a) => a.id === id);
    setAdmins((prev) => prev.filter((item) => item.id !== id));
    showToast(`Akun ${target?.namaLengkap ?? "admin"} telah dihapus.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Sambutan & Breadcrumb */}
      <div className="space-y-2">
        <PageBreadcrumb pageTitle="Kelola Admin" />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
              Halo, Super Admin 👋
            </h1>
            <Badge variant="light" color="primary" size="sm">
              Draft Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Toast Notifikasi Feedback */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-xs dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
            aria-label="Tutup notifikasi"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {/* Ringkasan Akun (Mini KPI Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Akun Admin
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              <GroupIcon className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
            {totalAdmins}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Kelurahan Gempolsari
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Admin Aktif
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircleIcon className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {activeAdmins}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Memiliki hak akses aktif
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Admin Nonaktif
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <XIcon className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-gray-600 dark:text-gray-400">
            {inactiveAdmins}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Akses sementara dinonaktifkan
          </p>
        </div>
      </div>

      {/* Tabel Data Admin */}
      <AdminTable
        admins={admins}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {/* Modal Tambah/Edit */}
      {modalMode !== "closed" && (
        <AdminFormModal
          mode={modalMode}
          adminData={selectedAdmin}
          onClose={() => setModalMode("closed")}
          onSave={handleSave}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteAdminTarget && (
        <DeleteConfirmModal
          adminData={deleteAdminTarget}
          onClose={() => setDeleteAdminTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
