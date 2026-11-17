import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Internal Admin | Gempolin Kelurahan Gempolsari",
  description: "Dashboard Internal Pengelolaan Sampah Kelurahan Gempolsari",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard Internal Admin" />
      <ComponentCard
        title="Dashboard Internal Admin"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Dashboard Internal sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
