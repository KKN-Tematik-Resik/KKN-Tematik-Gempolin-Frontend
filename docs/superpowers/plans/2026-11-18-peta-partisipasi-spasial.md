# Peta Partisipasi Spasial (P-02) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun antarmuka interaktif Peta Partisipasi Spasial (P-02) pada rute `/peta-partisipasi` yang merender 67 poligon RT di 10 RW Kelurahan Gempolsari menggunakan MapLibre GL, visualisasi koroplet 5-kelas ramah buta warna, filter indikator URL-driven, pop-up agregat wilayah, dan fallback tabel spasial (`FR-50`).

**Architecture:** Halaman Server Component di `src/app/peta-partisipasi/page.tsx` memuat metadata dan membungkus Client Island `spatial-page-client.tsx`. State filter terikat langsung ke URL searchParams (`useSearchParams`). Peta MapLibre GL dimuat dinamis (`dynamic(() => import(...), { ssr: false })`) dengan basemap CARTO Positron/Dark Matter yang menyesuaikan tema global dan memetakan 67 poligon RT dari GeoJSON lokal.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (Strict, Zero `any`), Tailwind CSS v4, MapLibre GL (`maplibre-gl`), Base UI, `@/i18n/navigation`, `@/icons`.

**Spec:** [docs/superpowers/specs/2026-11-18-peta-partisipasi-spasial-design.md](file:///c:/KULIAH/KKN%20TEMATIK/frontend/docs/superpowers/specs/2026-11-18-peta-partisipasi-spasial-design.md)

---

## Global Constraints

- **Strict Privasi Warga (`BR-01`, `FR-11`):** Dilarang keras menampilkan nama warga, nomor rumah, atau alamat detail hunian di seluruh antarmuka publik, pop-up peta, maupun tabel fallback.
- **Penyebut Nol (`BR-07`):** Jika penyebut $\le 0$ atau data kosong, persentase bernilai `null` dan wajib menampilkan status **"Data tidak tersedia"** (warna abu-abu netral), bukan `0%`.
- **Palet 5-Kelas Ramah Buta Warna (`BR-08`, `NFR-23`):** Kelas 1 (80%–100%) `#15803D`, Kelas 2 (60%–<80%) `#22C55E`, Kelas 3 (40%–<60%) `#EAB308`, Kelas 4 (20%–<40%) `#F97316`, Kelas 5 (0%–<20%) `#DC2626`, Tanpa Data `#D1D5DB`.
- **Zero `any` Policy:** Dilarang menggunakan tipe `any`. Gunakan tipe data TypeScript yang ketat.
- **Dilarang SVG Mentah Inline:** Seluruh ikon wajib menggunakan pustaka proyek di `@/icons`.
- **Angka Tabular:** Wajib menambahkan class `tabular-nums` pada seluruh angka persentase, pembilang, dan penyebut.
- **No Automatic Build:** Dilarang menjalankan `npm run build`. Verifikasi wajib menggunakan `npm run lint` dan `npx tsc --noEmit`.

---

## Review Focus

1. **Penyebut Nol / Data Kosong (`BR-07`):** Data RT dengan nilai penyebut `0` menghasilkan `percentage: null`, warna poligon abu-abu netral, dan badge "Data tidak tersedia" tanpa crash.
2. **Audit Kepatuhan Privasi (`BR-01`):** DOM inspeksi pop-up dan tabel spasial membuktikan 100% data murni agregat wilayah (RT/RW, rasio, persentase) tanpa bocornya data personal warga.
3. **Pencarian RT Tidak Ditemukan:** Input pencarian nomor RT yang tidak ada (misal "RT 999") menampilkan status kosong yang informatif tanpa merusak tampilan peta.
4. **Transisi Mode Gelap/Terang:** Pergantian `ThemeContext` memperbarui basemap MapLibre (Positron ⇄ Dark Matter) dan warna garis poligon tanpa kehilangan *state* filter atau *WebGL context*.
5. **Fallback Aksesibilitas (`FR-50`):** Tombol toggle `[ 📋 Tabel ]` menampilkan seluruh 67 data RT secara tabular rapi dan dapat digunakan penuh tanpa WebGL.

---

### Task 1: Spatial Asset & Core Calculation Utilities

**Files:**
- Create: `public/data/gempolsari-rt.geojson`
- Create: `src/types/spatial.ts`
- Create: `src/utils/calculations.ts`
- Create: `src/utils/calculations.test.mjs`

**Interfaces:**
- Consumes: `c:\KULIAH\KKN TEMATIK\frontend\gempolsari-rt.geojson`
- Produces:
  ```typescript
  // src/types/spatial.ts
  export type ParticipationIndicatorKey =
    | "rumah_memilah"
    | "rumah_mengolah"
    | "kk_memilah"
    | "kk_mengolah"
    | "warga_memilah"
    | "warga_mengolah";

  export type ParticipationClass = 1 | 2 | 3 | 4 | 5 | null;

  export interface RtParticipationRecord {
    rt: string; // e.g. "RT 001"
    rw: string; // e.g. "RW 001"
    indicators: Record<
      ParticipationIndicatorKey,
      {
        numerator: number;
        denominator: number;
      }
    >;
  }

  // src/utils/calculations.ts
  export function calculateParticipationRate(numerator: number, denominator: number): number | null;
  export function getParticipationClass(percentage: number | null): ParticipationClass;
  export function getParticipationColor(pClass: ParticipationClass, isDark?: boolean): string;
  ```

- [x] **Step 1: Salin berkas GeoJSON ke direktori aset publik**
  Salin berkas `gempolsari-rt.geojson` ke `public/data/gempolsari-rt.geojson`.

- [x] **Step 2: Buat tipe data spasial ketat di `src/types/spatial.ts`**
  Definisikan `ParticipationIndicatorKey`, `ParticipationClass`, `RtParticipationRecord`, dan skema properti poligon `RtFeatureProperties`.

- [x] **Step 3: Tulis unit test untuk rumus kalkulasi di `src/utils/calculations.test.mjs`**
  Uji skenario:
  - `calculateParticipationRate(85, 100)` -> `85`
  - `calculateParticipationRate(0, 100)` -> `0`
  - `calculateParticipationRate(0, 0)` -> `null` (BR-07)
  - `calculateParticipationRate(10, -5)` -> `null`
  - `getParticipationClass(85)` -> `1` (Sangat Tinggi)
  - `getParticipationClass(65)` -> `2` (Tinggi)
  - `getParticipationClass(45)` -> `3` (Sedang)
  - `getParticipationClass(25)` -> `4` (Rendah)
  - `getParticipationClass(5)` -> `5` (Sangat Rendah)
  - `getParticipationClass(null)` -> `null` (Tanpa Data)

- [x] **Step 4: Jalankan unit test dan verifikasi kegagalan awal**
  Jalankan: `node --test src/utils/calculations.test.mjs`  
  Ekspektasi: Gagal karena `calculations.ts` belum diimplementasikan.

- [x] **Step 5: Implementasikan `src/utils/calculations.ts`**
  Implementasikan fungsi `calculateParticipationRate`, `getParticipationClass`, dan `getParticipationColor` sesuai palet resmi spesifikasi `BR-08`.

- [x] **Step 6: Jalankan unit test dan verifikasi kelulusan**
  Jalankan: `node --test src/utils/calculations.test.mjs`  
  Ekspektasi: Seluruh pengujian lulus 100%.

---

### Task 2: Realistic Participation Mock Dataset & Query Selectors (67 RTs)

**Files:**
- Create: `src/data/mock/spatial-participation.ts`
- Create: `src/data/mock/spatial-participation.test.mjs`

**Interfaces:**
- Consumes: `src/types/spatial.ts`, `src/utils/calculations.ts`
- Produces:
  ```typescript
  export const MOCK_SPATIAL_PARTICIPATION: RtParticipationRecord[];

  export interface SpatialSummaryItem {
    rt: string;
    rw: string;
    indicatorKey: ParticipationIndicatorKey;
    numerator: number;
    denominator: number;
    percentage: number | null;
    participationClass: ParticipationClass;
    statusLabel: string;
  }

  export function getSpatialParticipationList(params: {
    indicator: ParticipationIndicatorKey;
    rw?: string;
    search?: string;
    classes?: number[];
  }): SpatialSummaryItem[];

  export function getRwList(): string[];
  ```

- [x] **Step 1: Tulis unit test validasi mock data di `src/data/mock/spatial-participation.test.mjs`**
  Uji skenario:
  - Memastikan total data mencakup tepat 67 entri RT.
  - Memastikan seluruh 10 RW (RW 001 s.d. RW 010) terwakili.
  - Memastikan terdapat minimal 1 RT dengan penyebut `0` (untuk menguji `BR-07` Data tidak tersedia).
  - Menguji fungsi `getSpatialParticipationList` dengan filter indikator, filter RW, dan pencarian RT.

- [x] **Step 2: Jalankan test dan verifikasi kegagalan awal**
  Jalankan: `node --test src/data/mock/spatial-participation.test.mjs`  
  Ekspektasi: Gagal karena mock data belum dibuat.

- [x] **Step 3: Implementasikan dataset mock di `src/data/mock/spatial-participation.ts`**
  Petakan 67 RT yang cocok dengan properti `RT` dan `RW` pada `public/data/gempolsari-rt.geojson` dengan data realistis di 6 indikator (jumlah rumah, KK, dan jiwa).

- [x] **Step 4: Jalankan test dan verifikasi kelulusan**
  Jalankan: `node --test src/data/mock/spatial-participation.test.mjs`  
  Ekspektasi: Seluruh pengujian lulus 100%.

- [x] **Step 5: Verifikasi linter dan tipe data**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: 0 error.

---

### Task 3: MapLibre GL Installation & Dynamic Client Canvas Setup

**Files:**
- Modify: `package.json`
- Create: `src/app/peta-partisipasi/components/spatial-map-inner.tsx`
- Create: `src/app/peta-partisipasi/components/spatial-map-canvas.tsx`

**Interfaces:**
- Consumes: `maplibre-gl`, `src/types/spatial.ts`, `src/utils/calculations.ts`, `src/context/theme-context.tsx`
- Produces:
  ```typescript
  // src/app/peta-partisipasi/components/spatial-map-canvas.tsx
  interface SpatialMapCanvasProps {
    items: SpatialSummaryItem[];
    activeRt?: string | null;
    onSelectRt?: (rt: string, rw: string) => void;
    activeClasses: number[];
  }
  export default function SpatialMapCanvas(props: SpatialMapCanvasProps): React.JSX.Element;
  ```

- [x] **Step 1: Pasang pustaka MapLibre GL**
  Jalankan perintah instalasi paket: `npm install maplibre-gl @types/maplibre-gl`.
  Pastikan `maplibre-gl` tercatat pada `package.json`.

- [x] **Step 2: Implementasikan komponen daun MapLibre di `spatial-map-inner.tsx`**
  - Buat komponen `"use client"` dengan `useRef` kanvas kontainer.
  - Integrasikan basemap tile CARTO Positron (tema terang) dan CARTO Dark Matter (tema gelap) dari `ThemeContext`.
  - Muat data `public/data/gempolsari-rt.geojson` ke layer source MapLibre.
  - Terapkan pewarnaan poligon dinamis (*fill-color*) berbasis properti capaian persentase dan palet 5-kelas `BR-08`.
  - Berikan garis batas poligon 1.5px (`#FFFFFF` pada light mode, `#0B0F19` pada dark mode).
  - Tangani event `mousemove` (ubah kursor menjadi pointer), `mouseleave`, dan `click` pada poligon RT untuk memunculkan popover detail wilayah.
  - Tambahkan tombol navigasi zoom (`+`, `-`) dan kontrol pusatkan peta ke Kelurahan Gempolsari.

- [x] **Step 3: Implementasikan pembungkus `dynamic import` di `spatial-map-canvas.tsx`**
  - Bungkus `spatial-map-inner.tsx` menggunakan `dynamic(() => import("./spatial-map-inner"), { ssr: false })`.
  - Sediakan fallback skeleton loader dengan tinggi identik (`h-[550px] sm:h-[620px] rounded-xl animate-pulse bg-gray-100 dark:bg-gray-800`).

- [x] **Step 4: Verifikasi kompilasi tipe TypeScript dan linter**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: Bebas galat linter dan tipe data.

---

### Task 4: Interactive Filter Controls & Floating 5-Class Legend Component

**Files:**
- Create: `src/app/peta-partisipasi/components/spatial-filter-bar.tsx`
- Create: `src/app/peta-partisipasi/components/spatial-legend.tsx`

**Interfaces:**
- Consumes: `@/components/ui/*`, `@/icons`, `src/types/spatial.ts`, `@/i18n/navigation`
- Produces:
  ```typescript
  // src/app/peta-partisipasi/components/spatial-filter-bar.tsx
  interface SpatialFilterBarProps {
    indicator: ParticipationIndicatorKey;
    rw: string;
    search: string;
    view: "map" | "table";
    onIndicatorChange: (val: ParticipationIndicatorKey) => void;
    onRwChange: (val: string) => void;
    onSearchChange: (val: string) => void;
    onViewChange: (val: "map" | "table") => void;
    onReset: () => void;
  }

  // src/app/peta-partisipasi/components/spatial-legend.tsx
  interface SpatialLegendProps {
    activeClasses: number[];
    onToggleClass: (classNumber: number) => void;
    countsByClass: Record<number | "none", number>;
  }
  ```

- [x] **Step 1: Implementasikan `spatial-filter-bar.tsx`**
  - Pilihan Dropdown 6 Indikator Inti (Rumah Memilah, Rumah Mengolah, KK Memilah, KK Mengolah, Warga Memilah, Warga Mengolah).
  - Pilihan Dropdown RW (Semua RW, RW 001 s.d. RW 010).
  - Input teks pencarian RT dengan ikon `SearchIcon`.
  - Tombol beralih segmented control `[ 🗺️ Peta ]` dan `[ 📋 Tabel ]`.
  - Tombol reset filter ("Reset" dengan ikon `FilterIcon` - `FR-06`).
  - Target sentuh minimum 44px (`h-10`/`h-11`) untuk perangkat bergerak (`NFR-25`).

- [x] **Step 2: Implementasikan `spatial-legend.tsx`**
  - Panel mengambang dengan latar belakang semi-transparan (`bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border rounded-xl shadow-theme-md`).
  - 5 Baris kelas partisipasi + 1 baris "Data Tidak Tersedia":
    - Kotak warna indikator kelas + Nama Kelas + Rentang % + Jumlah RT yang masuk kelas tersebut.
  - Setiap baris memiliki interaksi klik untuk menyaring (toggle) poligon di peta.

- [x] **Step 3: Verifikasi linter dan tipe TypeScript**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: Bebas galat linter dan tipe data.

---

### Task 5: Spatial Table View & Fallback Component (`FR-50`)

**Files:**
- Create: `src/app/peta-partisipasi/components/spatial-table-view.tsx`

**Interfaces:**
- Consumes: `@/components/ui/table.tsx`, `@/components/ui/badge.tsx`, `src/types/spatial.ts`
- Produces:
  ```typescript
  interface SpatialTableViewProps {
    items: SpatialSummaryItem[];
    onSelectRt?: (rt: string, rw: string) => void;
  }
  export default function SpatialTableView(props: SpatialTableViewProps): React.JSX.Element;
  ```

- [x] **Step 1: Implementasikan `spatial-table-view.tsx`**
  - Tabel responsif membungkus komponen primitif `@/components/ui/table.tsx`.
  - Kolom:
    1. Wilayah: RT / RW (misal: "RT 001 / RW 002")
    2. Realisasi Pembilang (`tabular-nums text-end`)
    3. Target Penyebut (`tabular-nums text-end`)
    4. Persentase Partisipasi (`tabular-nums text-end font-semibold`)
    5. Klasifikasi: Badge warna 5-kelas (misal: "Sangat Tinggi", "Sedang", atau "Data tidak tersedia" jika null)
    6. Aksi: Tombol mini "Lihat di Peta" yang memicu callback pemilihan wilayah.
  - State kosong jika pencarian tidak menemukan hasil.
  - **Audit Privasi Mutlak (`BR-01`):** Tidak ada kolom nama warga, nomor rumah, atau alamat jalan.

- [x] **Step 2: Verifikasi linter dan tipe TypeScript**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: Bebas galat linter dan tipe data.

---

### Task 6: Page Orchestration, URL Synchronization, and Full Integration

**Files:**
- Modify: `src/app/peta-partisipasi/page.tsx`
- Create: `src/app/peta-partisipasi/components/spatial-page-client.tsx`
- Create: `src/app/peta-partisipasi/components/spatial-popup-card.tsx`

**Interfaces:**
- Consumes: `PublicLayout`, `src/hooks/use-dashboard-filters.ts` (atau `searchParams` via `@/i18n/navigation`), seluruh komponen daun dari Tasks 1–5.
- Produces: Halaman penuh `/peta-partisipasi` yang aktif, responsif, dan siap produksi.

- [x] **Step 1: Implementasikan kartu pop-up poligon di `spatial-popup-card.tsx`**
  - Menampilkan informasi kartu agregat wilayah RT/RW terpilih.
  - Menampilkan rasio numerik, persentase `tabular-nums`, badge kelas semantik, dan stempel waktu WIB.
  - Tombol tutup kartu popover.

- [x] **Step 2: Implementasikan orkestrator klien di `spatial-page-client.tsx`**
  - Membaca parameter URL (`indikator`, `rw`, `search`, `view`) via hook URL.
  - Memfilter daftar 67 data RT berdasarkan parameter aktif.
  - Menghitung rekapitulasi jumlah RT per kelas untuk disuplai ke legenda.
  - Mengatur transisi tampilan antara `SpatialMapCanvas` dan `SpatialTableView` secara halus.

- [x] **Step 3: Perbarui Server Component di `src/app/peta-partisipasi/page.tsx`**
  - Menetapkan judul metadata spesifik: "Peta Partisipasi Spasial | Gempolin Kelurahan Gempolsari".
  - Membungkus `SpatialPageClient` di dalam `PublicLayout`.

- [x] **Step 4: Jalankan verifikasi menyeluruh (Linter & Type Checking)**
  Jalankan: `npx tsc --noEmit`  
  Ekspektasi: 0 error tipe TypeScript.  
  Jalankan: `npm run lint`  
  Ekspektasi: 0 error / warning linter.

- [x] **Step 5: Verifikasi kepatuhan seluruh aturan bisnis & privasi**
  Pastikan:
  - `BR-01`: Bebas dari nama warga dan alamat detail di seluruh kode baru.
  - `BR-07`: RT dengan penyebut nol berstatus "Data tidak tersedia".
  - `BR-08`: Palet 5 kelas dan warna poligon akurat.
  - `FR-50`: Pengalih tabel spasial bekerja dengan baik.

---

## Phase 2: Enhanced Map Interactions (Hover Tooltip & Full RT Profile Side Drawer)

### Task 7: Full RT Profile Data Layer (`getRtFullReport`)

**Files:**
- Modify: `src/data/mock/spatial-participation.ts`
- Modify: `src/data/mock/spatial-participation.test.mjs`

**Interfaces:**
- Consumes: `src/types/spatial.ts`, `src/utils/calculations.ts`
- Produces:
  ```typescript
  export interface RtFullReport {
    rt: string;
    rw: string;
    demographics: {
      totalRumah: number;
      totalKk: number;
      totalWarga: number;
    };
    indicators: Array<{
      key: ParticipationIndicatorKey;
      label: string;
      objectType: "rumah" | "kk" | "warga";
      activity: "memilah" | "mengolah";
      numerator: number;
      denominator: number;
      percentage: number | null;
      participationClass: ParticipationClass;
      statusLabel: string;
    }>;
  }

  export function getRtFullReport(rt: string, rw: string): RtFullReport | null;
  ```

- [x] **Step 1: Tulis unit test untuk `getRtFullReport` di `src/data/mock/spatial-participation.test.mjs`**
  Uji skenario:
  - `getRtFullReport("RT 001", "RW 001")` mengembalikan data dengan 6 indikator lengkap dan 3 demografi (Rumah, KK, Warga).
  - Menguji kasus batas RT 013 RW 004 (penyebut nol menghasilkan persentase null dan status "Data tidak tersedia").
  - `getRtFullReport("RT 999", "RW 999")` mengembalikan `null`.

- [x] **Step 2: Jalankan unit test dan verifikasi kegagalan awal**
  Jalankan: `node --loader ./tests/loader.mjs --test src/data/mock/spatial-participation.test.mjs`  
  Ekspektasi: Gagal karena `getRtFullReport` belum diimplementasikan.

- [x] **Step 3: Implementasikan `getRtFullReport` di `src/data/mock/spatial-participation.ts`**
  Bangun fungsi untuk mengagregasi profil lengkap RT (demografi dan ke-6 indikator partisipasi).

- [x] **Step 4: Jalankan unit test dan verifikasi kelulusan**
  Jalankan: `node --loader ./tests/loader.mjs --test src/data/mock/spatial-participation.test.mjs`  
  Ekspektasi: Seluruh pengujian lulus 100%.

- [x] **Step 5: Verifikasi linter dan tipe TypeScript**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: 0 error, 0 warning.

---

### Task 8: Hover Cursor Tooltip & Polygon Stroke Highlight in Map Canvas

**Files:**
- Modify: `src/app/peta-partisipasi/components/spatial-map-inner.tsx`
- Modify: `src/app/peta-partisipasi/components/spatial-map-canvas.tsx`

**Interfaces:**
- Consumes: `maplibre-gl`, `src/types/spatial.ts`, `src/utils/calculations.ts`
- Produces:
  - Tooltip kursor mengambang saat hover: Nama RT/RW, indikator aktif, %, status kelas, dan petunjuk "(Klik untuk rapor lengkap)".
  - Layer sorotan garis poligon (stroke width 3px dan opacity 0.95 pada poligon yang sedang di-hover).
  - Peta melakukan smooth flyTo/pan saat poligon RT diklik.

- [x] **Step 1: Implementasikan hover tooltip dan layer highlight di `spatial-map-inner.tsx`**
  - Tambahkan state `hoverTooltip` berisi `{ rt, rw, percentage, statusLabel, x, y }`.
  - Tambahkan layer garis sorotan `rt-line-hover` pada MapLibre dengan lebar garis 3px saat `hover: true`.
  - Pada event `mousemove`, hitung posisi kursor (`e.point.x`, `e.point.y`) dan render tooltip mikro.
  - Pada event `mouseleave`, bersihkan state tooltip.
  - Pada event `click`, pemicu kamera `map.flyTo` ke pusat koordinat poligon yang diklik.

- [x] **Step 2: Verifikasi linter dan tipe TypeScript**
  Jalankan: `npx tsc --noEmit && npm run lint`  
  Ekspektasi: 0 error, 0 warning.

---

### Task 9: Side Drawer for Full RT Report (`SpatialDrawer`)

**Files:**
- Create: `src/app/peta-partisipasi/components/spatial-drawer.tsx`
- Modify: `src/app/peta-partisipasi/components/spatial-page-client.tsx`

**Interfaces:**
- Consumes: `getRtFullReport`, `@/components/ui/*`, `@/icons`, `src/utils/calculations.ts`
- Produces:
  - Panel samping geser (*Slide-over Drawer* di desktop kanan w-96 s.d. max-w-md; *Bottom Sheet* di mobile).
  - Menampilkan Rapor Lengkap RT:
    1. Header: RT/RW, Kelurahan Gempolsari, tombol tutup.
    2. 3 Kartu Demografi RT: Total Rumah, KK, dan Warga.
    3. Rincian 6 Indikator Partisipasi (Persentase `tabular-nums`, progress bar proporsional, rasio numerik, dan badge 5-kelas).
    4. Stempel waktu WIB & catatan privasi warga (`BR-01`).
  - Menggantikan kartu popover kecil `SpatialPopupCard`.

- [x] **Step 1: Implementasikan komponen `spatial-drawer.tsx`**
  - Buat panel samping geser dengan animasi transisi Tailwind yang halus (`translate-x-0` vs `translate-x-full`).
  - Tampilkan seluruh metrik demografi dan 6 indikator dari `getRtFullReport`.
  - Sediakan tombol tutup (`XIcon`) dan klik di luar untuk menutup (*backdrop dismiss*).

- [x] **Step 2: Hubungkan `SpatialDrawer` ke `spatial-page-client.tsx`**
  - Ganti pemanggilan `SpatialPopupCard` dengan `SpatialDrawer`.
  - Sambungkan aksi klik poligon dan klik tombol tabel ke pembukaan `SpatialDrawer`.

- [x] **Step 3: Jalankan verifikasi menyeluruh (Linter, Type Checking, dan Test Suite)**
  Jalankan:
  1. `npx tsc --noEmit` -> 0 error.
  2. `npm run lint` -> 0 error, 0 warning.
  3. `node --loader ./tests/loader.mjs --test src/utils/calculations.test.mjs src/data/mock/spatial-participation.test.mjs` -> seluruh test PASS.

- [x] **Step 4: Audit kepatuhan privasi warga (`BR-01`)**
  Pastikan tidak ada atribut personal warga atau alamat rumah di dalam `SpatialDrawer`.
