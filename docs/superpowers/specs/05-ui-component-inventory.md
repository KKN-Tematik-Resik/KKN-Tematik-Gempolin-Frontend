# Katalog Komponen UI & Inventaris Atomik (Component Inventory & Atomic Catalog)
## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Versi:** 1.0  
**Status:** Disetujui  
**Stack Implementasi:** React 19 · Base UI · Tailwind CSS v4 · Class Variance Authority (`cva`)  
**Referensi Terkait:**  
- [01-design-system-guideline.md](./01-design-system-guideline.md)  
- [02-gempolsari-dashboard-spec.md](./02-gempolsari-dashboard-spec.md)  
- [03-code-guideline-and-best-practices.md](./03-code-guideline-and-best-practices.md)  
- [04-frontend-state-and-url-flow.md](./04-frontend-state-and-url-flow.md)

> 💡 **Catatan untuk Tim Pengembang:** Tautan antar-dokumen menggunakan jalur relatif (`./`) agar selalu valid di GitHub maupun di folder clone masing-masing anggota tim. Import komponen menggunakan path alias `@/*`.

---

## 1. Aturan Emas Penggunaan Komponen (*The Golden Inventory Rule*)

Sebelum menulis kode antarmuka baru, seluruh agen AI dan pengembang **WAJIB** merujuk ke katalog ini:
1. **Dilarang Menulis Tag HTML Primitif Mentah:** Dilarang menggunakan `<button>`, `<input>`, atau `<select>` mentah di halaman fitur. Gunakan komponen di `@/components/ui/*`.
2. **Dilarang Menduplikasi Komponen:** Jika membutuhkan kartu metrik atau baris tabel, gunakan komponen yang sudah terdaftar di Tingkat 2 dan Tingkat 3.
3. **Konsistensi Varian:** Modifikasi tampilan dilakukan melalui props varian (`variant`, `size`, `color`) yang sudah disediakan oleh `cva`.

---

## 2. Tingkat 1: Primitif UI Bawaan Template (`@/components/ui/*`)

Komponen dasar yang membungkus `@base-ui/react` dan mendukung Dark Mode secara native:

### A. Tombol & Aksi (`@/components/ui/button.tsx`)
```tsx
import { Button } from "@/components/ui/button";

// Varian: "default" (Primary Brand), "outline", "ghost", "destructive", "link"
// Ukuran: "default" (h-10), "sm" (h-9), "lg" (h-11), "icon" (size-10)
<Button variant="default" size="default">Terapkan Filter</Button>
<Button variant="outline" size="sm">Reset Filter</Button>
<Button variant="destructive">Keluar Sesi</Button>
```

### B. Kontainer Kartu (`@/components/ui/card.tsx`)
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card className="p-5 sm:p-6">
  <CardHeader>
    <CardTitle>Rekap Gempolin</CardTitle>
    <CardDescription>Berdasarkan tanggal diolah WIB</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### C. Badge & Label Status (`@/components/ui/badge.tsx`)
```tsx
import { Badge } from "@/components/ui/badge";

// Warna: "primary", "success", "error", "warning", "info", "gray"
// Varian: "light" (Tinted), "solid", "ghost"
<Badge color="success" variant="light">Terkini</Badge>
<Badge color="warning" variant="light">Perlu Diperbarui</Badge>
<Badge color="gray" variant="light">Data tidak tersedia</Badge>
```

### D. Notifikasi & Banner Alert (`@/components/ui/alert.tsx`)
```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Varian: "default", "success", "warning", "destructive", "info"
<Alert variant="warning">
  <AlertTitle>Perhatian</AlertTitle>
  <AlertDescription>Sesi Anda akan berakhir dalam 5 menit.</AlertDescription>
</Alert>
```

### E. Tabel Data Tabular (`@/components/ui/table.tsx`)
```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableCell isHeader>Wilayah</TableCell>
      <TableCell isHeader className="text-end">Jumlah Terdata</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>RW 01</TableCell>
      <TableCell className="tabular-nums text-end">1.250</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### F. Dialog & Modal Pop-up (`@/components/ui/dialog.tsx`)
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger render={<Button variant="outline">ℹ Bantuan Rumus</Button>} />
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Panduan Rumus Partisipasi</DialogTitle>
      <DialogDescription>Penjelasan rumus BR-05 & BR-06</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### G. Dropdown Pilihan (`@/components/ui/select.tsx` & `@/components/ui/combobox.tsx`)
Digunakan untuk pemilih Periode (Tahun/Bulan) dan Wilayah hierarkis (Kelurahan/RW/RT).

### H. Bilah Kemajuan (*Progress Bar*) (`@/components/ui/progress-bar.tsx`)
Digunakan pada kartu 6 Indikator Partisipasi untuk menampilkan proporsi persentase secara visual.

### I. Indikator Pemuatan (*Skeleton Loader*) (`@/components/ui/skeleton.tsx`)
Wajib digunakan saat status *asynchronous* data sedang memuat agar dimensi kartu tidak bergeser (*zero CLS*).

---

## 3. Tingkat 2: Komponen Berulang Bersama (`@/components/common/*`)

1. **`ComponentCard` (`@/components/common/component-card.tsx`)**
   - Wrapper kartu berbingkai standar dengan judul terintegrasi dan slot aksi di kanan atas.
2. **`PageBreadcrumb` (`@/components/common/page-breadcrumb.tsx`)**
   - Menampilkan navigasi jejak halaman (misal: *Beranda Admin / Rekap Pengolahan Gempolin*).
3. **`ThemeToggler` (`@/components/common/theme-toggler.tsx`)**
   - Pengalih mode tema (*Light*, *Dark*, *System*) dengan ikon `SunIcon` dan `MoonIcon`.

---

## 4. Tingkat 3: Komponen Domain Khusus Persampahan Gempolsari

Komponen-komponen baru yang akan dibangun di `src/components/shared/*`:

### A. `PublicHeader` (`src/components/shared/public-header/index.tsx`)
- **Peruntukan:** Layar Publik P-01 dan P-02 (layout tanpa sidebar admin).
- **Elemen:**
  - Logo Kelurahan Gempolsari + Teks Judul Sistem
  - Tombol Modal "ℹ Bantuan Istilah & Rumus" (FR-09)
  - `ThemeToggler` (Dark/Light Mode)
  - Tombol Akses Admin "Masuk Kelurahan →" menuju `/signin`

### B. `MetricCard` (`src/components/shared/metric-card/index.tsx`)
- **Peruntukan:** Kartu KPI Demografi, Ringkasan Gempolin, dan Bank Sampah.
- **Props Interface:**
  ```tsx
  interface MetricCardProps {
    title: string;
    value: number | null;
    unit?: string;
    sublabel?: string;
    trend?: {
      percentage: number;
      isPositive: boolean;
      comparisonLabel: string;
    };
    icon?: React.ReactNode;
    isLoading?: boolean;
  }
  ```
- **Aturan Render:** Wajib menggunakan class `tabular-nums`. Jika `value === null`, tampilkan badge `"Data tidak tersedia"` (BR-07).

### C. `IndicatorCard` (`src/components/shared/indicator-card/index.tsx`)
- **Peruntukan:** Penyajian 6 Indikator Inti Partisipasi (Rumah/KK/Warga Memilah & Mengolah).
- **Props Interface:**
  ```tsx
  interface IndicatorCardProps {
    label: string;
    numerator: number;
    denominator: number;
    percentage: number | null;
    activity: "memilah" | "mengolah";
    objectType: "rumah" | "kk" | "warga";
  }
  ```
- **Visual:** Dilengkapi teks persentase besar, teks rasio (`X dari Y Rumah`), dan bilah `ProgressBar` dengan warna semantik Pine Green.

### D. `FilterBar` (`src/components/shared/filter-bar/index.tsx`)
- **Peruntukan:** Panel atas pada Dashboard Publik dan Layar Admin.
- **Komponen:**
  - Dropdown Periode (Bulan & Tahun)
  - Dropdown Wilayah (Semua Kelurahan $\rightarrow$ RW 01 s.d. RW 06 $\rightarrow$ RT)
  - Tombol Reset Filter ("Reset" dengan ikon `FilterIcon` - FR-06)
- **Logika:** Menggunakan hook `useDashboardFilters()` untuk memperbarui query string URL secara instan.

### E. `MapLegend` (`src/components/shared/map-legend/index.tsx`)
- **Peruntukan:** Overlay legenda 5 kelas pada Layar Peta Partisipasi P-02.
- **Visual:**
  - Kelas 1: Sangat Tinggi (80%–100%) - Kotak `#15803D` / `#22C55E`
  - Kelas 2: Tinggi (60%–<80%) - Kotak `#22C55E` / `#4ADE80`
  - Kelas 3: Sedang (40%–<60%) - Kotak `#EAB308` / `#FACC15`
  - Kelas 4: Rendah (20%–<40%) - Kotak `#F97316` / `#FB923C`
  - Kelas 5: Sangat Rendah (0%–<20%) - Kotak `#DC2626` / `#F87171`
  - Tanpa Data: Kotak Abu-Abu `#D1D5DB` / `#4B5563`
- **A11y (NFR-23):** Setiap entri memiliki label teks nama kelas eksplisit (tidak hanya mengandalkan warna).

### F. `SpatialTableFallback` (`src/components/shared/spatial-table-fallback/index.tsx`)
- **Peruntukan:** Fallback otomatis saat data geometri GeoJSON peta belum tersedia (FR-50) atau saat pengguna beralih ke mode tabel.
- **Kolom:** Wilayah (RW/RT), Pembilang, Penyebut, Persentase (%), Kelas Legenda, Status Data.

### G. `DropzoneUploader` (`src/components/shared/dropzone-uploader/index.tsx`)
- **Peruntukan:** Layar Pembaruan Data Excel A-06.
- **Fitur:** Area drag-and-drop file `.xlsx`, validasi ekstensi, batas ukuran maksimal 10MB, tombol pilih file manual, dan tombol unduh template kosong.

### H. `ValidationAlertList` (`src/components/shared/validation-alert-list/index.tsx`)
- **Peruntukan:** Menampilkan hasil pengecekan skema sebelum impor data dieksekusi (FR-60, FR-61):
  - ✅ Berkas valid dan siap diimpor
  - ⚠ Peringatan anomali (misal: angka di luar rentang normal)
  - ❌ Kesalahan fatal pemblokir impor (misal: kolom wajib hilang, kode RT tidak terdaftar)

### I. `HelpModal` (`src/components/shared/help-modal/index.tsx`)
- **Peruntukan:** Dialog bantuan penjelasan istilah persampahan dan rumus matematika BR-05 & BR-06 bagi warga.

---

## 5. Tingkat 4: Katalog Ikon Proyek (`@/icons`)

Seluruh ikon diimpor langsung dari pustaka `@/icons`. **Dilarang menyisipkan SVG mentah inline.**

| Nama Ikon di `@/icons` | Representasi Visual | Penggunaan di Proyek |
| :--- | :--- | :--- |
| **`TrashBinIcon`** | Tempat Sampah | Logo brand, menu Rekap Gempolin, aktivitas memilah |
| **`FilterIcon`** | Corong Filter | Tombol filter data & tombol reset filter (FR-06) |
| **`MapIcon`** | Peta Lipat | Tombol navigasi Peta Partisipasi Spasial (P-02) |
| **`UploadIcon`** | Panah Awan Unggah | Area Dropzone unggah file Excel (A-06) |
| **`PieChartIcon`** | Diagram Lingkaran | Menu Demografi & Partisipasi warga |
| **`CheckCircleIcon`** | Centang Lingkaran | Status sinkronisasi sukses, validasi baris valid |
| **`AlertIcon`** | Segitiga Peringatan | Status "Perlu diperbarui", warning anomali baris |
| **`OctagonAlertIcon`**| Oktagon Silang Bahaya | Status gagal/rollback impor, baris Excel tertolak |
| **`InfoCircleIcon`** | Huruf "i" Lingkaran | Tombol Bantuan Istilah/Rumus (FR-09), tooltip tabel |
| **`UserCircleIcon`** | Profil Pengguna | Header Admin Kelurahan, menu profil admin |
| **`LogOutIcon`** | Pintu Keluar | Tombol logout sesi admin (FR-18) |
| **`MinusIcon`** | Garis Horizontal Strip | Simbol status "Data tidak tersedia" (BR-07) |

---

## 6. Checklist Kepatuhan Pembuatan Komponen Baru

Setiap kali membuat komponen baru di repositori ini, agen wajib memastikan:
- [ ] File diletakkan di folder yang tepat menggunakan nama **kebab-case**.
- [ ] Komponen diekspor menggunakan `export default function`.
- [ ] Memiliki `interface Props` eksplisit dengan **Zero `any`**.
- [ ] Seluruh angka metrik dan tabel memiliki class **`tabular-nums`**.
- [ ] Menggunakan design tokens warna Pine Green (`brand-*`) dan memiliki pasangan kelas **`dark:`**.
- [ ] Tidak mendefinisikan komponen di dalam komponen lain (*no nested components*).
- [ ] Telah lulus verifikasi mandiri linter (`npm run lint`).
