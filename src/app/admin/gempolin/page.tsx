import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ComparisonCard from "@/components/shared/comparison-card";
import GempolinDailyTable from "@/components/shared/gempolin-daily-table";
import GempolinRtTable from "@/components/shared/gempolin-rt-table";
import GempolinTrendChart from "@/components/shared/gempolin-trend-chart";
import MetricCard from "@/components/shared/metric-card";
import { TaskIcon, TrashBinIcon } from "@/icons";
import { calculateDelta } from "@/utils";
import type { Metadata } from "next";
import { gempolinMockData } from "./mock-data";

export const metadata: Metadata = {
  title: "Rekap Pengolahan Gempolin | Gempolin Kelurahan Gempolsari",
  description:
    "Rekapitulasi Operasional Pengolahan Sampah Gempolin - Kelurahan Gempolsari",
};

export default function GempolinPage() {
  const { periode, periodeSebelumnya, harian, perRt } = gempolinMockData;

  const requestTrend = calculateDelta(
    periode.totalRequest,
    periodeSebelumnya.totalRequest,
  );
  const tonaseTrend = calculateDelta(
    periode.totalTerolah,
    periodeSebelumnya.totalTerolah,
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Rekap Pengolahan Gempolin" />

      {/* Baris 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <MetricCard
          title="Total Permintaan Bulan Ini"
          value={periode.totalRequest}
          unit="request"
          icon={
            <TaskIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: requestTrend.percentage,
            isPositive: requestTrend.absolute >= 0,
            comparisonLabel: "vs bulan lalu",
          }}
        />

        <MetricCard
          title="Total Sampah Terolah"
          value={periode.totalTerolah}
          unit="kg"
          icon={
            <TrashBinIcon className="size-5 text-brand-600 dark:text-brand-400" />
          }
          trend={{
            percentage: tonaseTrend.percentage,
            isPositive: tonaseTrend.absolute >= 0,
            comparisonLabel: "vs bulan lalu",
          }}
        />
      </div>

      {/* Baris 2: Kartu Komparasi Antar-Periode (FR-27) */}
      <ComponentCard
        title="Perbandingan Antar-Periode"
        desc="Komparasi performa operasional pengolahan sampah dengan periode sebelumnya"
      >
        <ComparisonCard
          currentLabel={periode.label}
          previousLabel={periodeSebelumnya.label}
          currentValue={periode.totalTerolah}
          previousValue={periodeSebelumnya.totalTerolah}
          unit="kg"
          currentRequest={periode.totalRequest}
          previousRequest={periodeSebelumnya.totalRequest}
        />
      </ComponentCard>

      {/* Baris 3: Tren Harian Berat Terolah (BR-04) */}
      <ComponentCard
        title="Tren Harian Tonase Terolah"
        desc="Distribusi harian berat sampah yang berhasil diolah dalam zona waktu WIB (BR-04)"
      >
        <GempolinTrendChart data={harian} />
      </ComponentCard>

      {/* Baris 4: Rekap per Wilayah RT (BR-03, BR-07) */}
      <ComponentCard
        title="Rekapitulasi per Wilayah RT"
        desc="Rincian akumulasi permintaan dan tonase per RT dengan verifikasi lapangan (BR-03)"
      >
        <GempolinRtTable data={perRt} />
      </ComponentCard>

      {/* Baris 5: Log Rincian Harian */}
      <ComponentCard
        title="Log Rincian Harian"
        desc="Catatan detail operasional harian pengolahan sampah Gempolin"
      >
        <GempolinDailyTable data={harian} />
      </ComponentCard>
    </div>
  );
}
