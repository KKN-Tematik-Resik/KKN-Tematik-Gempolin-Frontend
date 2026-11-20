"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { ParticipationIndicatorKey } from "@/types/spatial";
import {
  getRwList,
  getSpatialParticipationList,
} from "@/data/mock/spatial-participation";
import React, { useCallback, useMemo, useState, useTransition } from "react";
import SpatialFilterBar from "./spatial-filter-bar";
import SpatialLegend from "./spatial-legend";
import SpatialMapCanvas from "./spatial-map-canvas";
import type { SelectedRtInfo } from "./spatial-map-inner";
import SpatialDrawer from "./spatial-drawer";
import SpatialTableView from "./spatial-table-view";

const VALID_INDICATORS: ParticipationIndicatorKey[] = [
  "rumah_memilah",
  "rumah_mengolah",
  "kk_memilah",
  "kk_mengolah",
  "warga_memilah",
  "warga_mengolah",
];

export default function SpatialPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Membaca state dari URL SearchParams
  const rawIndicator = searchParams.get("indikator");
  const indicator: ParticipationIndicatorKey = VALID_INDICATORS.includes(
    rawIndicator as ParticipationIndicatorKey,
  )
    ? (rawIndicator as ParticipationIndicatorKey)
    : "rumah_memilah";

  const rw = searchParams.get("rw") || "all";
  const search = searchParams.get("search") || "";
  const view = (searchParams.get("view") === "table" ? "table" : "map") as
    | "map"
    | "table";

  // State lokal untuk filter kelas interaktif pada legenda
  const [activeClasses, setActiveClasses] = useState<number[]>([1, 2, 3, 4, 5]);

  // State pop-up wilayah RT terpilih
  const [selectedRt, setSelectedRt] = useState<SelectedRtInfo | null>(null);

  const rwList = useMemo(() => getRwList(), []);

  // Update query params secara atomik
  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all" || (key === "indikator" && value === "rumah_memilah") || (key === "view" && value === "map")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const handleIndicatorChange = (newInd: ParticipationIndicatorKey) => {
    updateQuery({ indikator: newInd });
    setSelectedRt(null);
  };

  const handleRwChange = (newRw: string) => {
    updateQuery({ rw: newRw });
    setSelectedRt(null);
  };

  const handleSearchChange = (val: string) => {
    updateQuery({ search: val || null });
  };

  const handleViewChange = (newView: "map" | "table") => {
    updateQuery({ view: newView });
  };

  const handleReset = () => {
    setActiveClasses([1, 2, 3, 4, 5]);
    setSelectedRt(null);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Toggle kelas pada legenda
  const handleToggleClass = (classNum: number) => {
    setActiveClasses((prev) => {
      if (prev.includes(classNum)) {
        // Jika hanya tersisa satu kelas, jangan kosongkan semua
        if (prev.length === 1) return [1, 2, 3, 4, 5];
        return prev.filter((c) => c !== classNum);
      }
      return [...prev, classNum];
    });
  };

  // Seluruh 67 data RT untuk indikator aktif
  const allIndicatorItems = useMemo(
    () => getSpatialParticipationList({ indicator, rw: "all" }),
    [indicator],
  );

  // Rekap jumlah RT per kelas untuk disuplai ke legenda
  const countsByClass = useMemo(() => {
    const counts: Record<number | "none", number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      none: 0,
    };
    allIndicatorItems.forEach((item) => {
      if (item.participationClass === null) {
        counts.none += 1;
      } else {
        counts[item.participationClass] =
          (counts[item.participationClass] || 0) + 1;
      }
    });
    return counts;
  }, [allIndicatorItems]);

  // Data terfilter sesuai parameter aktif
  const filteredItems = useMemo(
    () =>
      getSpatialParticipationList({
        indicator,
        rw,
        search,
        classes: activeClasses,
      }),
    [indicator, rw, search, activeClasses],
  );

  // Callback saat RT diklik di peta atau tombol tabel
  const handleSelectRtFromMap = useCallback((info: SelectedRtInfo) => {
    setSelectedRt(info);
  }, []);

  const handleSelectRtFromTable = useCallback(
    (targetRt: string, targetRw: string) => {
      const found = allIndicatorItems.find(
        (item) => item.rt === targetRt && item.rw === targetRw,
      );
      if (found) {
        setSelectedRt({
          rt: found.rt,
          rw: found.rw,
          percentage: found.percentage,
          numerator: found.numerator,
          denominator: found.denominator,
          statusLabel: found.statusLabel,
          // shortcut: flyTo tidak dipakai dari tabel; gunakan pusat kelurahan sebagai placeholder
          lngLat: [107.55331, -6.93225],
        });
        // Beralih ke tampilan peta jika pengguna berada di tampilan tabel
        if (view === "table") {
          updateQuery({ view: "map" });
        }
      }
    },
    [allIndicatorItems, view, updateQuery],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Halaman Spasial */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
          Peta Partisipasi Spasial
        </h1>
        <p className="text-sm font-medium text-gray-600 sm:text-base dark:text-gray-400">
          Visualisasi geografis sebaran 5-kelas partisipasi pilah-olah sampah di
          67 RT Kelurahan Gempolsari.
        </p>
      </div>

      {/* Bilah Kontrol Terpadu */}
      <SpatialFilterBar
        indicator={indicator}
        rw={rw}
        rwList={rwList}
        search={search}
        view={view}
        onIndicatorChange={handleIndicatorChange}
        onRwChange={handleRwChange}
        onSearchChange={handleSearchChange}
        onViewChange={handleViewChange}
        onReset={handleReset}
      />

      {/* Konten Utama: Peta atau Tabel */}
      {view === "map" ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          {/* Kanvas Peta MapLibre */}
          <SpatialMapCanvas
            items={filteredItems}
            activeClasses={activeClasses}
            onSelectRt={handleSelectRtFromMap}
          />

          {/* Legenda Mengambang (Desktop: Kanan Bawah) */}
          <div className="pointer-events-auto absolute bottom-4 end-4 z-10 max-w-xs">
            <SpatialLegend
              activeClasses={activeClasses}
              onToggleClass={handleToggleClass}
              countsByClass={countsByClass}
            />
          </div>
        </div>
      ) : (
        /* Mode Fallback Tabel Spasial */
        <SpatialTableView
          items={filteredItems}
          onSelectRt={handleSelectRtFromTable}
        />
      )}

      {/* Side Drawer Rapor Lengkap RT (Demografi & 6 Indikator) */}
      <SpatialDrawer
        rt={selectedRt?.rt ?? null}
        rw={selectedRt?.rw ?? null}
        isOpen={selectedRt !== null}
        onClose={() => setSelectedRt(null)}
      />
    </div>
  );
}
