"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, usePathname } from "@/i18n/navigation";
import {
  InfoCircleIcon,
  LayoutGridIcon,
  MapIcon,
  TrashBinIcon,
} from "@/icons";
import ThemeToggleButton from "@/layout/header/theme-toggler";
import { cn } from "@/utils";

export default function PublicHeader() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutGridIcon,
      isActive: pathname === "/",
    },
    {
      href: "/peta-partisipasi",
      label: "Peta Partisipasi",
      icon: MapIcon,
      isActive:
        pathname === "/peta-partisipasi" ||
        pathname.startsWith("/peta-partisipasi/"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Branding Kelurahan */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-400 dark:group-hover:bg-brand-900/60">
            <TrashBinIcon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-gray-900 sm:text-base dark:text-white">
              Gempolin
            </span>
            <span className="text-xs font-medium leading-tight text-gray-500 dark:text-gray-400">
              Kelurahan Gempolsari
            </span>
          </div>
        </Link>

        {/* Sisi Tengah: Navigasi Horizontal */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.isActive
                    ? "bg-brand-50 font-semibold text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden xs:inline sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sisi Kanan: Bantuan Istilah/Rumus & Theme Toggler (STRICT: Tanpa Link Login Admin) */}
        <div className="flex items-center gap-2 shrink-0">
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-gray-700 dark:text-gray-300"
                >
                  <InfoCircleIcon className="size-4 text-brand-600 dark:text-brand-400" />
                  <span className="hidden md:inline">Bantuan &amp; Rumus</span>
                </Button>
              }
            />
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Panduan Istilah &amp; Perhitungan</DialogTitle>
                <DialogDescription>
                  Penjelasan istilah dan cara penghitungan data pengelolaan sampah di
                  Kelurahan Gempolsari.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3.5 pt-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Tingkat Partisipasi Warga
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Persentase dihitung dari jumlah warga, kepala keluarga (KK), atau
                    rumah yang aktif memilah dan mengolah sampah dibagi dengan total
                    yang terdata di wilayah terkait dikalikan 100%.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Penghitungan Wilayah (RW &amp; Kelurahan)
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Angka capaian pada tingkat RW dan Kelurahan dihitung langsung dari
                    total kumulatif seluruh RT, bukan dari rata-rata persentase antar-RT.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Status Data Tidak Tersedia
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Jika suatu wilayah belum memiliki data terdata, sistem akan menampilkan
                    keterangan &quot;Data tidak tersedia&quot;. Angka 0 kg sampah terolah
                    tetap ditampilkan sebagai 0 kg.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Data Pengolahan Sampah
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    Menyajikan rekapitulasi sampah terolah melalui fasilitas Gempolin
                    serta sampah anorganik yang disalurkan melalui Bank Sampah.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
