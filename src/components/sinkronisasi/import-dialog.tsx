"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { CheckCircleIcon, DocIcon, DownloadIcon, UploadIcon } from "@/icons";
import type { SourceStatusItem } from "@/types/sinkronisasi";

interface ImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceStatusItem | null;
}

export default function ImportDialog({
  isOpen,
  onOpenChange,
  source,
}: ImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.round(file.size / 1024);
      setSelectedFile({
        name: file.name,
        size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
      });
      setIsSuccess(false);
    }
  };

  const handleSimulateSelect = () => {
    setSelectedFile({
      name: `data_${source?.id ?? "sumber"}_nov_2026.xlsx`,
      size: "248 KB",
    });
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedFile(null);
      onOpenChange(false);
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[calc(100%-2rem)] rounded-3xl p-6 sm:max-w-146 sm:p-8">
        <DialogHeader className="gap-1.5 text-start">
          <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
            Impor Data Pembaruan
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Unggah berkas spreadsheet Excel (.xlsx) untuk memperbarui data
            operasional secara berkala.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4.5">
          {/* 1. Sumber Data Tujuan (Otomatis Sesuai Baris Yang Dipilih) */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Sumber Data Tujuan
            </span>
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-white/2">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {source?.namaSumber ?? "Rekap Pengolahan Gempolin"}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{source?.kategori ?? "Operasional Timbangan KSM"}</span>
                <span>·</span>
                <span>Siklus: {source?.frekuensi ?? "Mingguan"}</span>
              </div>
            </div>
          </div>

          {/* 2. Unduh Template Bantuan */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-white/2">
            <div className="flex items-center gap-2.5">
              <DocIcon className="size-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-white/90">
                  Belum memiliki format berkas?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Unduh template resmi sesuai standar sistem
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="gap-1.5"
            >
              <DownloadIcon className="size-3.5" />
              <span>Unduh Template</span>
            </Button>
          </div>

          {/* 3. Area Drag-and-Drop / File Upload */}
          <Field className="space-y-1.5">
            <FieldLabel>
              Berkas Spreadsheet (.xlsx)<span className="text-red-500">*</span>
            </FieldLabel>

            {selectedFile ? (
              <div className="flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-900/40 dark:bg-brand-950/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                    <DocIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ukuran: {selectedFile.size} • Siap diproses
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setSelectedFile(null)}
                >
                  Ganti
                </Button>
              </div>
            ) : (
              <label
                htmlFor="file-upload-input"
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center transition-colors hover:border-brand-500 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-white/2 dark:hover:border-brand-500/50"
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".xlsx"
                  className="sr-only"
                  onChange={handleFileSelect}
                />
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-transform group-hover:scale-105 dark:bg-brand-950/40 dark:text-brand-400">
                  <UploadIcon className="size-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                  Pilih berkas atau seret berkas ke sini
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format berkas: Excel (.xlsx) • Ukuran maksimal: 10 MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSimulateSelect();
                  }}
                  className="mt-2.5 text-xs font-medium text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
                >
                  Gunakan contoh berkas demo
                </button>
              </label>
            )}
          </Field>

          {/* Feedback Sukses */}
          {isSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <CheckCircleIcon className="size-4 shrink-0" />
              <span>
                Berkas berhasil divalidasi dan diimpor ke sistem.
              </span>
            </div>
          )}

          {/* Footer Actions */}
          <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                >
                  Batal
                </Button>
              }
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!selectedFile || isSuccess}
              className="gap-2"
            >
              <UploadIcon className="size-4" />
              <span>{isSuccess ? "Berhasil Diimpor..." : "Proses Impor"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
