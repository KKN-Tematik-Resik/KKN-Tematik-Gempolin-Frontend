"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CheckCircleIcon, EyeCloseIcon, EyeIcon, LockIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePasswordSchema, type ChangePasswordFormData } from "./schema";

export default function ChangePasswordCard() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async () => {
    // Simulasi pembaruan kata sandi aman (frontend dummy)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSuccess(true);
    reset();
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <Card className="flex flex-col justify-between border border-gray-200 p-5 sm:p-6 lg:p-7 dark:border-gray-800">
      <div>
        <CardHeader className="border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <LockIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
                Keamanan & Ganti Kata Sandi
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                Perbarui kata sandi akun secara berkala untuk menjaga keamanan akses
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {isSuccess && (
          <div className="mt-4">
            <Alert variant="success">
              <CheckCircleIcon className="size-4" />
              <AlertTitle>Berhasil Diperbarui</AlertTitle>
              <AlertDescription>
                Kata sandi akun Admin Kelurahan telah berhasil diganti. Gunakan sandi baru pada login berikutnya.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          {/* Kata Sandi Saat Ini */}
          <Field data-invalid={Boolean(errors.currentPassword)} className="gap-1.5">
            <FieldLabel htmlFor="currentPassword">Kata Sandi Saat Ini</FieldLabel>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Masukkan kata sandi saat ini"
                aria-invalid={errors.currentPassword ? "true" : undefined}
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showCurrentPassword ? (
                  <EyeCloseIcon className="size-4.5" />
                ) : (
                  <EyeIcon className="size-4.5" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.currentPassword]} />
          </Field>

          {/* Kata Sandi Baru */}
          <Field data-invalid={Boolean(errors.newPassword)} className="gap-1.5">
            <FieldLabel htmlFor="newPassword">Kata Sandi Baru</FieldLabel>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Minimal 8 karakter, 1 huruf besar, 1 angka"
                aria-invalid={errors.newPassword ? "true" : undefined}
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showNewPassword ? (
                  <EyeCloseIcon className="size-4.5" />
                ) : (
                  <EyeIcon className="size-4.5" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.newPassword]} />
          </Field>

          {/* Konfirmasi Kata Sandi Baru */}
          <Field data-invalid={Boolean(errors.confirmPassword)} className="gap-1.5">
            <FieldLabel htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Ketik ulang kata sandi baru"
                aria-invalid={errors.confirmPassword ? "true" : undefined}
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showConfirmPassword ? (
                  <EyeCloseIcon className="size-4.5" />
                ) : (
                  <EyeIcon className="size-4.5" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-300">Syarat Kata Sandi:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Minimal 8 karakter</li>
              <li>Mengandung minimal 1 huruf kapital (A-Z)</li>
              <li>Mengandung minimal 1 angka (0-9)</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Menyimpan Perubahan..." : "Simpan Kata Sandi"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
