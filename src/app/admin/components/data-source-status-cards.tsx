import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckDeliveryIcon,
  UsersIcon,
} from "@/icons";
import type { DataSourceStatus, DataSourceType } from "@/types/admin-dashboard";

interface DataSourceStatusCardsProps {
  statuses: DataSourceStatus[];
}

function getSourceHref(source: DataSourceType): string {
  return source === "gempolin" ? "/admin/gempolin" : "/admin/demografi";
}

export default function DataSourceStatusCards({
  statuses,
}: DataSourceStatusCardsProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Status Integrasi Sumber Data
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Kemutakhiran dua sumber data aktif pengelolaan sampah Kelurahan
            Gempolsari.
          </p>
        </div>
        <Link
          href="/admin/sinkronisasi"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
        >
          <span>Log Sinkronisasi</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        {statuses.map((item) => {
          const isTerkini = item.status === "terkini";
          const isGempolin = item.source === "gempolin";

          return (
            <div
              key={item.source}
              className="flex flex-col justify-between rounded-xl border border-gray-200/80 bg-gray-50/40 p-4 dark:border-gray-800 dark:bg-white/[0.02]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      isGempolin
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
                    }`}
                  >
                    {isGempolin ? (
                      <TruckDeliveryIcon className="size-5" />
                    ) : (
                      <UsersIcon className="size-5" />
                    )}
                  </div>

                  <Badge
                    variant="light"
                    color={isTerkini ? "success" : "warning"}
                    size="sm"
                    className="shrink-0 whitespace-nowrap"
                  >
                    {isTerkini ? (
                      <>
                        <CheckCircleIcon className="size-3" />
                        Terkini
                      </>
                    ) : (
                      <>
                        <AlertIcon className="size-3" />
                        Perlu Pembaruan
                      </>
                    )}
                  </Badge>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {item.sourceTypeLabel}
                  </p>
                </div>

                <dl className="mt-4 space-y-2 border-t border-gray-200/70 pt-3 text-xs dark:border-gray-800">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Periode Data
                    </dt>
                    <dd className="text-end font-medium text-gray-800 dark:text-gray-200">
                      {item.dataPeriod}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Update Sumber
                    </dt>
                    <dd className="text-end font-medium text-gray-800 tabular-nums dark:text-gray-200">
                      {item.sourceUpdatedAt}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Terakhir Impor
                    </dt>
                    <dd className="text-end font-medium text-gray-800 tabular-nums dark:text-gray-200">
                      {item.lastImportAt}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600 ring-1 ring-gray-200/70 dark:bg-white/[0.03] dark:text-gray-300 dark:ring-gray-800">
                  <ClockIcon className="size-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{item.syncResult}</span>
                </div>
                <Link
                  href={getSourceHref(item.source)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
                >
                  <span>Kelola & Impor Data</span>
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
