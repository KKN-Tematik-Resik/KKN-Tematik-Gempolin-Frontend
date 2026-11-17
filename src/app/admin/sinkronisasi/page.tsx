import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Kemutakhiran | Gempolin Kelurahan Gempolsari",
  description: "Status Kemutakhiran Data dan Riwayat Sinkronisasi",
};

export default function SinkronisasiPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Status Kemutakhiran" />
      <ComponentCard
        title="Status Kemutakhiran & Riwayat Sinkronisasi"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Status Kemutakhiran & Riwayat Sinkronisasi sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
