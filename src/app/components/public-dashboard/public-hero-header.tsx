import { ClockIcon } from "@/icons";

interface PublicHeroHeaderProps {
  lastUpdatedWib: string;
  activePeriodLabel: string;
}

export default function PublicHeroHeader({
  lastUpdatedWib,
  activePeriodLabel,
}: PublicHeroHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-gray-800">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Kelurahan Gempolsari · Kota Bandung
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Publikasi Pengelolaan Sampah
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Informasi agregat partisipasi pilah-olah sampah warga dan rekap operasional wilayah.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <ClockIcon className="size-3.5 text-gray-400" />
          <span>
            {activePeriodLabel} · Pembaruan: <strong className="font-medium text-gray-700 dark:text-gray-300">{lastUpdatedWib}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
