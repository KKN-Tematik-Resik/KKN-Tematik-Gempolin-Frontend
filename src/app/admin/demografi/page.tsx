import PageBreadcrumb from "@/components/common/page-breadcrumb";
import type { Metadata } from "next";
import DemografiClient from "./demografi-client";
import { mockDemografiDataset } from "./mock-data";

export const metadata: Metadata = {
  title: "Demografi & 6 Indikator Partisipasi | Gempolin Kelurahan Gempolsari",
  description:
    "Analisis mendalam data demografi dan 6 indikator pilah-olah sampah warga Kelurahan Gempolsari",
};

export default function DemografiPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Demografi & 6 Indikator Partisipasi" />
      <DemografiClient initialData={mockDemografiDataset} />
    </div>
  );
}
