import PageBreadcrumb from "@/components/common/page-breadcrumb";
import SinkronisasiSection from "@/components/sinkronisasi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Kemutakhiran & Riwayat Sinkronisasi | Gempolin Kelurahan Gempolsari",
  description: "Status Kemutakhiran Data dan Audit Log Riwayat Sinkronisasi",
};

export default function SinkronisasiPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Status Kemutakhiran & Riwayat Sinkronisasi" />
      <SinkronisasiSection />
    </div>
  );
}
