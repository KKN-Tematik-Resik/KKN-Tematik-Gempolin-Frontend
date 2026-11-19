"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, MapLayerMouseEvent, LayerSpecification, StyleSpecification } from "maplibre-gl";
import { getParticipationColor } from "@/utils/calculations";
import type { SpatialSummaryItem, ParticipationClass } from "@/types/spatial";
import { useTheme } from "@/context/theme-context";

export interface SelectedRtInfo {
  rt: string;
  rw: string;
  percentage: number | null;
  numerator: number;
  denominator: number;
  statusLabel: string;
  lngLat: [number, number];
}

interface HoverTooltipState {
  rt: string;
  rw: string;
  percentage: number | null;
  statusLabel: string;
  pClass: ParticipationClass;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
}

interface SpatialMapInnerProps {
  items: SpatialSummaryItem[];
  activeClasses: number[];
  onSelectRt?: (info: SelectedRtInfo) => void;
}

const GEMPOLSARI_CENTER: [number, number] = [107.55331, -6.93225];
const GEMPOLSARI_ZOOM = 14.5;
const GEOJSON_URL = "/data/gempolsari-rt.geojson";
const SOURCE_ID = "rt-boundaries";
const FILL_LAYER_ID = "rt-fill";
const LINE_LAYER_ID = "rt-line";
const HOVER_LAYER_ID = "rt-fill-hover";
const HOVER_LINE_LAYER_ID = "rt-line-hover";

const CARTO_POSITRON =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const CARTO_DARK_MATTER =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function getCustomLayers(
  isDark: boolean,
  fillColor: unknown[],
): LayerSpecification[] {
  return [
    {
      id: FILL_LAYER_ID,
      type: "fill",
      source: SOURCE_ID,
      paint: {
        "fill-color": fillColor as never,
        "fill-opacity": 0.78,
      },
    },
    {
      id: LINE_LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      paint: {
        "line-color": isDark ? "#0B0F19" : "#FFFFFF",
        "line-width": 1.5,
      },
    },
    {
      id: HOVER_LAYER_ID,
      type: "fill",
      source: SOURCE_ID,
      paint: {
        "fill-color": isDark ? "#FFFFFF" : "#000000",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.12,
          0,
        ] as never,
      },
    },
    {
      id: HOVER_LINE_LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      paint: {
        "line-color": isDark ? "#38BDF8" : "#0F172A",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          0,
        ] as never,
      },
    },
  ];
}

/** Menambahkan source GeoJSON + 4 layer peta (isi, garis, hover-fill, hover-garis) ke map */
function addMapLayers(map: MapLibreMap, isDark: boolean, fillColor: unknown[]) {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: GEOJSON_URL,
      promoteId: "OBJECTID",
    });
  }
  const layers = getCustomLayers(isDark, fillColor);
  for (const layer of layers) {
    if (!map.getLayer(layer.id)) {
      map.addLayer(layer);
    }
  }
}

/** Membangun ekspresi MapLibre data-driven fill-color dari 67 item SpatialSummaryItem */
function buildFillColorExpression(
  items: SpatialSummaryItem[],
  isDark: boolean,
): unknown[] {
  const expr: unknown[] = ["case"];

  for (const item of items) {
    const color = getParticipationColor(item.participationClass, isDark);
    expr.push(
      [
        "all",
        ["==", ["get", "RT"], item.rt],
        ["==", ["get", "RW"], item.rw],
      ],
      color,
    );
  }

  // Default: abu-abu jika tidak ada data yang cocok
  expr.push(isDark ? "#4B5563" : "#D1D5DB");
  return expr;
}

export default function SpatialMapInner({
  items,
  activeClasses,
  onSelectRt,
}: SpatialMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltipState | null>(
    null,
  );
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;
  const activeClassesRef = useRef(activeClasses);
  activeClassesRef.current = activeClasses;

  // Inisialisasi peta saat mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Import maplibre-gl secara dinamis di dalam useEffect agar aman SSR
    let maplibre: typeof import("maplibre-gl");
    let map: MapLibreMap;

    const init = async () => {
      maplibre = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");

      // Mengatasi error Web Worker MapLibre v6 pada bundler Next.js (Webpack/Turbopack)
      if (typeof window !== "undefined") {
        maplibre.setWorkerUrl(
          `${window.location.origin}/maplibre/maplibre-gl-worker.mjs`,
        );
      }

      const initialIsDark = isDarkRef.current;
      map = new maplibre.Map({
        container: containerRef.current!,
        style: initialIsDark ? CARTO_DARK_MATTER : CARTO_POSITRON,
        center: GEMPOLSARI_CENTER,
        zoom: GEMPOLSARI_ZOOM,
        attributionControl: false,
      });

      map.addControl(
        new maplibre.NavigationControl({ showCompass: false }),
        "top-right",
      );

      map.addControl(
        new maplibre.AttributionControl({ compact: true }),
        "bottom-right",
      );

      map.on("load", () => {
        const fillColor = buildFillColorExpression(itemsRef.current, isDark);
        addMapLayers(map, isDark, fillColor);

        // Interaksi hover: ubah kursor dan aktifkan feature-state hover + tooltip kursor
        let hoveredFeatureId: string | number | null = null;

        map.on("mousemove", FILL_LAYER_ID, (e: MapLayerMouseEvent) => {
          if (e.features && e.features.length > 0) {
            map.getCanvas().style.cursor = "pointer";
            const feature = e.features[0];
            const newHoveredId = feature.id ?? null;

            // Hanya perbarui feature-state jika kursor berpindah poligon
            if (hoveredFeatureId !== newHoveredId) {
              if (hoveredFeatureId !== null) {
                map.setFeatureState(
                  { source: SOURCE_ID, id: hoveredFeatureId },
                  { hover: false },
                );
              }
              hoveredFeatureId = newHoveredId;
              if (hoveredFeatureId !== null) {
                map.setFeatureState(
                  { source: SOURCE_ID, id: hoveredFeatureId },
                  { hover: true },
                );
              }
            }

            const props = feature.properties as {
              RT: string;
              RW: string;
            };

            const found = itemsRef.current.find(
              (item) => item.rt === props.RT && item.rw === props.RW,
            );

            if (found) {
              // Baca dimensi kontainer saat event terjadi agar akurat setelah resize
              const w = containerRef.current?.clientWidth ?? 800;
              const h = containerRef.current?.clientHeight ?? 600;
              setHoverTooltip({
                rt: found.rt,
                rw: found.rw,
                percentage: found.percentage,
                statusLabel: found.statusLabel,
                pClass: found.participationClass,
                x: e.point.x,
                y: e.point.y,
                containerWidth: w,
                containerHeight: h,
              });
            }
          }
        });

        map.on("mouseleave", FILL_LAYER_ID, () => {
          map.getCanvas().style.cursor = "";
          if (hoveredFeatureId !== null) {
            map.setFeatureState(
              { source: SOURCE_ID, id: hoveredFeatureId },
              { hover: false },
            );
            hoveredFeatureId = null;
          }
          setHoverTooltip(null);
        });

        // Interaksi klik: smooth flyTo dan picu callback detail rapor RT/RW
        map.on("click", FILL_LAYER_ID, (e: MapLayerMouseEvent) => {
          if (!e.features || e.features.length === 0 || !onSelectRt) return;

          const props = e.features[0].properties as {
            RT: string;
            RW: string;
          };

          // Cari data partisipasi untuk poligon yang diklik
          const found = itemsRef.current.find(
            (item) => item.rt === props.RT && item.rw === props.RW,
          );

          if (!found) return;

          map.flyTo({
            center: [e.lngLat.lng, e.lngLat.lat],
            zoom: 15.5,
            duration: 700,
            essential: true,
          });

          onSelectRt({
            rt: found.rt,
            rw: found.rw,
            percentage: found.percentage,
            numerator: found.numerator,
            denominator: found.denominator,
            statusLabel: found.statusLabel,
            lngLat: [e.lngLat.lng, e.lngLat.lat],
          });
        });
      });

      mapRef.current = map;
    };

    void init();

    return () => {
      if (map) map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Perbarui warna poligon saat items atau activeClasses berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Filter: sembunyikan kelas yang tidak aktif dengan opacity 0
    const visibleItems = items.filter((item) => {
      if (activeClasses.length === 0) return true;
      const pClass = item.participationClass;
      if (pClass === null) return true; // selalu tampilkan "Data Tidak Tersedia"
      return activeClasses.includes(pClass);
    });

    const fillColor = buildFillColorExpression(visibleItems, isDark);
    if (map.getLayer(FILL_LAYER_ID)) {
      map.setPaintProperty(FILL_LAYER_ID, "fill-color", fillColor as never);
    }
  }, [items, activeClasses, isDark]);

  // Perbarui basemap saat tema berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Filter item sesuai kelas aktif agar warna poligon sinkron saat tema berpindah
    const visibleItems = itemsRef.current.filter((item) => {
      if (activeClassesRef.current.length === 0) return true;
      const pClass = item.participationClass;
      if (pClass === null) return true;
      return activeClassesRef.current.includes(pClass);
    });
    const fillColor = buildFillColorExpression(visibleItems, isDark);

    // Re-attach layers setelah style baru dimuat sebagai jaring pengaman fallback
    const onStyleLoad = () => {
      addMapLayers(map, isDark, fillColor);
    };

    map.once("style.load", onStyleLoad);

    // Gunakan diff: false agar style swap memicu reload penuh dan transformStyle menginjeksi layer secara atomik
    map.setStyle(isDark ? CARTO_DARK_MATTER : CARTO_POSITRON, {
      diff: false,
      transformStyle: (_prev: StyleSpecification | undefined, nextStyle: StyleSpecification) => ({
        ...nextStyle,
        sources: {
          ...nextStyle.sources,
          [SOURCE_ID]: {
            type: "geojson",
            data: GEOJSON_URL,
            promoteId: "OBJECTID",
          },
        },
        layers: [
          ...nextStyle.layers,
          ...getCustomLayers(isDark, fillColor),
        ],
      }),
    });

    // Cleanup: batalkan listener jika isDark berubah lagi sebelum style selesai dimuat
    return () => {
      map.off("style.load", onStyleLoad);
    };
  }, [isDark]);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl sm:h-[620px] lg:h-[700px]">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Peta Partisipasi Spasial Kelurahan Gempolsari"
        role="img"
      />

      {/* Floating Micro-Tooltip saat kursor di atas poligon RT */}
      {hoverTooltip && (
        <div
          className="pointer-events-none absolute z-30 w-48 rounded-lg border border-gray-200 bg-white/95 p-2.5 shadow-lg backdrop-blur-md transition-transform duration-75 dark:border-gray-700 dark:bg-gray-900/95"
          style={{
            left: `${
              hoverTooltip.x > hoverTooltip.containerWidth - 210
                ? hoverTooltip.x - 202
                : hoverTooltip.x + 14
            }px`,
            top: `${
              hoverTooltip.y > hoverTooltip.containerHeight - 95
                ? hoverTooltip.y - 90
                : hoverTooltip.y + 14
            }px`,
          }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 dark:border-gray-800">
            <span className="font-semibold text-gray-900 text-xs dark:text-white">
              {hoverTooltip.rt} / {hoverTooltip.rw}
            </span>
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: getParticipationColor(
                  hoverTooltip.pClass,
                  isDark,
                ),
              }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {hoverTooltip.statusLabel}
            </span>
            <span className="font-bold text-gray-900 text-xs tabular-nums dark:text-white">
              {hoverTooltip.percentage !== null
                ? `${hoverTooltip.percentage.toFixed(1)}%`
                : "N/A"}
            </span>
          </div>
          <div className="mt-1 border-t border-gray-100 pt-1 text-[10px] text-gray-500 italic dark:border-gray-800 dark:text-gray-400">
            (Klik untuk rapor lengkap)
          </div>
        </div>
      )}
    </div>
  );
}
