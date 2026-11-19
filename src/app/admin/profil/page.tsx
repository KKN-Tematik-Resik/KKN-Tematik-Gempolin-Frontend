import PageBreadcrumb from "@/components/common/page-breadcrumb";
import ProfilSection from "@/components/profil";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil & Keamanan Admin | Gempolin Kelurahan Gempolsari",
  description: "Profil dan Pengaturan Keamanan Akun Admin Kelurahan Gempolsari",
};

export default function ProfilAdminPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Profil & Keamanan Admin" />
      <ProfilSection />
    </div>
  );
}
