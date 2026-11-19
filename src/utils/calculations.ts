/**
 * Utility functions for domain calculations (Gempolin).
 */

export interface DeltaResult {
  absolute: number;
  percentage: number | null;
}

/**
 * Calculates absolute and percentage change between current and previous values.
 * In accordance with BR-07, if previous value is 0 or less, percentage returns null.
 */
export function calculateDelta(current: number, previous: number): DeltaResult {
  const absolute = current - previous;
  if (previous <= 0) {
    return { absolute, percentage: null };
  }
  const percentage = Math.round(((current - previous) / previous) * 100);
  return { absolute, percentage };
}

/**
 * Type guard to check if a numeric data value is valid and available (BR-07).
 */
export function isDataAvailable(value: number | null | undefined): value is number {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}
