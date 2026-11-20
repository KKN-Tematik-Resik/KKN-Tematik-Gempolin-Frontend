import { OperationalMetrics } from "@/types/admin-dashboard";
import { Link } from "@/i18n/navigation";
import {
  FileIcon,
  TrashBinIcon,
  AlertIcon,
  OctagonAlertIcon,
  ArrowRightIcon,
} from "@/icons";

interface Props {
  metrics: OperationalMetrics;
}

export default function OperationalMetricsCards({ metrics }: Props) {
  return (
    <section className="space-y-3">
      {/* Judul Section 1 */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Ringkasan Operasional & Kualitas Data
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ikhtisar permintaan pengangkutan sampah, tonase terolah, serta status validasi data terkini.
        </p>
      </div>

      {/* Grid 4 Kartu KPI Standar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Request Sampah */}
        <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Permintaan Pengangkutan
              </span>
              <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <FileIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {metrics.totalRequests.toLocaleString("id-ID")}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                request
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Berat Terverifikasi: </span>
            <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-300">
              {metrics.verifiedWeightKg.toLocaleString("id-ID")} kg
            </span>
          </div>
        </div>

        {/* KPI 2: Total Sampah Terolah */}
        <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Sampah Terolah
              </span>
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <TrashBinIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                {metrics.totalProcessedWeightKg.toLocaleString("id-ID")}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                kg
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Setara Tonase:</span>
            <span className="font-semibold tabular-nums text-sky-600 dark:text-sky-400">
              {(metrics.totalProcessedWeightKg / 1000).toFixed(2)} Ton
            </span>
          </div>
        </div>

        {/* KPI 3: Data Perlu Verifikasi (Ditandai) */}
        <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Perlu Verifikasi Ulang
              </span>
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <AlertIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {metrics.flaggedRowsCount}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                baris data
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <Link
              href="/admin/sinkronisasi"
              className="inline-flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
            >
              <span>Periksa di Status Sinkronisasi</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>

        {/* KPI 4: Data Ditolak */}
        <div className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Data Ditolak (Gagal Impor)
              </span>
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <OctagonAlertIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                {metrics.rejectedRowsCount}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                baris data
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <Link
              href="/admin/sinkronisasi"
              className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300"
            >
              <span>Lihat log kesalahan</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
