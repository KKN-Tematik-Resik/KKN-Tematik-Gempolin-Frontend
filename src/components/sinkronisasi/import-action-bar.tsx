"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, UploadIcon } from "@/icons";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import ImportDialog, { type ImportPreviewData } from "./import-dialog";

export interface ImportActionBarProps {
  title: string;
  defaultSubtitle: string;
  buttonLabel: string;
  successEntityLabel: string;
  rowUnit: string;
  source: SourceStatusItem;
  preview: ImportPreviewData;
}

export default function ImportActionBar({
  title,
  defaultSubtitle,
  buttonLabel,
  successEntityLabel,
  rowUnit,
  source,
  preview,
}: ImportActionBarProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [lastImportInfo, setLastImportInfo] = useState<{
    fileName: string;
    timestamp: string;
  } | null>(null);

  const handleImportSuccess = (fileName: string) => {
    const now = new Date();
    const timeStr = `${now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
    setLastImportInfo({ fileName, timestamp: timeStr });
  };

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              {title}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
            {lastImportInfo
              ? `Dimutakhirkan: ${lastImportInfo.timestamp} via ${lastImportInfo.fileName}`
              : defaultSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 text-xs"
          >
            <UploadIcon className="size-4" />
            <span>{buttonLabel}</span>
          </Button>
        </div>
      </div>

      {lastImportInfo ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircleIcon className="size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              {successEntityLabel} ({preview.totalRows} {rowUnit}) berhasil
              dimutakhirkan dari berkas{" "}
              <strong>{lastImportInfo.fileName}</strong> pada{" "}
              {lastImportInfo.timestamp}.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLastImportInfo(null)}
            className="font-medium text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            Tutup
          </button>
        </div>
      ) : null}

      <ImportDialog
        isOpen={isImportOpen}
        onOpenChange={setIsImportOpen}
        source={source}
        preview={preview}
        onSuccess={handleImportSuccess}
      />
    </>
  );
}
