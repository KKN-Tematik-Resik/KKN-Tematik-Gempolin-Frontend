import PublicLayout from "@/layout/public-layout";
import type { Metadata } from "next";
import PublicDashboardClientWrapper from "./components/public-dashboard/public-dashboard-client-wrapper";
import {
  mockMonthlyTrends,
  mockPublicRtData,
  publicDashboardMeta,
} from "@/data/mock/public-dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard Publik | Gempolin Kelurahan Gempolsari",
  description:
    "Papan Informasi Agregat Pengelolaan Sampah Mandiri Warga Kelurahan Gempolsari, Kota Bandung",
};

// Server Component (Pre-Task Checklist #1: page.tsx wajib Server Component)
export default function PublicDashboardPage() {
  return (
    <PublicLayout>
      <PublicDashboardClientWrapper
        initialRtData={mockPublicRtData}
        monthlyTrends={mockMonthlyTrends}
        meta={publicDashboardMeta}
      />
    </PublicLayout>
  );
}
