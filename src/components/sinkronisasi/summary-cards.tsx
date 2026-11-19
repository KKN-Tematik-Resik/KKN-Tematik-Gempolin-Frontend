import { Card } from "@/components/ui/card";
import { AlertIcon, CheckCircleIcon, UploadIcon } from "@/icons";
import type { SyncSummaryStats } from "@/types/sinkronisasi";

interface SummaryCardsProps {
  stats: SyncSummaryStats;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Kartu 1: Status Integritas Sistem */}
      <Card className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <CheckCircleIcon className="size-6" />
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Status Operasional
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
            Status Integritas Data
          </p>
          <h4 className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl dark:text-white/90">
            {stats.sumberMutakhir} dari {stats.totalSumber} Sumber
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {stats.sumberPerluPembaruan > 0 ? (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <AlertIcon className="size-3.5" />
                {stats.sumberPerluPembaruan} sumber data perlu diperbarui
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-medium">
                Seluruh sumber data berada dalam batas wajar
              </span>
            )}
          </p>
        </div>
      </Card>

      {/* Kartu 2: Total Impor Berkas */}
      <Card className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <UploadIcon className="size-6" />
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Bulan Berjalan
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
            Riwayat Impor Berkas Bulan Ini
          </p>
          <h4 className="mt-1 text-xl font-bold tabular-nums text-gray-800 sm:text-2xl dark:text-white/90">
            {stats.totalImporBulanIni} Berkas
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Mekanisme replace data dengan perlindungan rollback
          </p>
        </div>
      </Card>
    </div>
  );
}
