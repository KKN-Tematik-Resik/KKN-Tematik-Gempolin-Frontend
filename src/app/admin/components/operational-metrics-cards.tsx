import { Link } from "@/i18n/navigation";
import {
  AlertIcon,
  ArrowRightIcon,
  FileIcon,
  OctagonAlertIcon,
  TrashBinIcon,
} from "@/icons";
import type { OperationalMetrics } from "@/types/admin-dashboard";

interface OperationalMetricsCardsProps {
  metrics: OperationalMetrics;
}

export default function OperationalMetricsCards({
  metrics,
}: OperationalMetricsCardsProps) {
  return (
    <section aria-label="Ringkasan Operasional dan Kualitas Data">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1: Permintaan Pengangkutan */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Permintaan Gempolin
              </span>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <FileIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900 tabular-nums dark:text-white">
                {metrics.totalRequests.toLocaleString("id-ID")}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                request
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Berat Verifikasi</span>
            <span className="font-semibold text-gray-700 tabular-nums dark:text-gray-300">
              {metrics.verifiedWeightKg.toLocaleString("id-ID")} kg
            </span>
          </div>
        </div>

        {/* KPI 2: Total Sampah Terolah */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Sampah Terolah
              </span>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <TrashBinIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900 tabular-nums dark:text-white">
                {metrics.totalProcessedWeightKg.toLocaleString("id-ID")}
              </span>
              <span className="ms-1.5 text-xs text-gray-500 dark:text-gray-400">
                kg
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Setara Tonase</span>
            <span className="font-semibold text-sky-600 tabular-nums dark:text-sky-400">
              {(metrics.totalProcessedWeightKg / 1000).toFixed(2)} Ton
            </span>
          </div>
        </div>

        {/* KPI 3: Perlu Verifikasi Ulang */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Perlu Verifikasi Ulang
              </span>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <AlertIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
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
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Data Ditolak (Gagal Impor)
              </span>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <OctagonAlertIcon className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-red-600 tabular-nums dark:text-red-400">
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
