import type { Metadata } from "next";

import AdminWelcomeHeader from "./components/admin-welcome-header";
import DataQualityOverviewCard from "./components/data-quality-overview-card";
import DataSourceStatusCards from "./components/data-source-status-cards";
import OperationalMetricsCards from "./components/operational-metrics-cards";
import RtMonitoringSection from "./components/rt-monitoring-section";

import {
  mockDataSourceStatuses,
  mockOperationalMetrics,
  mockRtMonitoringData,
} from "@/data/mock/admin-dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard Internal Admin | Gempolin Kelurahan Gempolsari",
  description:
    "Monitoring Operasional, Status Integrasi Sumber Data, dan Kelengkapan Data Wilayah Kelurahan Gempolsari",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Sambutan, Periode Aktif & Akses Cepat */}
      <AdminWelcomeHeader
        lastImportDate={mockOperationalMetrics.lastImportDate}
      />

      {/* Baris 1: 4 Kartu Metrik Operasional & Kualitas Data */}
      <OperationalMetricsCards metrics={mockOperationalMetrics} />

      {/* Baris 2: Status Sumber Data (Kiri) + Kelengkapan & Partisipasi Wilayah (Kanan) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DataSourceStatusCards statuses={mockDataSourceStatuses} />
        </div>
        <div className="xl:col-span-5">
          <DataQualityOverviewCard rows={mockRtMonitoringData} />
        </div>
      </div>

      {/* Baris 3: Tabel Pemantauan Data Wilayah per RW & RT */}
      <RtMonitoringSection initialData={mockRtMonitoringData} />
    </div>
  );
}
