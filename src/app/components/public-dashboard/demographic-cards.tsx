interface DemographicSummaryProps {
  totalRumah: number;
  totalKk: number;
  totalWarga: number;
  totalProcessedKg: number;
}

export default function DemographicCards({
  totalRumah,
  totalKk,
  totalWarga,
  totalProcessedKg,
}: DemographicSummaryProps) {
  const items = [
    {
      label: "Total Warga",
      value: totalWarga.toLocaleString("id-ID"),
      unit: "Jiwa",
    },
    {
      label: "Kepala Keluarga",
      value: totalKk.toLocaleString("id-ID"),
      unit: "KK",
    },
    {
      label: "Rumah Terdata",
      value: totalRumah.toLocaleString("id-ID"),
      unit: "Hunian",
    },
    {
      label: "Sampah Terolah",
      value: totalProcessedKg.toLocaleString("id-ID"),
      unit: "kg",
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-800">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white p-4 dark:bg-gray-900 sm:p-5"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.label}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${
                item.highlight
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {item.value}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
