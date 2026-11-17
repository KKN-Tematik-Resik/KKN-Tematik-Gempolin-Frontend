import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informasi Bank Sampah | Gempolin Kelurahan Gempolsari",
  description: "Informasi Unit Bank Sampah Kelurahan Gempolsari",
};

export default function BankSampahPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Informasi Bank Sampah" />
      <ComponentCard
        title="Informasi Bank Sampah"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Informasi Bank Sampah sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
