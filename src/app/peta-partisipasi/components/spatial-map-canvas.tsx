// Wrapper SSR-safe untuk SpatialMapInner: dynamic import mencegah MapLibre di-bundle di server.
"use client";

import dynamic from "next/dynamic";
import type { SpatialSummaryItem } from "@/types/spatial";
import type { SelectedRtInfo } from "./spatial-map-inner";

interface SpatialMapCanvasProps {
  items: SpatialSummaryItem[];
  activeClasses: number[];
  onSelectRt?: (info: SelectedRtInfo) => void;
}

// Skeleton loader berukuran identik — cegah CLS (Cumulative Layout Shift)
function MapSkeleton() {
  return (
    <div
      className="h-[520px] w-full animate-pulse rounded-xl bg-gray-100 sm:h-[620px] lg:h-[700px] dark:bg-gray-800"
      aria-busy="true"
      aria-label="Memuat peta..."
    />
  );
}

const SpatialMapInner = dynamic(() => import("./spatial-map-inner"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function SpatialMapCanvas({
  items,
  activeClasses,
  onSelectRt,
}: SpatialMapCanvasProps) {
  return (
    <SpatialMapInner
      items={items}
      activeClasses={activeClasses}
      onSelectRt={onSelectRt}
    />
  );
}
