# Pedoman Desain Sistem & Gaya Visual (Design System Guideline)
## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Versi:** 1.0  
**Status:** Disetujui  
**Stack Implementasi:** Tailwind CSS v4 · Outfit Font · MapLibre GL · ApexCharts · Base UI

---

## 1. Filosofi & Arah Desain (*Design Taste & Rationale*)

Dashboard pengelolaan sampah tingkat kelurahan ini dirancang untuk mencapai dua tujuan utama:
1. **Kepercayaan Publik (*Civic Trust*) untuk Warga:** Antarmuka publik yang bersih, ramah lingkungan, transparan, dan tidak kaku seperti software birokrasi konvensional.
2. **Ergonomi Operasional untuk Admin Kelurahan:** Densitas data tinggi, kontras tajam, bebas kelelahan visual (*anti-fatigue*), dan status data terbaca secara instan.
3. **Anti-Slop (*Anti-AI/Template Look*):** Menolak palet "biru elektrik generik SaaS" bawaan template; menggantinya dengan palet **Deep Botanical Pine & Civic Slate** yang memiliki identitas ekologis dan berwibawa.

---

## 2. Matriks Token Warna: Light Mode vs. Dark Mode

### A. Fondasi Permukaan & Latar Belakang (*Surface Hierarchy*)

| Lapisan Elemen | Peruntukan | Light Mode (Hex / Class) | Dark Mode (Hex / Class) |
| :--- | :--- | :--- | :--- |
| **Layer 0: Canvas Base** | Latar belakang seluruh halaman/layar | `#F8FAFC` (`bg-slate-50`) | `#0B0F19` (`dark:bg-gray-900`) |
| **Layer 1: Card Surface** | Kartu metrik KPI, panel filter, blok grafik | `#FFFFFF` (`bg-white`) | `#111827` (`dark:bg-gray-800/60` atau `dark:bg-white/[0.03]`) |
| **Layer 2: Popover / Modal** | Dialog pop-up, tooltip, dropdown menu | `#FFFFFF` (`bg-white` + `shadow-theme-lg`) | `#1F2937` (`dark:bg-gray-800` + `shadow-theme-xl`) |
| **Layer Shell** | Sidebar navigasi & navbar atas | `#FFFFFF` (`bg-white`) | `#0F172A` (`dark:bg-gray-900`) |

---

### B. Hierarki Tipografi & Teks

Memenuhi standar aksesibilitas WCAG 2.1 AA (kontras teks utama $\ge 4.5:1$):

| Token Teks | Peruntukan | Light Mode | Dark Mode | Rasio Kontras |
| :--- | :--- | :--- | :--- | :--- |
| **Text Primary** | Judul besar, angka KPI, teks aktif tabel | `#0F172A` (`text-gray-900`) | `#F8FAFC` (`dark:text-white/90`) | > 12:1 (Sangat Tinggi) |
| **Text Secondary** | Subtitle kartu, header kolom tabel | `#475569` (`text-gray-700`) | `#CBD5E1` (`dark:text-gray-300`) | > 7:1 (AA Pass) |
| **Text Muted** | Tanggal pembaruan, satuan unit (kg, KK) | `#64748B` (`text-gray-500`) | `#94A3B8` (`dark:text-gray-400`) | > 4.5:1 (AA Pass) |
| **Text Inverted** | Teks di atas tombol primer | `#FFFFFF` (`text-white`) | `#FFFFFF` (`text-white`) | > 4.5:1 |
| **Tabular Numbers** | Seluruh data numerik (berat kg, %, KK) | Wajib class `tabular-nums` | Wajib class `tabular-nums` | Mencegah CLS |

---

### C. Border & Garis Pembatas

| Token Elemen | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Border Default (Kartu, Input)** | `#E2E8F0` (`border-gray-200`) | `#1E293B` (`dark:border-gray-800`) |
| **Border Subtle (Divider, Zebra)** | `#F1F5F9` (`border-gray-100`) | `#1E293B/50` (`dark:border-gray-800/50`) |
| **Hover Row Tabel** | `#F8FAFC` (`hover:bg-gray-50`) | `#1E293B/30` (`dark:hover:bg-white/5`) |
| **Ring Focus (A11y)** | `rgba(5, 150, 105, 0.2)` (`ring-brand-500/20`) | `rgba(16, 185, 129, 0.4)` (`dark:ring-brand-400/40`) |

---

### D. Palet Brand Utama: Pine Green Eco-Civic

Nilai variabel `--color-brand-*` pada Tailwind CSS v4 (`src/app/globals.css`):

| Token | Nilai Hex | Peran Light Mode | Peran Dark Mode |
| :--- | :--- | :--- | :--- |
| **`brand-50`** | `#ECFDF5` | Latar belakang badge aktif / chip | Tint halus (`dark:bg-brand-500/15`) |
| **`brand-100`**| `#D1FAE5` | Aksen kontainer lembut | Tint kontainer sekunder |
| **`brand-200`**| `#A7F3D0` | Garis seleksi lembut | Border badge aktif |
| **`brand-500`**| `#10B981` | Indikator aktif, toggle switch | Link hover, ikon aksen |
| **`brand-600`**| `#059669` | **Tombol Primer (Default)**, teks link | Tombol Primer Hover |
| **`brand-700`**| `#047857` | **Tombol Primer Hover** | **Tombol Primer (Default)** |
| **`brand-800`**| `#065F46` | Tombol Primer Active/Press | Aksen gelap |
| **`brand-900`**| `#064E3B` | Teks judul kontras tinggi | Background kontras |

---

### E. Status Data Semantik & Validasi Impor

Warna **tidak pernah berdiri sendiri** (selalu berpasangan dengan teks nama status dan ikon SVG):

| Status | Makna Kebutuhan | Light Mode (Badge / Alert) | Dark Mode (Badge / Alert) | Ikon Pendamping |
| :--- | :--- | :--- | :--- | :--- |
| **Sukses** | Data terverifikasi, impor berhasil | `bg-green-50 text-green-700 border-green-200` | `bg-green-500/15 text-green-400 border-green-500/30` | `CheckCircleIcon` |
| **Peringatan**| Keterlambatan data, anomali baris | `bg-amber-50 text-amber-700 border-amber-200` | `bg-amber-500/15 text-amber-400 border-amber-500/30` | `AlertIcon` |
| **Bahaya** | Baris ditolak, impor gagal/rollback | `bg-red-50 text-red-700 border-red-200` | `bg-red-500/15 text-red-400 border-red-500/30` | `OctagonAlertIcon` |
| **Informasi** | Status sinkronisasi, disclaimer sistem | `bg-sky-50 text-sky-700 border-sky-200` | `bg-sky-500/15 text-sky-400 border-sky-500/30` | `InfoCircleIcon` |
| **Netral** | Data tidak tersedia (BR-07) | `bg-gray-100 text-gray-600 border-gray-200` | `bg-white/5 text-gray-400 border-gray-700` | `MinusIcon` |

---

### F. Palet Peta Spasial & Legenda 5-Kelas (`BR-08`, `NFR-23`)

Pewarnaan poligon peta dan legendanya dirancang **ramah buta warna (*color-blind safe*)** dengan rasio kontras terhadap teks $\ge 3:1$:

| Tingkat Partisipasi | Rentang Nilai | Nama Kelas | Light Mode Fill | Dark Mode Fill (Tingkat Saturasi Disesuaikan) |
| :--- | :--- | :--- | :--- | :--- |
| **Kelas 1** | 80% – 100% | **Sangat Tinggi** | `#15803D` (Forest Green) | `#22C55E` (Emerald Terang) |
| **Kelas 2** | 60% – <80% | **Tinggi** | `#22C55E` (Emerald Leaf) | `#4ADE80` (Mint Hijau) |
| **Kelas 3** | 40% – <60% | **Sedang** | `#EAB308` (Warm Yellow) | `#FACC15` (Bright Gold) |
| **Kelas 4** | 20% – <40% | **Rendah** | `#F97316` (Warm Ochre) | `#FB923C` (Bright Coral) |
| **Kelas 5** | 0% – <20% | **Sangat Rendah** | `#DC2626` (Coral Red) | `#F87171` (Light Crimson) |
| **Tanpa Data** | Penyebut = 0 | **Data Tidak Tersedia** | `#D1D5DB` (Gray 300) | `#4B5563` (Gray 600) |
| **Border Poligon** | Garis Batas RT | Wilayah Administrasi | `#FFFFFF` (Solid 1.5px) | `#0B0F19` (Solid 1.5px) |

---

### G. Visualisasi Grafik (ApexCharts Tokens)

| Elemen Grafik | Konfigurasi Light Mode | Konfigurasi Dark Mode |
| :--- | :--- | :--- |
| **Garis Tren Gempolin** | `#059669` (Brand Pine 600) | `#10B981` (Brand Emerald 500) |
| **Batang Bank Sampah** | `#0284C7` (Sky Blue 600) | `#38BDF8` (Sky Blue 400) |
| **Garis Kisi (*Gridlines*)** | `#E2E8F0` (`stroke-gray-100`) | `#1E293B` (`stroke-gray-800`) |
| **Label Sumbu (X/Y Axis)** | `#64748B` (`fill-gray-500`) | `#94A3B8` (`fill-gray-400`) |
| **Tooltip Container** | `bg-white border-gray-200 shadow-theme-md` | `bg-gray-900 border-gray-800 shadow-theme-xl` |

---

## 3. Sistem Spasi & Penataan Tata Letak (*Layout & Spacing*)

### A. Kisi 8-Point (*8-Point Grid System*)
Seluruh dimensi margin, padding, gap, dan tinggi komponen menggunakan kelipatan 4px atau 8px:

```
4px   (gap-1 / p-1)   → Jarak mikro (angka KPI ke badge tren)
8px   (gap-2 / p-2)   → Jarak internal (ikon ke teks, label ke field)
12px  (gap-3 / p-3)   → Padding vertikal tombol/dropdown, jarak antar tombol aksi
16px  (gap-4 / p-4)   → Padding kartu mobile (< 768px), gap grid kartu mobile
24px  (gap-6 / p-6)   → Padding kartu desktop, gap grid kolom dashboard
32px  (gap-8 / p-8)   → Jarak pemisah antar-section fitur
40px  (space-y-10)    → Jarak makro (filter bar atas ke blok konten)
```

### B. Hukum Kedekatan Gestalt (*Law of Proximity*)
Memastikan keterhubungan visual logis:
$$\text{Jarak Internal Mikro } (4\text{px}-8\text{px}) < \text{Jarak Antar-Elemen Meso } (16\text{px}-24\text{px}) < \text{Jarak Antar-Blok Makro } (32\text{px}-40\text{px})$$
- Label kolom berjarak 6px ke atas input/angkanya.
- Kartu dalam satu grup (misal: 6 Indikator) berjarak 16px.
- Blok Partisipasi Mandiri berjarak 32px dari blok Rekap Gempolin.

### C. Hukum Fitts (*Fitts’s Law*) & Aksesibilitas Target Sentuh
- **Target Sentuh Minimum:** Tinggi interaktif minimal 44px (`h-10` hingga `h-11`) untuk seluruh tombol utama, dropdown select, dan kontrol zoom peta pada perangkat mobile (HP 360px sesuai `NFR-25`).
- **Jarak Antar Aksi Sensitif:** Tombol "Batalkan" dan "Proses Impor" dipisahkan jarak aman minimal 16px (`gap-4`) untuk mencegah kesalahan klik (*fat-finger prevention*).

### D. Kesetaraan Batas Tepi (*Equal Edges*)
- Kontainer utama memiliki padding kiri-kanan simetris (`px-4 sm:px-6 lg:px-8` dengan batas `max-w-7xl` atau `max-w-(--breakpoint-2xl)`).
- Sisi kiri kartu atas tegak lurus sejajar dengan sisi kiri tabel dan batas peta di bawahnya (*vertical alignment grid*).
- Radius sudut konsisten: `rounded-xl` (12px) untuk kontainer/kartu, `rounded-lg` (8px) untuk tombol/input, `rounded-full` untuk badge/pill.

---

## 4. Standar Desain Paginasi Tabel Terpadu (*Unified Table Pagination Standard*)

Setiap kali antarmuka menyajikan data dalam bentuk tabel (baik tabel ringkasan publik, tabel spasial, maupun tabel rekap internal admin), pengembang dan AI agent **WAJIB** menyertakan footer paginasi terpadu dengan desain, struktur, dan perilaku yang seragam.

### A. Anatomi Footer Paginasi
Footer tabel wajib diletakkan langsung di dalam kontainer kartu pembungkus tabel (`overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900`) tepat di bawah elemen `<Table>`:

```
+-----------------------------------------------------------------------------------+
|  [Tabel Data: TableHeader + TableBody dengan scroll horizontal aman]             |
+-----------------------------------------------------------------------------------+
|  [Footer: border-t border-gray-100 bg-gray-50/50 dark:border-gray-800...]        |
|                                                                                   |
|  Menampilkan 1–10 dari 67 data                   [ < ] [ 1 ] [ 2 ] ... [ 7 ] [ > ]|
|  (Sisi Kiri: Ringkasan Tabular)                  (Sisi Kanan: Kontrol Paginasi)   |
+-----------------------------------------------------------------------------------+
```

### B. Aturan Desain & Interaksi Paginasi
1. **Ukuran Halaman Default:**
   - Standar ukuran halaman (*page size*) adalah **10 baris per halaman** (`PAGE_SIZE = 10`).
2. **Ringkasan Data Sisi Kiri:**
   - Wajib mencantumkan rentang baris aktif dan total data:  
     `Menampilkan X–Y dari N [nama entitas]`
   - Angka wajib menggunakan format numerik lokal Indonesia (`id-ID`) dan class `tabular-nums font-semibold text-gray-800 dark:text-gray-200`.
3. **Penyembunyian Bersyarat (*Conditional Render*):**
   - Jika total data $\le$ ukuran halaman (`totalPages <= 1`), kontrol tombol angka/navigasi **disembunyikan**, tetapi baris ringkasan teks di sisi kiri **tetap ditampilkan** agar pengguna tahu jumlah total data terdata.
4. **Gaya Visual Tombol Paginasi:**
   - Gunakan komponen primitif resmi `@/components/ui/pagination`:
     - Tombol navigasi (`PaginationPrevious`, `PaginationNext`): `size="icon" variant="outline"` dengan ikon panah.
     - Tombol angka (`PaginationLink`): `size="icon" variant="outline"`.
     - Tombol halaman aktif (`isActive={true}`): Berlatar belakang warna primer `brand` kontras tinggi (`bg-brand-600 text-white dark:bg-brand-500`).
     - Pemisah Elipsis (`PaginationEllipsis`): Titik tiga halus vertikal/horizontal untuk melompati rentang halaman.
   - Status Non-Aktif (*Disabled*): Tombol Previous wajib disabled jika berada di halaman 1, dan tombol Next wajib disabled jika berada di halaman terakhir.

---

## 5. Pedoman Responsif & Adaptasi Perangkat (*Responsive Layout & Breakpoint System*)

Sesuai standar non-fungsional antarmuka (`NFR-25`), aplikasi harus responsif sempurna dan dapat dioperasikan secara nyaman mulai dari layar ponsel pintar terkecil (lebar 360px), tablet, hingga layar monitor desktop lebar (1920px+).

### A. Matriks Breakpoint Tailwind CSS

| Breakpoint | Lebar Layar | Target Perangkat | Karakteristik Tata Letak |
| :--- | :--- | :--- | :--- |
| **Default (Base)** | `< 640px` | Ponsel Cerdas (360px–639px) | Tata letak 1 kolom vertikal, padding `p-4`, target sentuh diperbesar ($\ge 44$px). |
| **`sm:`** | `$\ge$ 640px` | Ponsel Lebar / Tablet Vertikal | Grid 2 kolom, filter bar beralih ke semi-horizontal. |
| **`md:`** | `$\ge$ 768px` | Tablet Horizontal (iPad) | Kontainer mulai memanfaatkan lebar samping, gap `gap-6`. |
| **`lg:`** | `$\ge$ 1024px` | Laptop / Desktop Standar | Layout 2-panel (Peta + Legenda mengambang), Drawer slide-over 480px–520px. |
| **`xl:`** | `$\ge$ 1280px` | Monitor Desktop Lebar | Kontainer dipusatkan dengan `max-w-7xl` simetris (*equal edges*). |

### B. Adaptasi Responsif Paginasi (Dual-Mode Pagination)
Untuk menjaga keterbacaan pada perangkat layar sempit tanpa memicu overflow horizontal:
1. **Tampilan Mobile (`< sm` / `< 640px`):**
   - Gunakan **Mode Stepper Ringkas**:
     ```tsx
     <div className="flex items-center justify-between sm:hidden">
       <span className="text-xs text-gray-500 dark:text-gray-400">
         Hal. {safePage} dari {totalPages}
       </span>
       <div className="flex items-center gap-1.5">
         <PaginationPrevious size="icon" disabled={safePage <= 1} ... />
         <PaginationNext size="icon" disabled={safePage >= totalPages} ... />
       </div>
     </div>
     ```
2. **Tampilan Desktop (`≥ sm` / `≥ 640px`):**
   - Tampilkan baris paginasi lengkap (`PaginationContent`) dengan tombol-tombol nomor halaman dan elipsis di sebelah kanan teks ringkasan data.

### C. Penanganan Tabel Responsif (*Table Overflow Protocol*)
- Seluruh tabel wajib dibungkus kontainer `<div className="overflow-x-auto">` di dalam kartu berbingkai.
- Dilarang membuat teks di dalam sel tabel wrap sembarangan; gunakan `whitespace-nowrap` pada kolom-kolom penting (tanggal, berat, persentase, status badge).
- Kolom teks panjang (seperti nama penanggung jawab atau catatan) wajib diberikan batas lebar maksimal (`max-w-xs truncate`).

### D. Ergonomi Sentuh & Tombol Mobile (*Touch Targets - Fitts's Law*)
- Pada layar seluler, elemen interaktif (tombol, dropdown `<select>`, input pencarian) wajib memiliki tinggi minimal 40px–44px (`h-10` s.d. `h-11`).
- Jarak antar tombol aksi minimal 8px (`gap-2`) untuk mencegah salah tekan jari (*fat-finger prevention*).

