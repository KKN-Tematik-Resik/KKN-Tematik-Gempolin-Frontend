import { mockAdminUsers } from "@/data/mock/super-admin-data";
import SuperAdminShell from "./components/super-admin-shell";

export const metadata = {
  title: "Kelola Admin | Super Admin Gempolin",
  description: "Daftar dan Pengelolaan Akun Admin Kelurahan Gempolsari",
};

export default function SuperAdminPage() {
  return <SuperAdminShell initialAdmins={mockAdminUsers} />;
}
