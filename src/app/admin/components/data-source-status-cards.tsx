import { DataSourceStatus } from "@/types/admin-dashboard";
import { Badge } from "@/components/ui/badge";
import {
  TruckDeliveryIcon,
  UsersIcon,
  DatabaseIcon,
  CheckCircleIcon,
  AlertIcon,
  ClockIcon,
} from "@/icons";

interface Props {
  statuses: DataSourceStatus[];
}

export default function DataSourceStatusCards({ statuses }: Props) {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "gempolin":
        return <TruckDeliveryIcon className="size-5 text-brand-600 dark:text-brand-400" />;
      case "demografi":
        return <UsersIcon className="size-5 text-sky-600 dark:text-sky-400" />;
      case "bank_sampah":
        return <DatabaseIcon className="size-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <DatabaseIcon className="size-5 text-gray-500" />;
    }
  };

  const getSourceBg = (source: string) => {
    switch (source) {
      case "gempolin":
        return "bg-brand-50 dark:bg-brand-500/10";
      case "demografi":
        return "bg-sky-50 dark:bg-sky-500/10";
      case "bank_sampah":
        return "bg-amber-50 dark:bg-amber-500/10";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <section className="space-y-3">
      {/* Judul Section 2 */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Status Integrasi & Kemutakhiran Data
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Kesiapan dan periode pembaruan data dari ketiga sumber pengelolaan sampah Kelurahan Gempolsari.
        </p>
      </div>

      {/* Grid 3 Kartu Sumber Data */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statuses.map((item) => {
          const isTerkini = item.status === "terkini";

          return (
            <div
              key={item.source}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div>
                {/* Header Kartu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${getSourceBg(item.source)}`}
                    >
                      {getSourceIcon(item.source)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.sourceTypeLabel}
                      </p>
                    </div>
                  </div>

                  {/* Badge Status Terkini vs Perlu Pembaruan */}
                  <Badge
                    variant="light"
                    color={isTerkini ? "success" : "warning"}
                    className="shrink-0"
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

                {/* Tiga Makna Waktu Terpisah */}
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Periode Data:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.dataPeriod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Pembaruan di Sumber:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.sourceUpdatedAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Terakhir Diimpor:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.lastImportAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Ringkasan */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
                <ClockIcon className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{item.syncResult}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
