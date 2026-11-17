import ComponentCard from "@/components/common/component-card";
import PublicLayout from "@/layout/public-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta Partisipasi Spasial | Gempolin Kelurahan Gempolsari",
  description: "Peta Partisipasi Spasial Pengelolaan Sampah Warga Kelurahan Gempolsari",
};

export default function PetaPartisipasiPage() {
  return (
    <PublicLayout>
      <ComponentCard
        title="Peta Partisipasi Spasial"
        desc="Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
      >
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Peta Partisipasi Spasial sedang disiapkan.
          </p>
        </div>
      </ComponentCard>
    </PublicLayout>
  );
}
