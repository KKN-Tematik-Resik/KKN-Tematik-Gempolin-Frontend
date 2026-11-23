"use client";

import { useMemo, useState } from "react";
import type {
  MonthlyTrendItem,
  PublicFilterState,
  PublicParticipationIndicators,
  PublicRtItem,
} from "@/types/public-dashboard";
import DemographicCards from "./demographic-cards";
import OperationalSummaryCard from "./operational-summary-card";
import ParticipationDonutChart from "./participation-donut-chart";
import PublicFilterPanel from "./public-filter-panel";
import PublicHeroHeader from "./public-hero-header";
import RtWasteBarChart from "./rt-waste-bar-chart";

interface PublicDashboardClientWrapperProps {
  initialRtData: PublicRtItem[];
  monthlyTrends: MonthlyTrendItem[];
  meta: {
    lastUpdatedWib: string;
    activePeriodLabel: string;
  };
}

export default function PublicDashboardClientWrapper({
  initialRtData,
  monthlyTrends,
  meta,
}: PublicDashboardClientWrapperProps) {
  const [filter, setFilter] = useState<PublicFilterState>({
    periode: "2026-11",
    rw: "all",
    rt: "all",
  });

  // 1. Ekstrak daftar RW unik yang tersedia
  const availableRws = useMemo(() => {
    const rws = Array.from(new Set(initialRtData.map((d) => d.rw)));
    return rws.sort((a, b) => a.localeCompare(b));
  }, [initialRtData]);

  // 2. Ekstrak daftar RT unik sesuai RW terpilih (cascading)
  const availableRts = useMemo(() => {
    if (filter.rw === "all") return [];
    const rts = initialRtData
      .filter((d) => d.rw === filter.rw)
      .map((d) => d.rt);
    return Array.from(new Set(rts)).sort((a, b) => a.localeCompare(b));
  }, [initialRtData, filter.rw]);

  // 3. Filter data baris RT aktif
  const filteredRtData = useMemo(() => {
    return initialRtData.filter((item) => {
      if (filter.rw !== "all" && item.rw !== filter.rw) return false;
      if (filter.rt !== "all" && item.rt !== filter.rt) return false;
      return true;
    });
  }, [initialRtData, filter.rw, filter.rt]);

  // 4. Label cakupan wilayah saat ini
  const scopeLabel = useMemo(() => {
    if (filter.rw === "all") return "Kelurahan Gempolsari";
    if (filter.rt === "all") return filter.rw;
    return `${filter.rw} · ${filter.rt}`;
  }, [filter.rw, filter.rt]);

  // 5. Agregasi data Demografi (Rumah, KK, Jiwa)
  const { totalRumah, totalKk, totalWarga } = useMemo(() => {
    return filteredRtData.reduce(
      (acc, item) => ({
        totalRumah: acc.totalRumah + (item.totalRumah ?? 0),
        totalKk: acc.totalKk + (item.totalKk ?? 0),
        totalWarga: acc.totalWarga + (item.totalWarga ?? 0),
      }),
      { totalRumah: 0, totalKk: 0, totalWarga: 0 },
    );
  }, [filteredRtData]);

  // 6. Agregasi 6 Indikator Inti Partisipasi (Sesuai Aturan BR-05, BR-06, & BR-07)
  const indicators: PublicParticipationIndicators = useMemo(() => {
    let rMemilahNum = 0;
    let rMemilahDen = 0;
    let rMengolahNum = 0;
    let rMengolahDen = 0;

    let kkMemilahNum = 0;
    let kkMemilahDen = 0;
    let kkMengolahNum = 0;
    let kkMengolahDen = 0;

    let wMemilahNum = 0;
    let wMemilahDen = 0;
    let wMengolahNum = 0;
    let wMengolahDen = 0;

    for (const item of filteredRtData) {
      if (item.totalRumah !== null && item.totalRumah > 0) {
        rMemilahDen += item.totalRumah;
        rMemilahNum += item.rumahMemilah ?? 0;
        rMengolahDen += item.totalRumah;
        rMengolahNum += item.rumahMengolah ?? 0;
      }
      if (item.totalKk !== null && item.totalKk > 0) {
        kkMemilahDen += item.totalKk;
        kkMemilahNum += item.kkMemilah ?? 0;
        kkMengolahDen += item.totalKk;
        kkMengolahNum += item.kkMengolah ?? 0;
      }
      if (item.totalWarga !== null && item.totalWarga > 0) {
        wMemilahDen += item.totalWarga;
        wMemilahNum += item.wargaMemilah ?? 0;
        wMengolahDen += item.totalWarga;
        wMengolahNum += item.wargaMengolah ?? 0;
      }
    }

    const calcPct = (num: number, den: number): number | null => {
      if (den <= 0) return null; // BR-07: Penyebut 0 menghasilkan null
      return (num / den) * 100;
    };

    return {
      rumahMemilah: {
        numerator: rMemilahNum,
        denominator: rMemilahDen,
        percentage: calcPct(rMemilahNum, rMemilahDen),
      },
      rumahMengolah: {
        numerator: rMengolahNum,
        denominator: rMengolahDen,
        percentage: calcPct(rMengolahNum, rMengolahDen),
      },
      kkMemilah: {
        numerator: kkMemilahNum,
        denominator: kkMemilahDen,
        percentage: calcPct(kkMemilahNum, kkMemilahDen),
      },
      kkMengolah: {
        numerator: kkMengolahNum,
        denominator: kkMengolahDen,
        percentage: calcPct(kkMengolahNum, kkMengolahDen),
      },
      wargaMemilah: {
        numerator: wMemilahNum,
        denominator: wMemilahDen,
        percentage: calcPct(wMemilahNum, wMemilahDen),
      },
      wargaMengolah: {
        numerator: wMengolahNum,
        denominator: wMengolahDen,
        percentage: calcPct(wMengolahNum, wMengolahDen),
      },
    };
  }, [filteredRtData]);

  // 7. Agregasi Gempolin pada cakupan wilayah aktif
  const { totalRequests, totalGempolinKg } = useMemo(() => {
    return filteredRtData.reduce(
      (acc, item) => ({
        totalRequests: acc.totalRequests + (item.gempolinRequests ?? 0),
        totalGempolinKg: acc.totalGempolinKg + (item.gempolinProcessedKg ?? 0),
      }),
      { totalRequests: 0, totalGempolinKg: 0 },
    );
  }, [filteredRtData]);

  return (
    <div className="space-y-6">
      {/* 1. Header Informasi & Link Peta Spasial */}
      <PublicHeroHeader
        lastUpdatedWib={meta.lastUpdatedWib}
        activePeriodLabel={meta.activePeriodLabel}
      />

      {/* 2. Filter Bar Wilayah & Waktu */}
      <PublicFilterPanel
        filter={filter}
        onChangeFilter={setFilter}
        availableRws={availableRws}
        availableRts={availableRts}
      />

      {/* 3. Ringkasan Angka Kunci (4 Metrik Utama) */}
      <DemographicCards
        totalRumah={totalRumah}
        totalKk={totalKk}
        totalWarga={totalWarga}
        totalProcessedKg={totalGempolinKg}
      />

      {/* 4. Visual Utama 1: Donut Chart Partisipasi [Rumah | KK | Warga] + Rincian 6 Indikator */}
      <ParticipationDonutChart indicators={indicators} />

      {/* 5. Visual Utama 2: Vertikal Bar Chart Sebaran kg per Wilayah */}
      <RtWasteBarChart rtItems={filteredRtData} scopeLabel={scopeLabel} />

      {/* 6. Rekapitulasi Operasional Layanan (Gempolin) */}
      <OperationalSummaryCard
        totalRequests={totalRequests}
        totalProcessedKg={totalGempolinKg}
        monthlyTrends={monthlyTrends}
        allRtData={initialRtData}
        availableRws={availableRws}
        initialRw={filter.rw}
        initialRt={filter.rt}
      />
    </div>
  );
}
