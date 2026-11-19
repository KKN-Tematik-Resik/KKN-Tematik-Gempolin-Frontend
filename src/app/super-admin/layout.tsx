import AdminShell from "@/layout/app-layout/admin-shell";
import { superAdminNavItems } from "@/layout/app-layout/sidebar/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin — Gempolin Kelurahan Gempolsari",
  description: "Panel Super Admin Pengelolaan Akun Admin Kelurahan Gempolsari",
};

// Server Component: layout tidak butuh "use client".
// Menggunakan AdminShell yang identik dengan Admin Kelurahan, namun dengan 1 menu sidebar (CRUD User).
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell customNavItems={superAdminNavItems}>
      {children}
    </AdminShell>
  );
}
