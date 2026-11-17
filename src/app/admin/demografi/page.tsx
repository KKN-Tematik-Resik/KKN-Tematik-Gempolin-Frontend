import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demografi & Partisipasi Warga | Gempolin Kelurahan Gempolsari",
  description: "Demografi dan Partisipasi Pengelolaan Sampah Warga Kelurahan Gempolsari",
};

export default function DemografiPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Demografi & Partisipasi Warga" />
      <ComponentCard
        title="Demografi & Partisipasi Warga"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Demografi & Partisipasi Warga sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
