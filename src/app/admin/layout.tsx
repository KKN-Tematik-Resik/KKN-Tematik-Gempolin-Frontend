import AdminShell from "@/layout/app-layout/admin-shell";

// Server Component: layout tidak butuh "use client".
// Interaktivitas sidebar/header ditangani oleh AdminShell (client leaf).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
