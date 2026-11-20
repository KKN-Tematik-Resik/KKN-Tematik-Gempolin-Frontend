"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DocIcon,
  DownloadIcon,
  UploadIcon,
} from "@/icons";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import { cn, formatNumber } from "@/utils";
import { formatImportFileSize, validateImportFile } from "./import-file";

export interface ImportPreviewColumn {
  key: string;
  label: string;
  align?: "start" | "end";
}

export interface ImportPreviewData {
  columns: ImportPreviewColumn[];
  rows: Array<Record<string, string | number> & { id: string }>;
  totalRows: number;
}

interface ImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceStatusItem | null;
  preview?: ImportPreviewData;
  onSuccess?: (fileName: string) => void;
}

export default function ImportDialog({
  isOpen,
  onOpenChange,
  source,
  preview,
  onSuccess,
}: ImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const resetState = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedFile(null);
    setFileError(null);
    setIsDragging(false);
    setStep("upload");
    setIsSuccess(false);
  };

  const acceptFile = (file: File) => {
    const error = validateImportFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile({
      name: file.name,
      size: formatImportFileSize(file.size),
    });
    setStep("upload");
    setIsSuccess(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  const handleSimulateSelect = () => {
    setFileError(null);
    setSelectedFile({
      name: `data_${source?.id ?? "sumber"}_nov_2026.xlsx`,
      size: "248 KB",
    });
    setStep("upload");
    setIsSuccess(false);
  };

  const handleProceedToConfirm = () => {
    if (!selectedFile) return;
    setStep("confirm");
  };

  const handleConfirmImport = () => {
    if (!selectedFile || isSuccess) return;
    const fileName = selectedFile.name;
    setIsSuccess(true);
    closeTimerRef.current = setTimeout(() => {
      onSuccess?.(fileName);
      resetState();
      onOpenChange(false);
    }, 1200);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetState();
    onOpenChange(open);
  };

  const hasPreview = Boolean(preview && preview.rows.length > 0);
  const showWideDialog = step === "upload" && Boolean(selectedFile) && hasPreview;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-3xl p-6 sm:p-8",
          showWideDialog ? "sm:max-w-2xl" : "sm:max-w-146",
        )}
      >
        <DialogHeader className="gap-1.5 text-start">
          <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
            {step === "confirm"
              ? "Konfirmasi Impor Data"
              : "Impor Data Pembaruan"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {step === "confirm"
              ? "Tinjau kembali detail berkas sebelum data periode aktif diganti."
              : "Unggah berkas spreadsheet Excel (.xlsx) untuk melihat pratinjau sebelum memperbarui data."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <div className="mt-5 space-y-4.5">
            {/* 1. Sumber Data Tujuan */}
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

            {/* 3. Area Unggah Berkas */}
            <Field className="space-y-1.5">
              <FieldLabel>
                Berkas Spreadsheet (.xlsx)
                <span className="text-red-500">*</span>
              </FieldLabel>

              {selectedFile ? (
                <div className="flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-900/40 dark:bg-brand-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                      <DocIcon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
                        Ukuran: {selectedFile.size} • Format valid
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileError(null);
                    }}
                  >
                    Ganti
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
                    isDragging
                      ? "border-brand-500 bg-brand-50/50 dark:border-brand-400 dark:bg-brand-950/20"
                      : "border-gray-300 bg-gray-50/50 hover:border-brand-500 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-white/2 dark:hover:border-brand-500/50",
                  )}
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

              {fileError ? (
                <Alert variant="destructive" className="mt-2">
                  <AlertIcon />
                  <AlertTitle className="text-xs font-semibold">
                    Berkas tidak valid
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {fileError}
                  </AlertDescription>
                </Alert>
              ) : null}
            </Field>

            {/* 4. Pratinjau Tabel Data Setelah File Dipilih */}
            {/* shortcut: preview displays caller-provided sample rows until client .xlsx parser or backend preview endpoint is integrated */}
            {selectedFile && preview && preview.rows.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Pratinjau Data yang Akan Diimpor
                  </span>
                  <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
                    Menampilkan {preview.rows.length} dari {preview.totalRows}{" "}
                    baris
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="max-h-52 overflow-auto">
                    <Table className="text-xs">
                      <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900">
                        <TableRow className="border-b border-gray-200 dark:border-gray-800">
                          {preview.columns.map((col) => (
                            <TableCell
                              key={col.key}
                              isHeader
                              className={cn(
                                "px-3 py-2.5 font-semibold whitespace-nowrap text-gray-600 dark:text-gray-300",
                                col.align === "end"
                                  ? "text-end"
                                  : "text-start",
                              )}
                            >
                              {col.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-gray-800/70">
                        {preview.rows.map((row) => (
                          <TableRow
                            key={row.id}
                            className="bg-white dark:bg-transparent"
                          >
                            {preview.columns.map((col) => {
                              const rawVal = row[col.key];
                              const displayVal =
                                typeof rawVal === "number"
                                  ? formatNumber(rawVal)
                                  : rawVal;
                              return (
                                <TableCell
                                  key={col.key}
                                  className={cn(
                                    "px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300",
                                    col.align === "end"
                                      ? "text-end tabular-nums"
                                      : "text-start font-medium",
                                  )}
                                >
                                  {displayVal}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Footer Langkah 1 */}
            <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenChange(false)}
                  >
                    Batal
                  </Button>
                }
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={!selectedFile}
                onClick={handleProceedToConfirm}
                className="gap-2"
              >
                <UploadIcon className="size-4" />
                <span>Lanjutkan Impor</span>
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="mt-5 space-y-4.5">
            {/* Warning Alert Krusial */}
            <Alert variant="warning" className="p-4">
              <AlertIcon />
              <AlertTitle className="text-sm font-semibold">
                Peringatan Tindakan Krusial
              </AlertTitle>
              <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200/90">
                Proses impor akan mengganti seluruh data periode aktif untuk
                sumber ini secara penuh. Pastikan isi pratinjau data sudah benar
                karena perubahan langsung memengaruhi tampilan dashboard.
              </AlertDescription>
            </Alert>

            {/* Ringkasan Eksekusi */}
            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gray-50/70 text-xs dark:divide-gray-800 dark:border-gray-800 dark:bg-white/2">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Sumber Data
                </span>
                <span className="text-end font-semibold text-gray-800 dark:text-white/90">
                  {source?.namaSumber ?? "Rekap Pengolahan Gempolin"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Nama Berkas
                </span>
                <span className="truncate text-end font-semibold text-gray-800 dark:text-white/90">
                  {selectedFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-gray-500 dark:text-gray-400">
                  Ukuran Berkas
                </span>
                <span className="font-medium text-gray-700 tabular-nums dark:text-gray-300">
                  {selectedFile?.size}
                </span>
              </div>
              {preview && preview.totalRows > 0 ? (
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    Jumlah Data
                  </span>
                  <span className="font-semibold text-gray-800 tabular-nums dark:text-white/90">
                    {formatNumber(preview.totalRows)} baris
                  </span>
                </div>
              ) : null}
            </div>

            {/* Feedback Sukses */}
            {isSuccess ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-300">
                <CheckCircleIcon className="size-4 shrink-0" />
                <span>Berkas berhasil divalidasi dan diimpor ke sistem.</span>
              </div>
            ) : null}

            {/* Footer Langkah 2 */}
            <DialogFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSuccess}
                onClick={() => setStep("upload")}
                className="gap-1.5"
              >
                <ArrowLeftIcon className="size-4" />
                <span>Kembali ke Pratinjau</span>
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isSuccess}
                onClick={handleConfirmImport}
                className="gap-2"
              >
                <UploadIcon className="size-4" />
                <span>
                  {isSuccess ? "Memproses Impor..." : "Ya, Konfirmasi & Impor"}
                </span>
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
