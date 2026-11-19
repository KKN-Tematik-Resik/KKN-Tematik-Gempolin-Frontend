"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertIcon, CheckCircleIcon, UploadIcon } from "@/icons";
import type { SourceStatusItem } from "@/types/sinkronisasi";
import ImportDialog from "./import-dialog";

interface SourceStatusTableProps {
  sources: SourceStatusItem[];
}

export default function SourceStatusTable({ sources }: SourceStatusTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceStatusItem | null>(null);

  const handleOpenImport = (item: SourceStatusItem) => {
    setSelectedSource(item);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            Status Pembaruan per Sumber Data
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Pemantauan kepatuhan pembaruan berkala berdasarkan pemisahan 3 waktu
          </p>
        </div>

        {/* Table Area */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr className="border-b border-gray-200 text-start text-xs font-semibold text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th scope="col" className="py-3.5 pe-4 ps-1 text-start">
                  Sumber Data
                </th>
                <th scope="col" className="px-4 py-3.5 text-start">
                  Waktu Sumber Lapangan
                </th>
                <th scope="col" className="px-4 py-3.5 text-start">
                  Waktu Impor Sistem (WIB)
                </th>
                <th scope="col" className="px-4 py-3.5 text-start">
                  Status Data
                </th>
                <th scope="col" className="px-4 py-3.5 text-end">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {sources.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                >
                  {/* Sumber Data */}
                  <td className="py-4 pe-4 ps-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {item.namaSumber}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {item.kategori}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        Siklus: {item.frekuensi}
                      </p>
                    </div>
                  </td>

                  {/* Waktu Sumber Lapangan */}
                  <td className="px-4 py-4 text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
                    {item.waktuSumber}
                  </td>

                  {/* Waktu Impor Sistem */}
                  <td className="px-4 py-4 text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
                    {item.waktuImpor}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    {item.status === "mutakhir" ? (
                      <Badge variant="light" color="success" size="sm">
                        <CheckCircleIcon className="size-3" />
                        <span>Terkini</span>
                      </Badge>
                    ) : (
                      <Badge variant="light" color="warning" size="sm">
                        <AlertIcon className="size-3" />
                        <span>Perlu Diperbarui</span>
                      </Badge>
                    )}
                  </td>

                  {/* Tindakan */}
                  <td className="px-4 py-4 text-end">
                    <Button
                      variant={item.status === "perlu_pembaruan" ? "default" : "outline"}
                      size="xs"
                      className="gap-1.5"
                      onClick={() => handleOpenImport(item)}
                    >
                      <UploadIcon className="size-3.5" />
                      <span>Perbarui</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Dialog Impor Data Baru */}
      <ImportDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        source={selectedSource}
      />
    </>
  );
}
