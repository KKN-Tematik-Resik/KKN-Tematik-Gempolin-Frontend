"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import type { AdminFormValues, AdminUser } from "@/types/super-admin";
import { useEffect, useState } from "react";

interface AdminFormModalProps {
  mode: "create" | "edit";
  adminData: AdminUser | null;
  onClose: () => void;
  onSave: (values: AdminFormValues, id?: string) => void;
}

export default function AdminFormModal({
  mode,
  adminData,
  onClose,
  onSave,
}: AdminFormModalProps) {
  const isEdit = mode === "edit";

  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [kelurahan, setKelurahan] = useState("Gempolsari");
  const [status, setStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<AdminFormValues>>({});

  useEffect(() => {
    if (isEdit && adminData) {
      setNamaLengkap(adminData.namaLengkap);
      setUsername(adminData.username);
      setKelurahan(adminData.kelurahan);
      setStatus(adminData.status);
      setPassword("");
    } else {
      setNamaLengkap("");
      setUsername("");
      setKelurahan("Gempolsari");
      setStatus("aktif");
      setPassword("");
    }
    setShowPassword(false);
    setErrors({});
  }, [isEdit, adminData]);

  function validate(): boolean {
    const newErrors: Partial<AdminFormValues> = {};
    if (!namaLengkap.trim()) newErrors.namaLengkap = "Nama lengkap wajib diisi";
    if (!username.trim()) newErrors.username = "Username wajib diisi";
    if (!isEdit && !password.trim())
      newErrors.password = "Password wajib diisi untuk akun baru";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave(
      { namaLengkap, username, kelurahan, status, password },
      isEdit && adminData ? adminData.id : undefined,
    );
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Akun Admin" : "Tambah Akun Admin"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi akun Admin Kelurahan."
              : "Buat akun baru untuk Admin Kelurahan Gempolsari."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nama Lengkap */}
          <Field>
            <Label htmlFor="nama-lengkap">Nama Lengkap</Label>
            <Input
              id="nama-lengkap"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Contoh: Budi Santoso"
            />
            {errors.namaLengkap && (
              <p className="text-xs text-red-500">{errors.namaLengkap}</p>
            )}
          </Field>

          {/* Username */}
          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: budi.santoso"
              autoComplete="off"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </Field>

          {/* Kelurahan */}
          <Field>
            <Label htmlFor="kelurahan">Kelurahan</Label>
            <Input
              id="kelurahan"
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              placeholder="Gempolsari"
            />
          </Field>

          {/* Status */}
          <Field>
            <Label>Status Akun</Label>
            <div className="flex gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="aktif"
                  checked={status === "aktif"}
                  onChange={() => setStatus("aktif")}
                  className="accent-brand-600"
                />
                <Badge variant="light" color="success" size="sm">
                  Aktif
                </Badge>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="nonaktif"
                  checked={status === "nonaktif"}
                  onChange={() => setStatus("nonaktif")}
                  className="accent-brand-600"
                />
                <Badge variant="light" color="gray" size="sm">
                  Nonaktif
                </Badge>
              </label>
            </div>
          </Field>

          {/* Password */}
          <Field>
            <Label htmlFor="password">
              {isEdit ? "Password Baru (opsional)" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  isEdit ? "Kosongkan jika tidak diubah" : "Buat password"
                }
                autoComplete="new-password"
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeCloseIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Simpan Perubahan" : "Buat Akun"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
