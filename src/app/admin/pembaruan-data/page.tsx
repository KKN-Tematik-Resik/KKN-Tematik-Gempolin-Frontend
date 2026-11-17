import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembaruan Data | Gempolin Kelurahan Gempolsari",
  description: "Pembaruan Data dan Impor Excel Kelurahan Gempolsari",
};

export default function PembaruanDataPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pembaruan Data" />
      <ComponentCard
        title="Pembaruan Data (Impor Excel)"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Pembaruan Data (Impor Excel) sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
