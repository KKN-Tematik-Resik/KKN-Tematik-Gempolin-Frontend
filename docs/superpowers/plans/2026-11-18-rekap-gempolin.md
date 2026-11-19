# Rekap Pengolahan Gempolin (A-03) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun halaman `/admin/gempolin` (A-03) yang menampilkan rekap pengolahan sampah Gempolin — KPI bulanan, kartu komparasi periode, grafik tren harian, tabel per-RT, dan tabel rincian harian — menggunakan mock data statis.

**Architecture:** Server Component (`page.tsx`) mengimpor `gempolinMockData` dari `mock-data.ts` dan mendistribusikannya sebagai props ke komponen-komponen daun Client Component. Semua kalkulasi dilakukan di server via pure utility functions. Komponen chart dan tooltip adalah satu-satunya leaf yang membutuhkan `"use client"`.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · ApexCharts (dynamic import SSR=false) · Base UI Tooltip · `@/components/ui/table` · `@/icons`

**Spec:** `docs/superpowers/specs/02-gempolsari-dashboard-spec.md` (halaman A-03, FR-27, BR-03, BR-04, BR-07)

## Global Constraints

- Zero `any` — semua tipe eksplisit; gunakan `unknown` + zod untuk data eksternal
- `"use client"` DILARANG di `page.tsx` dan `layout.tsx` — hanya di komponen daun
- Import ikon hanya dari `@/icons` — DILARANG inline `<svg>`
- ApexCharts WAJIB `dynamic(() => import("react-apexcharts"), { ssr: false })`
- Navigasi dari `@/i18n/navigation` — DILARANG `next/link` atau `next/navigation`
- Semua angka KPI/tabel wajib class `tabular-nums`
- Setiap class warna wajib memiliki pasangan `dark:`
- Folder name: pure kebab-case — DILARANG tanda kurung `(...)`
- `key={index}` DILARANG pada list dinamis — gunakan ID unik
- Periksa: `npm run lint` (0 error) + `npx tsc --noEmit` (0 error) setelah setiap task
- DILARANG `npm run build` kecuali user minta eksplisit

## Review Focus

1. **Penyebut nol (BR-07):** Jika `totalTerolah === 0` atau RT tidak ada transaksi, tampilkan badge `"Data tidak tersedia"` — bukan `0 kg`. Task 2 & 7 yang menangani ini.
2. **BR-03 tooltip:** Kolom "Berat Verifikasi" di tabel RT WAJIB ada tooltip yang menjelaskan perbedaan berat verifikasi vs berat terolah. Task 7.
3. **BR-04 zona waktu WIB:** Semua tampilan tanggal/waktu di tabel harian harus dikonversi ke WIB (`UTC+7`). Task 2 (formatter) + Task 8.
4. **FR-27 selisih absolut + persen:** Kartu komparasi harus menampilkan nilai selisih dan persentase perubahan. Jika periode sebelumnya = 0, tampilkan "—" bukan `Infinity%`. Task 5.
5. **Render kondisional numerik:** Jangan gunakan `count && <Component />` — gunakan ternary. Reviewer harus memeriksa semua komponen. Task 4, 5, 7.

---

## File Structure

```
src/
├── types/
│   └── gempolin.ts                              [CREATE] Domain types
├── utils/
│   ├── calculations.ts                          [CREATE] Pure business logic calculators
│   ├── formatters.ts                            [CREATE] Display formatters (WIB, kg, %)
│   └── index.ts                                 [MODIFY] Re-export calculations & formatters
├── components/
│   └── shared/
│       ├── metric-card/
│       │   └── index.tsx                        [CREATE] KPI card reusable
│       ├── comparison-card/
│       │   └── index.tsx                        [CREATE] Periode comparison card (FR-27)
│       ├── gempolin-trend-chart/
│       │   └── index.tsx                        [CREATE] ApexCharts line chart (client)
│       ├── gempolin-rt-table/
│       │   └── index.tsx                        [CREATE] Table per-RT dengan BR-03 tooltip
│       └── gempolin-daily-table/
│           └── index.tsx                        [CREATE] Table rincian harian
└── app/
    └── admin/
        └── gempolin/
            ├── mock-data.ts                     [CREATE] 30-day mock dataset
            └── page.tsx                         [MODIFY] Server Component assembly
```

---

## Task 1: Domain Types

**Files:**
- Create: `src/types/gempolin.ts`

**Interfaces:**
- Produces: `GempolinHarian`, `GempolinRtSummary`, `GempolinPeriodeSummary`, `GempolinMockData` — semua digunakan oleh Task 3, 4, 5, 6, 7, 8, 9

- [ ] **Step 1: Buat `src/types/gempolin.ts`** dengan isi berikut:

```typescript
export interface GempolinHarian {
  tanggal: string;          // ISO date string "YYYY-MM-DD", zona WIB
  beratTerolah: number;     // kg, berat yang benar-benar diolah
  beratVerifikasi: number;  // kg, berat setelah verifikasi (berbeda makna — BR-03)
  rtId: string;             // e.g. "RT-01"
  rtNama: string;           // e.g. "RT 01"
  requestCount: number;     // jumlah request pengolahan hari itu
}

export interface GempolinRtSummary {
  rtId: string;
  rtNama: string;
  totalRequest: number;
  totalTerolah: number;     // kg
  totalVerifikasi: number;  // kg
}

export interface GempolinPeriodeSummary {
  periode: string;          // "2026-11" (YYYY-MM)
  label: string;            // "November 2026"
  totalRequest: number;
  totalTerolah: number;     // kg
}

export interface GempolinMockData {
  periode: GempolinPeriodeSummary;
  periodeSebelumnya: GempolinPeriodeSummary;
  harian: GempolinHarian[];
  perRt: GempolinRtSummary[];
}
```

- [ ] **Step 2: Verifikasi TypeScript**

  Run: `npx tsc --noEmit`
  Expected: 0 error

---

## Task 2: Utility Helpers

**Files:**
- Create: `src/utils/calculations.ts`
- Create: `src/utils/formatters.ts`
- Modify: `src/utils/index.ts`

**Interfaces:**
- Consumes: `GempolinRtSummary[]` dari Task 1
- Produces:
  - `calculateDelta(current: number, previous: number): { absolute: number; percentage: number | null }`
  - `formatWeightKg(value: number | null): string`
  - `formatWibDate(isoDate: string): string`
  - `formatPercentageDelta(percentage: number | null): string`

- [ ] **Step 1: Buat `src/utils/calculations.ts`**

  Implementasikan fungsi-fungsi berikut:
  - `calculateDelta(current: number, previous: number): { absolute: number; percentage: number | null }` — jika `previous === 0` kembalikan `{ absolute: current - previous, percentage: null }`
  - `isDataAvailable(value: number | null): value is number` — type guard, true jika value !== null && value > 0 (untuk BR-07 check)

  > **Test BR-07:** `calculateDelta(100, 0)` → `{ absolute: 100, percentage: null }`
  > **Test normal:** `calculateDelta(120, 100)` → `{ absolute: 20, percentage: 20 }`

- [ ] **Step 2: Buat `src/utils/formatters.ts`**

  Implementasikan:
  - `formatWeightKg(value: number | null): string` — `null` → `"Data tidak tersedia"`, `0` → `"0 kg"`, `1500` → `"1.500 kg"` (locale `id-ID`)
  - `formatWibDate(isoDate: string): string` — parse `"YYYY-MM-DD"` sebagai WIB, format ke `"18 Nov 2026"` (locale `id-ID`, `Asia/Jakarta`)
  - `formatPercentageDelta(percentage: number | null): string` — `null` → `"—"`, `20` → `"+20%"`, `-5` → `"-5%"`
  - `formatPeriodeLabel(periode: string): string` — `"2026-11"` → `"November 2026"`

- [ ] **Step 3: Update `src/utils/index.ts`** — tambahkan re-export:

  ```typescript
  export * from "./calculations";
  export * from "./formatters";
  ```

- [ ] **Step 4: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error, 0 warning

---

## Task 3: Mock Data

**Files:**
- Create: `src/app/admin/gempolin/mock-data.ts`

**Interfaces:**
- Consumes: `GempolinMockData`, `GempolinHarian`, `GempolinRtSummary`, `GempolinPeriodeSummary` dari Task 1
- Produces: `export const gempolinMockData: GempolinMockData`

- [ ] **Step 1: Buat `src/app/admin/gempolin/mock-data.ts`**

  Dataset harus mencakup:
  - `periode`: `{ periode: "2026-11", label: "November 2026", totalRequest: 48, totalTerolah: 2340 }`
  - `periodeSebelumnya`: `{ periode: "2026-10", label: "Oktober 2026", totalRequest: 42, totalTerolah: 2100 }`
  - `harian`: 30 entri (1–30 November 2026), masing-masing dengan 1–2 RT berbeda, `beratTerolah` antara 50–120 kg, `beratVerifikasi` sedikit berbeda dari `beratTerolah` (± 5–15%), `requestCount` 1–3
  - `perRt`: 6 entri RT (`RT-01` s.d. `RT-06`), `totalTerolah` agregat realistis (200–600 kg per RT), `totalVerifikasi` sedikit berbeda

- [ ] **Step 2: Verifikasi TypeScript**

  Run: `npx tsc --noEmit`
  Expected: 0 error

---

## Task 4: MetricCard Component

**Files:**
- Create: `src/components/shared/metric-card/index.tsx`

**Interfaces:**
- Consumes: `Badge` dari `@/components/ui/badge`, ikon dari `@/icons`, `cn` dari `@/utils`
- Produces:

```typescript
interface MetricCardProps {
  title: string;
  value: number | null;
  unit?: string;
  sublabel?: string;
  trend?: {
    percentage: number | null;
    isPositive: boolean;
    comparisonLabel: string;
  };
  icon?: React.ReactNode;
  isLoading?: boolean;
}
export default function MetricCard(props: MetricCardProps): JSX.Element
```

- [ ] **Step 1: Buat `src/components/shared/metric-card/index.tsx`**

  Ketentuan:
  - File WAJIB `"use client"` (karena potensi animasi/tooltip)
  - Jika `isLoading`, tampilkan skeleton `h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded`
  - Jika `value === null`: tampilkan `<Badge color="warning">Data tidak tersedia</Badge>` (BR-07)
  - Jika `value !== null`: tampilkan angka dengan class `tabular-nums text-3xl font-bold`
  - `trend.percentage === null` → tampilkan `"—"` bukan persentase
  - Gunakan ternary untuk semua conditional render (bukan `&&` dengan angka)

  > **Test BR-07:** `<MetricCard title="Total" value={null} />` → renders badge "Data tidak tersedia"

- [ ] **Step 2: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error

---

## Task 5: ComparisonCard Component

**Files:**
- Create: `src/components/shared/comparison-card/index.tsx`

**Interfaces:**
- Consumes: `calculateDelta`, `formatPercentageDelta`, `formatWeightKg` dari Task 2
- Produces:

```typescript
interface ComparisonCardProps {
  currentLabel: string;      // "November 2026"
  previousLabel: string;     // "Oktober 2026"
  currentValue: number;      // kg
  previousValue: number;     // kg
  unit: string;              // "kg"
  currentRequest: number;
  previousRequest: number;
}
export default function ComparisonCard(props: ComparisonCardProps): JSX.Element
```

- [ ] **Step 1: Buat `src/components/shared/comparison-card/index.tsx`**

  Ketentuan (FR-27):
  - Tampilkan `currentValue` dan `previousValue` berdampingan
  - Hitung `delta = calculateDelta(currentValue, previousValue)`
  - Tampilkan selisih absolut: `delta.absolute > 0 ? "+X kg" : "-X kg"`
  - Tampilkan `formatPercentageDelta(delta.percentage)` — jika `null` tampilkan `"—"`
  - Warna selisih: positif → `text-green-600 dark:text-green-400`, negatif → `text-red-600 dark:text-red-400`
  - Semua angka: class `tabular-nums`

  > **Test FR-27:** previousValue=0 → percentage display = `"—"` (bukan Infinity%)

- [ ] **Step 2: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error

---

## Task 6: GempolinTrendChart Component

**Files:**
- Create: `src/components/shared/gempolin-trend-chart/index.tsx`

**Interfaces:**
- Consumes: `GempolinHarian[]` dari Task 1, `formatWibDate` dari Task 2
- Produces:

```typescript
interface GempolinTrendChartProps {
  data: GempolinHarian[];
}
export default function GempolinTrendChart(props: GempolinTrendChartProps): JSX.Element
```

- [ ] **Step 1: Buat `src/components/shared/gempolin-trend-chart/index.tsx`**

  Ketentuan:
  - File WAJIB `"use client"` (paling atas)
  - ApexCharts: `const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })`
  - Saat loading (sebelum chart mount): tampilkan `<div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />`
  - Agregasi data: jumlahkan `beratTerolah` per tanggal unik (summing semua RT dalam 1 hari)
  - Series: `[{ name: "Berat Terolah (kg)", data: aggregatedValues }]`
  - `xaxis.categories`: array tanggal format `"18 Nov"` (menggunakan `formatWibDate`)
  - Warna: `colors: ["#059669"]` (atau dark-mode aware via CSS variable jika memungkinkan)
  - `chart.type: "line"`, `stroke.curve: "smooth"`, `tooltip.y.formatter: (val) => \`${val} kg\``

- [ ] **Step 2: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error

---

## Task 7: GempolinRtTable Component

**Files:**
- Create: `src/components/shared/gempolin-rt-table/index.tsx`

**Interfaces:**
- Consumes: `GempolinRtSummary[]` dari Task 1, komponen `Table*` dari `@/components/ui/table`, `Tooltip` dari Base UI atau `@/components/ui/tooltip`, `formatWeightKg` dari Task 2
- Produces:

```typescript
interface GempolinRtTableProps {
  data: GempolinRtSummary[];
}
export default function GempolinRtTable(props: GempolinRtTableProps): JSX.Element
```

- [ ] **Step 1: Buat `src/components/shared/gempolin-rt-table/index.tsx`**

  Ketentuan:
  - File WAJIB `"use client"` (tooltip interaktif)
  - Kolom: Wilayah RT | Total Request | Berat Terolah (kg) | Berat Verifikasi (kg) | Selisih
  - **BR-03 tooltip** pada header "Berat Verifikasi (kg)": teks tooltip = `"Berat setelah verifikasi lapangan. Berbeda dengan Berat Terolah yang mencerminkan hasil olah aktual (BR-03)."`
  - Jika `totalTerolah === 0` untuk suatu RT → tampilkan badge `"Data tidak tersedia"` di sel Berat Terolah (BR-07)
  - Semua angka: `tabular-nums text-end`
  - Kolom Selisih: `totalVerifikasi - totalTerolah`, tampilkan dengan tanda `+/-`
  - `key` pada baris: `row.rtId` (bukan index)

- [ ] **Step 2: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error

---

## Task 8: GempolinDailyTable Component

**Files:**
- Create: `src/components/shared/gempolin-daily-table/index.tsx`

**Interfaces:**
- Consumes: `GempolinHarian[]` dari Task 1, `formatWibDate` dari Task 2, komponen `Table*` dari `@/components/ui/table`
- Produces:

```typescript
interface GempolinDailyTableProps {
  data: GempolinHarian[];
}
export default function GempolinDailyTable(props: GempolinDailyTableProps): JSX.Element
```

- [ ] **Step 1: Buat `src/components/shared/gempolin-daily-table/index.tsx`**

  Ketentuan:
  - Sort data: `tanggal` descending (terbaru di atas)
  - Kolom: Tanggal (WIB) | Wilayah RT | Request | Berat Terolah (kg) | Berat Verifikasi (kg)
  - Tanggal: render dengan `formatWibDate(row.tanggal)` (BR-04)
  - Semua angka: `tabular-nums text-end`
  - `key` pada baris: `${row.tanggal}-${row.rtId}` (kombinasi unik)

- [ ] **Step 2: Verifikasi**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error

---

## Task 9: Page Assembly

**Files:**
- Modify: `src/app/admin/gempolin/page.tsx`

**Interfaces:**
- Consumes: `gempolinMockData` dari Task 3, semua komponen dari Task 4–8
- Produces: Server Component yang merender halaman A-03 lengkap

- [ ] **Step 1: Update `src/app/admin/gempolin/page.tsx`**

  Ketentuan:
  - **DILARANG** `"use client"` — ini Server Component
  - Import `gempolinMockData` dari `./mock-data`
  - Import semua komponen: `MetricCard`, `ComparisonCard`, `GempolinTrendChart`, `GempolinRtTable`, `GempolinDailyTable`
  - Import `PageBreadcrumb` dari `@/components/common/page-breadcrumb`
  - Import `ComponentCard` dari `@/components/common/component-card`
  - Layout (top → bottom):
    1. `<PageBreadcrumb pageTitle="Rekap Pengolahan Gempolin" />`
    2. Row 2 kolom: `<MetricCard>` Total Request + Total Berat Terolah bulan ini
    3. `<ComponentCard title="Perbandingan Periode">` → `<ComparisonCard />`
    4. `<ComponentCard title="Tren Harian Berat Terolah">` → `<GempolinTrendChart />`
    5. `<ComponentCard title="Rekap per RT">` → `<GempolinRtTable />`
    6. `<ComponentCard title="Rincian Harian">` → `<GempolinDailyTable />`

- [ ] **Step 2: Final verification**

  Run: `npm run lint && npx tsc --noEmit`
  Expected: 0 error, 0 warning