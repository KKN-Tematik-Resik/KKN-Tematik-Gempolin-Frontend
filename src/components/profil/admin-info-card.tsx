"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CameraIcon, PencilIcon } from "@/icons";
import { useState } from "react";
import type { PersonalInfo } from "@/types/profil";

interface AdminInfoCardProps {
  initialData: PersonalInfo;
}

export default function AdminInfoCard({ initialData }: AdminInfoCardProps) {
  const [data, setData] = useState<PersonalInfo>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(initialData);

  const handleOpen = () => {
    setFormData(data);
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setData(formData);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        {/* Header: Title & Edit Button */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            Informasi Admin
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="gap-2"
          >
            <PencilIcon className="size-4.5" />
            <span>Ubah</span>
          </Button>
        </div>

        {/* Profile Pic & Basic Meta */}
        <div className="mt-4 flex items-center gap-4 sm:gap-6">
          <Avatar className="size-16 shrink-0 rounded-2xl ring-2 ring-brand-500/20 sm:size-20">
            <AvatarFallback className="rounded-2xl bg-brand-500 text-xl font-bold text-white sm:text-2xl dark:bg-brand-600">
              AG
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h4 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
              {data.fullName}
            </h4>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              <span>{data.role}</span>
              <span className="inline-block h-3.5 w-px bg-gray-300 dark:bg-gray-700" />
              <span>{data.location}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Nama Lengkap
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {data.fullName}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Bio
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {data.bio}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Alamat Email Dinas
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {data.email}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Nomor Telepon Kantor
            </p>
            <p className="text-sm font-medium tabular-nums text-gray-800 sm:text-base dark:text-white/90">
              {data.phone}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Personal Information Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[calc(100%-2rem)] rounded-3xl p-6 sm:max-w-146 sm:p-8">
          <DialogHeader className="gap-1.5 text-start">
            <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
              Ubah Informasi Admin
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Perbarui informasi profil akun Anda agar tetap mutakhir.
            </DialogDescription>
          </DialogHeader>

          {/* Bagian Ubah Foto Profil (Tampilan Saja, Tanpa Logic) */}
          <div className="mt-5 space-y-3 border-b border-gray-100 pb-5 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Ubah Foto Profil
            </h4>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <Avatar className="size-20 shrink-0 rounded-2xl ring-2 ring-brand-500/20 sm:size-22">
                  <AvatarFallback className="rounded-2xl bg-brand-500 text-2xl font-bold text-white dark:bg-brand-600">
                    AG
                  </AvatarFallback>
                </Avatar>

                {/* Tombol Kamera Overlay (Tampilan Saja) */}
                <button
                  type="button"
                  className="absolute -bottom-1 -end-1 flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="Ubah foto profil"
                >
                  <CameraIcon className="size-4.5" />
                </button>
              </div>

              <div className="flex flex-col gap-0.5 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Unggah foto persegi (200×200 px)
                </p>
                <p>dalam format JPEG atau PNG.</p>
              </div>
            </div>
          </div>

          {/* Form Input Detail Informasi Pribadi */}
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Informasi Pribadi
            </h4>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="fullName">
                Nama Lengkap <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="email">
                  Alamat Email <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="phone">
                  Nomor Telepon <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Field>
            </div>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="bio">Deskripsi Tugas</FieldLabel>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </Field>

            <DialogFooter className="gap-3 pt-4 sm:justify-end">
              <DialogClose
                render={
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                }
              />
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
