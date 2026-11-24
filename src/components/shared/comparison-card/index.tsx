import { TaskIcon, TrashBinIcon } from "@/icons";
import {
  calculateDelta,
  formatNumber,
  formatWeightKg,
} from "@/utils";
import React from "react";
import MetricComparisonBox from "./metric-comparison-box";

export interface ComparisonCardProps {
  currentLabel: string;
  previousLabel: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  currentRequest: number;
  previousRequest: number;
}

export default function ComparisonCard({
  currentLabel,
  previousLabel,
  currentValue,
  previousValue,
  unit,
  currentRequest,
  previousRequest,
}: ComparisonCardProps) {
  const tonaseDelta = calculateDelta(currentValue, previousValue);
  const requestDelta = calculateDelta(currentRequest, previousRequest);

  const tonaseSign = tonaseDelta.absolute > 0 ? "+" : "";
  const requestSign = requestDelta.absolute > 0 ? "+" : "";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Kartu 1: Khusus Komparasi Permintaan Layanan (request) */}
      <MetricComparisonBox
        icon={<TaskIcon className="size-5" />}
        title="Total Permintaan Layanan"
        unitSubtitle="Frekuensi order penjemputan sampah warga"
        currentLabel={currentLabel}
        previousLabel={previousLabel}
        currentDisplay={`${formatNumber(currentRequest)} request`}
        previousDisplay={`${formatNumber(previousRequest)} request`}
        deltaAbsolute={requestDelta.absolute}
        deltaDisplay={`${requestSign}${formatNumber(requestDelta.absolute)} request`}
        deltaPercentage={requestDelta.percentage}
        deltaLabel="Selisih Permintaan"
      />

      {/* Kartu 2: Khusus Komparasi Sampah Terolah (kg) */}
      <MetricComparisonBox
        icon={<TrashBinIcon className="size-5" />}
        title="Total Sampah Terolah"
        unitSubtitle="Volume sampah organik diproses (kg)"
        currentLabel={currentLabel}
        previousLabel={previousLabel}
        currentDisplay={formatWeightKg(currentValue)}
        previousDisplay={formatWeightKg(previousValue)}
        deltaAbsolute={tonaseDelta.absolute}
        deltaDisplay={`${tonaseSign}${formatNumber(tonaseDelta.absolute)} ${unit}`}
        deltaPercentage={tonaseDelta.percentage}
        deltaLabel="Selisih Tonase"
      />
    </div>
  );
}
