"use client";

import { usePathname, useRouter, useSearchParams } from "@/i18n/navigation";
import { useCallback, useTransition } from "react";

export function useDashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper untuk membaca nilai filter saat ini
  const getFilter = useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams],
  );

  // Helper untuk mengupdate satu atau beberapa parameter URL secara atomik
  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Transisi non-blocking untuk performa UI instan
      startTransition(() => {
        router.push(targetUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // FR-06: Tombol Reset Filter ke kondisi default agregat kelurahan
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    getFilter,
    setFilters,
    resetFilters,
    isPending,
  };
}
