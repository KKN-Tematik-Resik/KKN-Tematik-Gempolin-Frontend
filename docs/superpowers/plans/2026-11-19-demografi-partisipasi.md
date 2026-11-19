# Demografi & 6 Indikator Partisipasi (A-04) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun Halaman A-04 Demografi & 6 Indikator Partisipasi (`/admin/demografi`) dengan sistem filter berbasis URL (`useDashboardFilters`), 3 kartu demografi ringkasan, 2 kartu indikator partisipasi aktif dengan progress bar Pine Green, dan tabel berjenjang hierarkis RW $\rightarrow$ RT yang mematuhi kalkulasi BR-05, BR-06, dan penanganan BR-07.

**Architecture:** 
- Menggunakan **Pendekatan B (Mock Statis + URL Filter Aktif)**.
- `src/app/admin/demografi/page.tsx` sebagai Server Component murni yang membaca `searchParams` URL (atau meneruskan initial mock data) ke Client Islands.
- `useDashboardFilters` hook mengelola filter `objek` (rumah/kk/warga) dan `rw` (all/01..06) via URL query params non-blocking (`useTransition`).
- Agregasi hierarki RW $\rightarrow$ RT dihitung dengan rumus murni $\sum \text{pembilang} / \sum \text{penyebut}$ (BR-06, dilarang merata-ratakan persentase).

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (Strict, Zero `any`) · Tailwind CSS v4 · Base UI (`@base-ui/react/progress`) · `@/components/ui/` (`badge`, `card`, `table`, `progress-bar`, `pagination`) · `@/icons` · `@/i18n/navigation`

**Spec:** `docs/superpowers/specs/02-gempolsari-dashboard-spec.md` (A-04, BR-01, BR-05, BR-06, BR-07), `04-frontend-state-and-url-flow.md` (useDashboardFilters), `05-ui-component-inventory.md` (IndicatorCardProps).

---

## Global Constraints

- Zero `any` policy — semua interface eksplisit dan strict.
- DILARANG menambahkan `"use client"` di `page.tsx` atau `layout.tsx`.
- DILARANG inline `<svg>` — wajib menggunakan pustaka ikon `@/icons`.
- Navigasi dan URL router wajib dari `@/i18n/navigation` (DILARANG `next/navigation` atau `next/link`).
- Semua angka metrik dan tabel wajib menyertakan kelas `tabular-nums`.
- Setiap token warna wajib memiliki padanan mode gelap `dark:`.
- DILARANG menggunakan `key={index}` pada list dinamis — wajib menggunakan ID unik (`kodeRw`, `kodeRt`).
- DILARANG menjalankan `npm run build` kecuali diminta eksplisit oleh user.
- Verifikasi wajib: `npm run lint` (0 error/warning) dan `npx tsc --noEmit` (0 error tipe).

---

## Review Focus

1. **Penyebut Nol / Data Tidak Tersedia (BR-07):** Jika `terdata <= 0`, persentase harus `null` dan UI menampilkan badge `"Data tidak tersedia"` — bukan `0%`.
2. **Agregasi Hierarki Bertingkat (BR-06):** Persentase RW dihitung dari $(\sum \text{pembilang RT} / \sum \text{penyebut RT}) \times 100\%$, BUKAN rata-rata persentase antar-RT.
3. **URL-First State Synchronization:** Mengubah toggle Objek (Rumah/KK/Warga) atau filter RW langsung memperbarui URL query params tanpa reload halaman, dan komponen bereaksi seketika.
4. **Privasi Warga (BR-01):** Tidak ada nama warga atau alamat rumah detail di seluruh tabel atau komponen hierarki. Hanya level RW dan RT.
5. **Render Kondisional Numerik:** Dilarang menggunakan pola `count && <Component />` pada angka, wajib gunakan ternary `count > 0 ? <Component /> : null`.

---

## File Structure

```
src/
├── types/
│   └── demografi.ts                              [CREATE] Definisi tipe domain demografi & indikator
├── utils/
│   ├── calculations.ts                           [MODIFY] Tambah helper agregasi hierarki demografi
│   └── index.ts                                  [VERIFY] Re-export calculations
├── hooks/
│   └── use-dashboard-filters.ts                  [CREATE] Hook terpusat URL-driven state
├── components/
│   └── shared/
│       ├── indicator-card/
│       │   └── index.tsx                         [CREATE] Kartu indikator partisipasi + progress bar
│       ├── demografi-filter-bar/
│       │   └── index.tsx                         [CREATE] Bar filter toggle objek & dropdown RW
│       └── demografi-hierarchy-table/
│           └── index.tsx                         [CREATE] Tabel hierarkis RW -> RT expandable
└── app/
    └── admin/
        └── demografi/
            ├── mock-data.ts                      [CREATE] Mock dataset 6 RW dengan RT lengkap
            ├── demografi-client.tsx              [CREATE] Client container penampung state & filter
            └── page.tsx                          [MODIFY] Server Component assembly
```

---

## Task 1: Domain Types (`src/types/demografi.ts`)

**Files:**
- Create: `src/types/demografi.ts`

**Interfaces:**
- Consumes: None
- Produces:
  - `ObjekType = "rumah" | "kk" | "warga"`
  - `AktivitasType = "memilah" | "mengolah"`
  - `DemografiMetrics`: `{ terdata: number; memilah: number; mengolah: number; }`
  - `DemografiRtData`: `{ id: string; kodeRt: string; namaRt: string; kodeRw: string; rumah: DemografiMetrics; kk: DemografiMetrics; warga: DemografiMetrics; }`
  - `DemografiRwData`: `{ id: string; kodeRw: string; namaRw: string; rumah: DemografiMetrics; kk: DemografiMetrics; warga: DemografiMetrics; daftarRt: DemografiRtData[]; }`
  - `DemografiKelurahanSummary`: `{ rumah: DemografiMetrics; kk: DemografiMetrics; warga: DemografiMetrics; }`
  - `DemografiDataset`: `{ periode: string; label: string; summary: DemografiKelurahanSummary; daftarRw: DemografiRwData[]; }`

- [ ] **Step 1: Buat file interface `src/types/demografi.ts`**
  Mendefinisikan seluruh tipe data untuk objek, aktivitas, metrik RT, agregasi RW, dan ringkasan kelurahan.
- [ ] **Step 2: Jalankan verifikasi tipe TypeScript**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 2: Pure Calculation Helpers (`src/utils/calculations.ts`)

**Files:**
- Modify: `src/utils/calculations.ts`

**Interfaces:**
- Consumes: `DemografiMetrics` from `@/types/demografi`
- Produces:
  - `aggregateDemografiMetrics(items: DemografiMetrics[]): DemografiMetrics`
  - `calculateMetricsRate(metrics: DemografiMetrics, activity: "memilah" | "mengolah"): number | null`

- [ ] **Step 1: Tambahkan fungsi `aggregateDemografiMetrics` dan `calculateMetricsRate`**
  Implementasikan agregasi $\sum \text{terdata}, \sum \text{memilah}, \sum \text{mengolah}$ secara murni tanpa mutasi.
- [ ] **Step 2: Jalankan verifikasi tipe TypeScript**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 3: URL State Hook (`src/hooks/use-dashboard-filters.ts`)

**Files:**
- Create: `src/hooks/use-dashboard-filters.ts`

**Interfaces:**
- Consumes: `useRouter`, `usePathname`, `useSearchParams` from `@/i18n/navigation`
- Produces:
  - `useDashboardFilters()`:
    - `getFilter(key: string, defaultValue?: string): string`
    - `setFilters(updates: Record<string, string | null>): void`
    - `resetFilters(): void`
    - `isPending: boolean`

- [ ] **Step 1: Implementasikan hook `useDashboardFilters` sesuai spesifikasi `04-frontend-state-and-url-flow.md`**
  Gunakan `useTransition()` untuk transisi non-blocking dan hapus query param bila nilainya `null`, `""`, atau `"all"`.
- [ ] **Step 2: Jalankan verifikasi linter & tipe**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 4: Mock Data Demografi Kelurahan Gempolsari (`src/app/admin/demografi/mock-data.ts`)

**Files:**
- Create: `src/app/admin/demografi/mock-data.ts`

**Interfaces:**
- Consumes: `DemografiDataset`, `DemografiRwData`, `DemografiRtData` from `@/types/demografi`, `aggregateDemografiMetrics` from `@/utils/calculations`
- Produces:
  - `mockDemografiData: DemografiDataset`
  - Memuat 6 RW (RW 01 s.d. RW 06), dengan 3-5 RT pada masing-masing RW.
  - Memuat kasus uji batas: satu RT dengan nilai `terdata: 0` (misal RT 05 RW 06) untuk memvalidasi penanganan BR-07 ("Data tidak tersedia").

- [ ] **Step 1: Buat dataset mock realistis untuk 6 RW di Kelurahan Gempolsari**
  Hitung nilai agregasi RW dari data RT-nya secara otomatis menggunakan helper `aggregateDemografiMetrics` untuk menjamin konsistensi BR-06.
- [ ] **Step 2: Jalankan verifikasi tipe TypeScript**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 5: Reusable Indicator Card Component (`src/components/shared/indicator-card/index.tsx`)

**Files:**
- Create: `src/components/shared/indicator-card/index.tsx`

**Interfaces:**
- Consumes: `ProgressBar` from `@/components/ui/progress-bar`, `Badge` from `@/components/ui/badge`, `formatNumber` from `@/utils`
- Produces:
  - `IndicatorCardProps`:
    ```typescript
    export interface IndicatorCardProps {
      label: string;
      numerator: number;
      denominator: number;
      percentage: number | null;
      activity: "memilah" | "mengolah";
      objectType: "rumah" | "kk" | "warga";
      sublabel?: string;
    }
    ```
  - Menampilkan persentase besar (`text-3xl font-bold tabular-nums`), teks rasio "X dari Y [Objek]", dan bilah progress visual warna Pine Green (`bg-brand-600 dark:bg-brand-500`).
  - Menampilkan badge "Data tidak tersedia" jika `percentage === null` (BR-07).

- [ ] **Step 1: Implementasikan komponen `IndicatorCard`**
  Wajib mengikuti standard design tokens, `tabular-nums`, dan Dark Mode support.
- [ ] **Step 2: Jalankan verifikasi linter & tipe**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 6: Filter Bar & Objek Toggle (`src/components/shared/demografi-filter-bar/index.tsx`)

**Files:**
- Create: `src/components/shared/demografi-filter-bar/index.tsx`

**Interfaces:**
- Consumes: `useDashboardFilters` from `@/hooks/use-dashboard-filters`, `ObjekType` from `@/types/demografi`, `Button` from `@/components/ui/button`, `FilterIcon` from `@/icons`
- Produces:
  - `DemografiFilterBarProps`:
    ```typescript
    export interface DemografiFilterBarProps {
      activeObjek: ObjekType;
      selectedRw: string;
      rwOptions: Array<{ value: string; label: string }>;
      onObjekChange: (objek: ObjekType) => void;
      onRwChange: (rw: string) => void;
      onReset: () => void;
      isPending?: boolean;
    }
    ```
  - Tombol toggle 3 opsi: Rumah | KK | Warga dengan styling segmented button yang elegan.
  - Dropdown/Select pilihan RW (Semua RW, RW 01 s.d. RW 06).
  - Tombol Reset Filter.

- [ ] **Step 1: Implementasikan komponen `DemografiFilterBar`**
  Pastikan keyboard accessibility, ring focus, dan feedback pending state jika ada transisi.
- [ ] **Step 2: Jalankan verifikasi tipe TypeScript**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 7: Hierarchical RW $\rightarrow$ RT Table (`src/components/shared/demografi-hierarchy-table/index.tsx`)

**Files:**
- Create: `src/components/shared/demografi-hierarchy-table/index.tsx`

**Interfaces:**
- Consumes: `DemografiRwData`, `ObjekType` from `@/types/demografi`, `calculateParticipationRate` from `@/utils`, `@/components/ui/table`, `@/components/ui/badge`, `@/components/ui/pagination`, `@/icons` (`ChevronDownIcon`, `ChevronRightIcon`)
- Produces:
  - `DemografiHierarchyTableProps`:
    ```typescript
    export interface DemografiHierarchyTableProps {
      dataRw: DemografiRwData[];
      activeObjek: ObjekType;
      selectedRwFilter?: string;
    }
    ```
  - Fitur Expand/Collapse per baris RW untuk menampilkan baris-baris RT di bawahnya.
  - Kolom: Wilayah (RW / RT), Terdata, Memilah, Mengolah, % Memilah, % Mengolah.
  - Label kolom otomatis menyesuaikan objek aktif: misalnya "Rumah Terdata" jika objek = "rumah", "KK Terdata" jika objek = "kk".
  - Baris Agregat Ringkasan Total di paling bawah (BR-06).
  - Semua angka menggunakan `tabular-nums`.
  - Pagination/footer terpadu sesuai standar AGENTS.md.

- [ ] **Step 1: Implementasikan komponen `DemografiHierarchyTable`**
  Gunakan state lokal `expandedRw` (Set / Record) untuk menyimpan ID baris yang terbuka.
- [ ] **Step 2: Jalankan verifikasi tipe TypeScript**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 8: Client Container & Server Page Assembly (`src/app/admin/demografi/`)

**Files:**
- Create: `src/app/admin/demografi/demografi-client.tsx`
- Modify: `src/app/admin/demografi/page.tsx`

**Interfaces:**
- Consumes:
  - `DemografiDataset` from `@/types/demografi`
  - `MetricCard` from `@/components/shared/metric-card`
  - `IndicatorCard` from `@/components/shared/indicator-card`
  - `DemografiFilterBar` from `@/components/shared/demografi-filter-bar`
  - `DemografiHierarchyTable` from `@/components/shared/demografi-hierarchy-table`
  - `useDashboardFilters` from `@/hooks/use-dashboard-filters`
- Produces:
  - Server Component `page.tsx` (NO `"use client"`) yang menyusun breadcrumb, metadata, dan memanggil `DemografiClient`.
  - `DemografiClient` yang menghubungkan filter URL dengan perhitungan indikator aktif dan tabel hierarki.

- [ ] **Step 1: Buat `demografi-client.tsx` sebagai Client Component leaf**
  Menghubungkan `useDashboardFilters`, menghitung 2 indikator aktif sesuai `objek`, menyaring data jika `rw` dipilih, dan menampilkan 3 MetricCards demografi kelurahan.
- [ ] **Step 2: Perbarui `src/app/admin/demografi/page.tsx` sebagai Server Component murni**
  Impor `mockDemografiData` dan teruskan ke `DemografiClient`.
- [ ] **Step 3: Jalankan verifikasi linter dan tipe**
  Run: `npx tsc --noEmit`
  Expected: PASS tanpa error.

---

## Task 9: Final Quality Gate & Verification

**Files:**
- All touched files

- [ ] **Step 1: Jalankan `npx tsc --noEmit`**
  Pastikan 0 tipe error di seluruh proyek.
- [ ] **Step 2: Jalankan `npm run lint`**
  Pastikan 0 lint warning dan 0 error.
- [ ] **Step 3: Verifikasi aturan AGENTS.md**
  - Tidak ada `any`
  - Tidak ada `"use client"` di `page.tsx`
  - Tidak ada inline `<svg>`
  - Tabular nums pada seluruh metrik
  - Kepatuhan BR-05, BR-06, BR-07, dan BR-01.
