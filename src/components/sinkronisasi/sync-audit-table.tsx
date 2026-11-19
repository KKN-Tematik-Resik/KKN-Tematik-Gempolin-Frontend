import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon, DocIcon, OctagonAlertIcon } from "@/icons";
import type { SyncAuditLogItem } from "@/types/sinkronisasi";

interface SyncAuditTableProps {
  logs: SyncAuditLogItem[];
}

export default function SyncAuditTable({ logs }: SyncAuditTableProps) {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
          Riwayat Impor & Audit Log Transaksi
        </h3>
        <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
          Catatan riil setiap aktivitas impor berkas Excel. Seluruh transaksi bersifat atomik (rollback penuh jika gagal).
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead>
            <tr className="border-b border-gray-200 text-start text-xs font-semibold text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th scope="col" className="py-3.5 pe-4 ps-1 text-start">
                Waktu Impor (WIB)
              </th>
              <th scope="col" className="px-4 py-3.5 text-start">
                Nama Berkas
              </th>
              <th scope="col" className="px-4 py-3.5 text-start">
                Sumber Modul
              </th>
              <th scope="col" className="px-4 py-3.5 text-start">
                Admin Pelaksana
              </th>
              <th scope="col" className="px-4 py-3.5 text-start">
                Hasil Baris Data
              </th>
              <th scope="col" className="px-4 py-3.5 text-end">
                Status Transaksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
              >
                {/* Waktu Impor */}
                <td className="py-4 pe-4 ps-1 text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300">
                  {log.waktuImpor}
                </td>

                {/* Nama Berkas */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <DocIcon className="size-4 shrink-0 text-gray-400" />
                    <span className="font-mono text-xs font-medium text-gray-800 dark:text-white/90">
                      {log.namaBerkas}
                    </span>
                  </div>
                </td>

                {/* Sumber Modul */}
                <td className="px-4 py-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {log.sumberData}
                </td>

                {/* Admin Pelaksana */}
                <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">
                  {log.adminPelaksana}
                </td>

                {/* Hasil Baris Data */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-xs tabular-nums">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {log.barisBerhasil} valid
                    </span>
                    {log.barisDitolak > 0 && (
                      <>
                        <span className="text-gray-300 dark:text-gray-700">/</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {log.barisDitolak} ditolak
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* Status Transaksi */}
                <td className="px-4 py-4 text-end">
                  {log.status === "sukses" ? (
                    <Badge variant="light" color="success" size="sm">
                      <CheckCircleIcon className="size-3" />
                      <span>Sukses</span>
                    </Badge>
                  ) : (
                    <Badge variant="light" color="error" size="sm">
                      <OctagonAlertIcon className="size-3" />
                      <span>Rollback</span>
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
