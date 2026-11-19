# Desain Teknis: Peta Partisipasi Spasial (P-02)

## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Tanggal:** 18 November 2026  
**Status:** Menunggu Persetujuan Pengguna  
**Dokumen Referensi:**
- `docs/superpowers/specs/01-design-system-guideline.md`
- `docs/superpowers/specs/02-gempolsari-dashboard-spec.md`
- `docs/superpowers/specs/03-code-guideline-and-best-practices.md`
- `docs/superpowers/specs/04-frontend-state-and-url-flow.md`
- `docs/superpowers/specs/05-ui-component-inventory.md`

---

## 1. Intent & Nilai Manfaat (*Intent & The Why*)

Fitur **Peta Partisipasi Spasial (P-02)** pada rute `/peta-partisipasi` bertujuan memberikan transparansi data pengelolaan sampah berbasis wilayah geografis kepada warga Kelurahan Gempolsari, pengurus RW/RT, dan pihak kelurahan. Dengan menyajikan visualisasi koroplet poligon RT yang interaktif di atas peta jalan riil, masyarakat dapat secara intuitif memantau, membandingkan, dan terdorong untuk meningkatkan capaian pemilahan dan pengolahan sampah di lingkungannya masing-masing.

---

## 2. Sasaran, Batasan, dan Anti-Goals

### A. Sasaran Utama (*Goals*)
1. Merender 67 poligon administratif RT dari 10 RW (RW 001 s.d. RW 010) di Kelurahan Gempolsari berdasarkan berkas `gempolsari-rt.geojson`.
2. Menyajikan visualisasi koroplet 5-kelas ramah buta warna (`BR-08`, `NFR-23`) untuk 6 Indikator Inti Partisipasi warga.
3. Menyediakan kontrol filter wilayah (RW/RT), indikator partisipasi, dan filter kelas legenda yang tersinkronisasi dengan URL Query Parameters (`04-frontend-state-and-url-flow.md`).
4. Menyediakan pop-up detail wilayah yang responsif saat poligon diklik, berisi rasio pembilang, penyebut, persentase (`tabular-nums`), dan status kelas.
5. Menyediakan pengalih tampilan ke **Fallback Tabel Spasial (`FR-50`)** untuk aksesibilitas penuh dan perangkat yang tidak mendukung WebGL.

### B. Bukan Sasaran (*Non-Goals*)
- Widget peta ringkas di Beranda (`/`) ditunda sesuai arahan pengguna.
- Tidak ada fitur pengeditan poligon atau manipulasi data spasial di halaman publik.
- Tidak ada transaksi operasional armada sampah (`FR-28`) atau keuangan bank sampah (`FR-56`).

### C. Anti-Goals & Batasan Mutlak (*The Unbreakable Laws*)
- ❌ **Strict Privasi Warga (`BR-01`, `FR-11`):** DILARANG KERAS memuat atau menampilkan nama warga, nomor rumah, atau alamat detail hunian di pop-up peta, tooltip, maupun tabel fallback. Data spasial murni agregat tingkat RT/RW.
- ❌ **Penyebut Nol (`BR-07`):** Jika penyebut $\le 0$, persentase bernilai `null` dan wajib menampilkan status **"Data tidak tersedia"** (warna abu-abu netral), bukan `0%`.
- ❌ **Larangan `any` (`Zero any Policy`):** Seluruh kode TypeScript wajib bebas dari tipe `any`.
- ❌ **Dilarang SVG Mentah Inline:** Semua ikon menggunakan pustaka `@/icons`.

---

## 3. Pilihan Pendekatan Teknis (*Approaches & Decisions*)

### Opsi yang Dipertimbangkan

1. **Opsi A: MapLibre GL dengan Dynamic Import (DIPILIH)**
   - Menggunakan `maplibre-gl` yang dimuat secara dinamis (`ssr: false`) dibungkus skeleton loader.
   - Menggunakan basemap tile gratis tanpa API key (CARTO Positron untuk Light Mode, CARTO Dark Matter untuk Dark Mode).
   - Poligon `gempolsari-rt.geojson` dimuat sebagai GeoJSON source lokal dengan *data-driven expressions* untuk pewarnaan GPU yang instan (60 FPS).
   - *Trade-off:* Memerlukan instalasi pustaka `maplibre-gl` (+ types) dan WebGL di browser, dimitigasi penuh oleh dynamic import dan fallback tabel `FR-50`.
   - *Alasan Pemilihan:* Resmi tercantum dalam spesifikasi proyek (`01`, `02`), memberikan pengalaman kartografi modern, dan memungkinkan warga melihat patokan jalan nyata.

2. **Opsi B: Leaflet / React-Leaflet (DITOLAK)**
   - Berbasis raster tile dan manipulasi SVG DOM tradisional.
   - *Kelemahan:* Kerap bermasalah dengan peer dependency React 19, performa zoom tidak sehalus WebGL, dukungan tema gelap canggung, dan tidak sesuai spesifikasi resmi.

3. **Opsi C: Pure SVG / D3-geo Proyeksi Lokal (DITOLAK)**
   - Merender poligon langsung sebagai path SVG lokal tanpa tile jalan luar.
   - *Kelemahan:* Warga kehilangan konteks peta jalan (jalan raya, gang, batas kelurahan) sehingga sulit mengorientasikan lokasi RT-nya.

---

## 4. Rincian Desain Antarmuka & Interaksi

### A. Tata Letak Halaman (`/peta-partisipasi`)

Halaman dibungkus dalam `PublicLayout` (tanpa sidebar admin) dengan struktur:
1. **Header Halaman:** Judul besar "Peta Partisipasi Spasial" dan deskripsi pengantar ringkas.
2. **Bilah Kontrol Terpadu (`SpatialFilterBar`):**
   - *Select Indikator:* Dropdown 6 pilihan (Rumah Memilah, Rumah Mengolah, KK Memilah, KK Mengolah, Warga Memilah, Warga Mengolah).
   - *Select RW:* Dropdown (Semua RW, RW 001 s.d. RW 010).
   - *Input Pencarian RT:* Input pencarian cepat nomor RT dengan filter instan.
   - *Segmented View Toggle:* Tombol beralih `[ 🗺️ Peta ]` dan `[ 📋 Tabel ]`.
3. **Area Kanvas Peta (`SpatialMapCanvas`):**
   - Tinggi responsif (`h-[520px] sm:h-[620px] lg:h-[700px]`) dengan sudut melengkung `rounded-xl` dan border `border-gray-200 dark:border-gray-800`.
   - Peta diposisikan secara otomatis dengan pusat koordinat Kelurahan Gempolsari (`lng: 107.5533, lat: -6.9322`) dan zoom awal ~14.8.
   - Kontrol navigasi MapLibre di kiri atas / kanan atas: Zoom In (`+`), Zoom Out (`-`), dan tombol Reset Pusatkan Wilayah.
4. **Legenda Mengambang (`MapLegend`):**
   - Panel melayang (*floating card*) di pojok kanan bawah peta (atau bawah pada layar mobile).
   - Menampilkan 5 kelas warna (`BR-08`, `NFR-23`):
     - Kelas 1 (80%–100%): Sangat Tinggi (`#15803D` / Dark: `#22C55E`)
     - Kelas 2 (60%–<80%): Tinggi (`#22C55E` / Dark: `#4ADE80`)
     - Kelas 3 (40%–<60%): Sedang (`#EAB308` / Dark: `#FACC15`)
     - Kelas 4 (20%–<40%): Rendah (`#F97316` / Dark: `#FB923C`)
     - Kelas 5 (0%–<20%): Sangat Rendah (`#DC2626` / Dark: `#F87171`)
     - Tanpa Data: Abu-abu (`#D1D5DB` / Dark: `#4B5563`)
   - Setiap baris legenda dapat diklik untuk menyaring poligon (menampilkan hanya kelas yang aktif).
5. **Pop-up Poligon Wilayah (`SpatialPopup`):**
   - Menggunakan komponen popover kustom MapLibre atau dialog modal Base UI pada mobile.
   - Format isi:
     - Header: Nama Wilayah (misal: "RT 003 / RW 002")
     - Badge Status: [Kelas 1: Sangat Tinggi]
     - Angka Capaian: Persentase besar (misal: `85.4%`) berformat `tabular-nums`
     - Rincian Rasio: "85 dari 100 Rumah Terdata"
     - Penanda Waktu: "Periode April 2025 WIB"
6. **Tampilan Alternatif: Tabel Spasial (`SpatialTableFallback` - `FR-50`):**
   - Tabel responsif TanStack / Base UI berpenampilan rapi.
   - Kolom: Wilayah (RW / RT), Indikator Terpilih, Pembilang, Penyebut, Persentase (`tabular-nums`), Kelas Partisipasi, dan Aksi Pusatkan ke Peta.

---

## 5. Model Data & Arsitektur Kode

### A. Penempatan Aset Spasial
- File `gempolsari-rt.geojson` diletakkan di `public/data/gempolsari-rt.geojson` agar dapat diakses klien secara efisien melalui HTTP fetch dengan caching browser.

### B. Tipe Data TypeScript (`Zero any Policy`)
```typescript
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
```

### C. Struktur Folder Komponen
```
src/app/peta-partisipasi/
├── page.tsx                      ← Server Component (Metadata & Shell)
└── components/
    ├── spatial-page-client.tsx    ← Client orchestrator (URL query state)
    ├── spatial-filter-bar.tsx    ← Bilah filter indikator & RW/RT
    ├── spatial-map-canvas.tsx    ← Dynamic import wrapper MapLibre GL
    ├── spatial-map-inner.tsx     ← MapLibre instance, GeoJSON layer, popups
    ├── spatial-legend.tsx        ← Floating 5-class legend panel
    └── spatial-table-view.tsx    ← FR-50 spatial table view & fallback
```

---

## 6. Pembagian Kewenangan Implementasi (*What's Left to Builder*)

- Pembuatan dataset mock realistik 67 RT yang selaras dengan nilai `RT` dan `RW` pada `gempolsari-rt.geojson`.
- Pemasangan pustaka `maplibre-gl` dan `@types/maplibre-gl`.
- Penyesuaian konfigurasi CSS MapLibre (`maplibre-gl/dist/maplibre-gl.css`) agar tidak bocor ke komponen global.
- Pengujian interaksi responsif pada layar kecil (mobile 360px sesuai `NFR-25`).
- Verifikasi linter (`npm run lint`) dan tipe TypeScript (`npx tsc --noEmit`).
