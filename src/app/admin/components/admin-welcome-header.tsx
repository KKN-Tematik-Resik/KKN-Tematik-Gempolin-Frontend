import PageBreadcrumb from "@/components/common/page-breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ClockIcon, TruckDeliveryIcon, UsersIcon } from "@/icons";
import { cn } from "@/utils";

interface AdminWelcomeHeaderProps {
  lastImportDate: string;
}

export default function AdminWelcomeHeader({
  lastImportDate,
}: AdminWelcomeHeaderProps) {
  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Dashboard Internal Admin" />

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
            Halo, Admin Kelurahan Gempolsari
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1 tabular-nums">
              Pembaruan terakhir: {lastImportDate}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/gempolin"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs",
            )}
          >
            <TruckDeliveryIcon className="size-4" />
            <span>Rekap Gempolin</span>
          </Link>
          <Link
            href="/admin/demografi"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "gap-1.5 text-xs",
            )}
          >
            <UsersIcon className="size-4" />
            <span>Data Demografi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
