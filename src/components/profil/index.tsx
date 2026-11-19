"use client";

import AdminAddressCard from "./admin-address-card";
import AdminInfoCard from "./admin-info-card";
import ChangePasswordCard from "./change-password-card";
import DangerZoneCard from "./danger-zone-card";
import type { AddressInfo, PersonalInfo } from "@/types/profil";

const defaultPersonalInfo: PersonalInfo = {
  fullName: "Admin Kelurahan Gempolsari",
  role: "Administrator Sistem",
  location: "Gempolsari, Kota Bandung",
  bio: "Admin Informasi Pengelolaan Sampah Gempolin",
  email: "admin@gempolsari.bandung.go.id",
  phone: "(022) 601-2345",
};

const defaultAddressInfo: AddressInfo = {
  streetAddress: "Jl. Cijerah, Gempolsari, Kec. Bandung Kulon",
  cityState: "Kota Bandung, Jawa Barat",
  postalCode: "40215",
  country: "Indonesia",
};

export default function ProfilSection() {
  return (
    <div className="space-y-6">
      {/* 1. Informasi Admin */}
      <AdminInfoCard initialData={defaultPersonalInfo} />

      {/* 2. Alamat Kantor Kelurahan */}
      <AdminAddressCard initialData={defaultAddressInfo} />

      {/* 3. Keamanan & Ganti Kata Sandi */}
      <ChangePasswordCard />

      {/* 4. Area Berisiko */}
      <DangerZoneCard />
    </div>
  );
}
