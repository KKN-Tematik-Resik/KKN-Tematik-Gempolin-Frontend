import type { Metadata } from "next";

import AdminWelcomeHeader from "./components/admin-welcome-header";
import OperationalMetricsCards from "./components/operational-metrics-cards";
import DataSourceStatusCards from "./components/data-source-status-cards";
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

// Server Component (Pre-Task Checklist #1: page.tsx wajib Server Component)
export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Sambutan Ramah Admin & Breadcrumb */}
      <AdminWelcomeHeader />

      {/* Section 1: Metrik Operasional 4 KPI Cards */}
      <OperationalMetricsCards metrics={mockOperationalMetrics} />

      {/* Section 2: Status Integrasi & Kemutakhiran Sumber Data */}
      <DataSourceStatusCards statuses={mockDataSourceStatuses} />

      {/* Section 3: Tabel Data Pengelolaan Sampah per RT */}
      <RtMonitoringSection initialData={mockRtMonitoringData} />
    </div>
  );
}
