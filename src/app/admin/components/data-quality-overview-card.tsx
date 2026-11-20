import type { RtMonitoringRow } from "@/types/admin-dashboard";
import { calculateParticipationRate, formatNumber } from "@/utils";

interface DataQualityOverviewCardProps {
  rows: RtMonitoringRow[];
}

export default function DataQualityOverviewCard({
  rows,
}: DataQualityOverviewCardProps) {
  const totalRt = rows.length;
  const totalRw = new Set(rows.map((r) => r.rw)).size;

  const lengkapCount = rows.filter((r) => r.statusKualitas === "lengkap").length;
  const ditandaiCount = rows.filter(
    (r) => r.statusKualitas === "ditandai",
  ).length;
  const kosongCount = rows.filter((r) => r.statusKualitas === "kosong").length;

  const pct = (n: number) => (totalRt > 0 ? (n / totalRt) * 100 : 0);

  // Agregasi partisipasi murni dari jumlah pembilang dibagi jumlah penyebut
  const totalRumah = rows.reduce((s, r) => s + (r.totalRumah ?? 0), 0);
  const totalMemilah = rows.reduce((s, r) => s + (r.rumahMemilah ?? 0), 0);
  const totalMengolah = rows.reduce((s, r) => s + (r.rumahMengolah ?? 0), 0);
  const rateMemilah = calculateParticipationRate(totalMemilah, totalRumah);
  const rateMengolah = calculateParticipationRate(totalMengolah, totalRumah);

  return (
    <section className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div>
        <div className="border-b border-gray-100 pb-4 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Kelengkapan & Partisipasi Wilayah
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 tabular-nums dark:text-gray-400">
            Cakupan {totalRw} RW · {totalRt} RT Kelurahan Gempolsari
          </p>
        </div>

        {/* Sebaran Status Kualitas Data RT */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Kelengkapan Data RT
            </span>
            <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
              {pct(lengkapCount).toFixed(1)}% Lengkap
            </span>
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${pct(lengkapCount)}%` }}
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${pct(ditandaiCount)}%` }}
            />
            <div
              className="bg-gray-400 transition-all dark:bg-gray-600"
              style={{ width: `${pct(kosongCount)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Lengkap</span>
              </div>
              <p className="mt-1 text-base font-bold text-gray-900 tabular-nums dark:text-white">
                {lengkapCount}{" "}
                <span className="text-xs font-normal text-gray-400">RT</span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="size-2 rounded-full bg-amber-400" />
                <span>Ditandai</span>
              </div>
              <p className="mt-1 text-base font-bold text-amber-600 tabular-nums dark:text-amber-400">
                {ditandaiCount}{" "}
                <span className="text-xs font-normal text-gray-400">RT</span>
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="size-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                <span>Kosong</span>
              </div>
              <p className="mt-1 text-base font-bold text-gray-700 tabular-nums dark:text-gray-300">
                {kosongCount}{" "}
                <span className="text-xs font-normal text-gray-400">RT</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Agregat Partisipasi Rumah */}
      <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Agregat Partisipasi Rumah
          </span>
          <span className="text-gray-500 tabular-nums dark:text-gray-400">
            {formatNumber(totalRumah)} rumah terdata
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50/70 px-3.5 py-2.5 dark:bg-emerald-500/10">
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              Rumah Memilah
            </span>
            <p className="mt-0.5 text-lg font-bold text-emerald-700 tabular-nums dark:text-emerald-300">
              {rateMemilah !== null ? `${rateMemilah.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-brand-50/70 px-3.5 py-2.5 dark:bg-brand-500/10">
            <span className="text-[11px] font-medium text-brand-700 dark:text-brand-300">
              Rumah Mengolah
            </span>
            <p className="mt-0.5 text-lg font-bold text-brand-700 tabular-nums dark:text-brand-300">
              {rateMengolah !== null ? `${rateMengolah.toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
