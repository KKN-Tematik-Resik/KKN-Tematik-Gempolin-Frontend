import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil & Keamanan Admin | Gempolin Kelurahan Gempolsari",
  description: "Profil dan Pengaturan Keamanan Akun Admin Kelurahan Gempolsari",
};

export default function ProfilAdminPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profil Admin" />
      <ComponentCard
        title="Profil & Keamanan Admin"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Modul Profil & Keamanan Admin sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}
