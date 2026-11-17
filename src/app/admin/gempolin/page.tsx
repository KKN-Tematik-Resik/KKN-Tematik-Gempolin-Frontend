import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekap Pengolahan Gempolin | Gempolin Kelurahan Gempolsari",
  description: "Rekapitulasi Operasional Pengolahan Sampah Gempolin",
};

export default function GempolinPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Rekap Pengolahan Gempolin" />
      <ComponentCard
        title="Rekap Pengolahan Gempolin"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Rekap Pengolahan Gempolin sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
