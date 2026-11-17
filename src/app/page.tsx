import ComponentCard from "@/components/common/component-card";
import PublicLayout from "@/layout/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Publik | Gempolin Kelurahan Gempolsari",
  description: "Papan Informasi Pengelolaan Sampah Warga Kelurahan Gempolsari",
};

export default function PublicDashboardPage() {
  return (
    <PublicLayout>
      <ComponentCard
        title="Dashboard Publik"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Dashboard Publik sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </PublicLayout>
  );
}
