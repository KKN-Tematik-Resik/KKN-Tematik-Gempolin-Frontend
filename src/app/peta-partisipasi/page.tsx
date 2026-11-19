import PublicLayout from "@/layout/public-layout";
import type { Metadata } from "next";
import SpatialPageClient from "./components/spatial-page-client";

export const metadata: Metadata = {
  title: "Peta Partisipasi Spasial | Gempolin Kelurahan Gempolsari",
  description:
    "Visualisasi Geografis 5-Kelas Sebaran Partisipasi Pengelolaan Sampah Warga Kelurahan Gempolsari",
};

export default function PetaPartisipasiPage() {
  return (
    <PublicLayout>
      <SpatialPageClient />
    </PublicLayout>
  );
}
