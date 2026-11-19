# Dokumen Spesifikasi Sistem & Fungsional (System & Functional Specification)
## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Versi:** 1.0  
**Status:** Disetujui  
**Stack Implementasi:** Next.js 16 (App Router) · React 19 · TypeScript · next-intl (id default) · ApexCharts · MapLibre GL  
**Spesifikasi Desain:** Terhubung ke [01-design-system-guideline.md](./01-design-system-guideline.md)

> 💡 **Catatan untuk Tim Pengembang:** Tautan antar-dokumen menggunakan jalur relatif (`./`) agar selalu valid di GitHub maupun di folder clone masing-masing anggota tim.

---

## 1. Intent & Lingkup Tanggung Jawab (*Intent & Scope*)

Platform ini adalah **lapisan integrasi dan penyajian informasi agregat** pengelolaan sampah Kelurahan Gempolsari. Sistem mengumpulkan data dari tiga sumber eksternal (operasional Gempolin, bank sampah/IoT, dan input manual admin via Excel), lalu menyajikannya dalam dua zona akses:

1. **Zona Publik (Tanpa Autentikasi):** Warga dan masyarakat umum dapat memantau capaian pilah-olah sampah secara transparan tanpa perlu login.
2. **Zona Internal Admin (Dengan Autentikasi):** Khusus Admin Kelurahan untuk memantau kelengkapan data per RT, memeriksa status sinkronisasi, dan mengunggah berkas pembaruan data (.xlsx).

### Batasan Sistem (*System Boundaries & Non-Goals*):
- ❌ Tidak menyediakan fungsi pengajuan, persetujuan, atau pelaksanaan pengangkutan sampah (FR-28).
- ❌ Tidak mengubah/mengedit transaksi operasional Gempolin atau sistem sumber melalui platform (FR-14, NFR-09).
- ❌ Tidak mengelola transaksi keuangan atau saldo nasabah bank sampah (FR-56, BR-09).
- ❌ Tidak mengontrol perangkat keras/sensor timbangan IoT secara langsung (FR-54, NFR-09).
- ❌ Tidak mencatat proses pengolahan residu KSM.
- ❌ Tidak menyediakan fitur pendaftaran/registrasi akun mandiri (BR-02: peran tunggal hanya Admin Kelurahan).
- ❌ **Strict Privasi Warga (BR-01, FR-11):** Dilarang menampilkan nama warga, nomor rumah, atau alamat detail hunian di seluruh antarmuka publik maupun pop-up peta.

---

## 2. Aturan Bisnis Inti (Business Rules: BR-01 s.d. BR-11)

- **BR-01:** Dashboard publik wajib bersifat agregat; nama warga dan alamat detail hunian tidak boleh ditampilkan.
- **BR-02:** Admin Kelurahan merupakan satu-satunya peran pengguna internal yang dikonfirmasi.
- **BR-03:** Berat terverifikasi Gempolin berbeda makna dari partisipasi mandiri warga; data partisipasi tidak boleh dikonversi menjadi tonase tanpa aturan sah.
- **BR-04:** Periode rekap Gempolin dihitung berdasarkan tanggal diolah pada zona waktu Indonesia Barat (WIB).
- **BR-05:** Rumus Persentase Partisipasi:
  $$\text{Persentase} = \left(\frac{\text{Jumlah yang Memenuhi}}{\text{Jumlah Terdata}}\right) \times 100\%$$
  pada objek dan aktivitas yang sama.
- **BR-06:** Agregasi RW dan Kelurahan dihitung dari total penjumlahan pembilang dibagi total penyebut seluruh RT di bawahnya (bukan merata-ratakan persentase RT).
- **BR-07:** Nilai nol ($0$), data kosong, dan data tidak tersedia adalah tiga kondisi berbeda. Jika penyebut bernilai nol ($0$), sistem wajib menampilkan label **"Data tidak tersedia"** (bukan 0%).
- **BR-08:** Rentang klasifikasi persentase peta dibagi menjadi 5 kelas (0–<20% Sangat Rendah s.d. 80–100% Sangat Tinggi).
- **BR-09:** Platform hanya membaca data bank sampah, tidak mengelola saldo nasabah atau transaksi keuangan.
- **BR-10:** Berkas rekap yang diimpor ulang diproses dengan mekanisme penggantian/koreksi (*replace*), bukan menambah transaksi baru (*append*).
- **BR-11:** Waktu pembaruan sumber, periode data, dan waktu impor wajib ditampilkan secara terpisah.

---

## 3. Arsitektur Routing & Pemisahan Akses

Menggunakan pola **Pendekatan A (Public di `/`, Admin di `/admin/*`)** dengan pemisahan tegas di lapisan URL dan API:

```
src/app/
├── admin/                         ← Zona Internal Admin (Layout Mandiri Admin Shell)
│   ├── layout.tsx                 ← AppSidebar + AppHeader + Proteksi sesi admin
│   ├── page.tsx                   → /admin             (A-02: Dashboard Internal Admin)
│   ├── gempolin/page.tsx          → /admin/gempolin    (A-03: Rekap Pengolahan Gempolin)
│   ├── demografi/page.tsx         → /admin/demografi   (A-04: Demografi & Partisipasi)
│   ├── bank-sampah/page.tsx       → /admin/bank-sampah (A-05: Informasi Bank Sampah)
│   ├── pembaruan-data/page.tsx    → /admin/pembaruan-data (A-06: Impor Data Excel)
│   ├── sinkronisasi/page.tsx      → /admin/sinkronisasi (A-07: Log & Status Kemutakhiran)
│   └── profil/page.tsx            → /admin/profil      (A-08: Profil & Keamanan Admin)
├── peta-partisipasi/
│   └── page.tsx                   → /peta-partisipasi  (P-02: Peta Partisipasi Spasial)
├── login/                         ← Zona Autentikasi
│   ├── layout.tsx                 ← Auth Shell minimalis (Layar Penuh, Card Tengah)
│   └── page.tsx                   → /login             (A-01: Login Admin Kelurahan)
├── layout.tsx                     ← Root Layout Aplikasi (ThemeProvider, Direction, Tooltip)
├── not-found.tsx                  ← Halaman Not Found Global
└── page.tsx                       → /                  (P-01: Dashboard Publik)

src/legacy-demo/                   ← Arsip Referensi Kode Demo Bawaan Template (Di luar src/app)
├── ecommerce-home/
├── error-pages/
├── main/ (pages, tables, calendar, form-elements, profile)
├── others-pages/ (chart, ui-elements)
└── signup/
```

> **Standar Arsitektur Pure Kebab-Case (No Parentheses):** 
> 1. Dilarang menggunakan tanda kurung `(...)` pada nama folder di seluruh repositori. Seluruh folder menggunakan penamaan **kebab-case** yang jelas (seperti `recent-order`, `peta-partisipasi`, `bank-sampah`).
> 2. Seluruh file demo template lama dipindahkan ke `src/legacy-demo/` (di luar `src/app/`) sehingga tidak dihitung sebagai rute aplikasi oleh Next.js dan hierarki routing 100% bersih.

---

## 4. Spesifikasi Detail 10 Halaman Sistem

### A. Zona Publik (Guest / Non-Autentikasi)

#### 1. P-01: Dashboard Publik (`/`)
- **Tujuan:** Papan informasi digital terbuka bagi seluruh warga Kelurahan Gempolsari.
- **Komponen Inti:**
  - `PublicHeader`: Logo kelurahan, switcher dark/light mode, tombol modal "ℹ Bantuan Istilah & Rumus" (BR-05 & BR-06).
  - `Label Periode & Timestamp`: Penanda waktu data per-bulan dan timestamp terakhir diperbarui WIB.
  - `Panel Filter Global`: Dropdown Periode dan Wilayah (Kelurahan $\rightarrow$ RW $\rightarrow$ RT) + Tombol Reset Filter (FR-06).
  - `Kartu Demografi`: 3 Kartu agregat (Rumah, KK, Jiwa terdata).
  - `6 Indikator Inti Partisipasi`: 
    - % Rumah Memilah, % Rumah Mengolah
    - % KK Memilah, % KK Mengolah
    - % Warga Memilah, % Warga Mengolah
    - Menampilkan badge "Data tidak tersedia" jika penyebut nol (BR-07).
  - `Blok Rekapitulasi Gempolin`: Total request dan kg sampah terolah + grafik tren 6 bulan.
  - `Blok Rekapitulasi Bank Sampah`: Total kg sampah terpilah non-organik + grafik per bulan.
  - `Tombol Navigasi Peta`: CTA menuju `/peta-partisipasi`.

#### 2. P-02: Peta Partisipasi Spasial (`/peta-partisipasi`)
- **Tujuan:** Visualisasi geografis sebaran 5 kelas partisipasi warga tingkat RT/RW.
- **Komponen Inti:**
  - `Kontrol Peta`: Pemilih 6 Indikator Inti, Filter 5 Kelas Legenda, Input Pencarian RT/RW.
  - `Viewer Peta Interaktif`: MapLibre GL / VectorMap dengan kontrol zoom (`+` / `-`) dan pusatkan peta.
  - `Legenda 5 Kelas`: Teks nama kelas + rentang % + status abu-abu "Data Tidak Tersedia" (NFR-23).
  - `Pop-up Wilayah`: Menampilkan nama RT/RW, pembilang, penyebut, %, dan kelas klasifikasi (STRICT: tanpa nama warga / alamat hunian).
  - `Fallback Tabel Spasial (FR-50)`: Tampilan tabel tabular wilayah yang aktif secara otomatis bila file geometri GeoJSON poligon RT/RW belum tersedia di sistem.

---

### B. Zona Internal Admin Kelurahan (Autentikasi Diperlukan)

#### 3. A-01: Layar Login Admin (`/login`)
- **Tujuan:** Pintu masuk otentikasi tunggal Admin Kelurahan (BR-02).
- **Fitur & Keamanan:**
  - Input Username & Password dengan toggle intip kata sandi (👁) tanpa blokir paste.
  - Lockout sementara setelah 5 kali berturut-turut gagal login (NFR-15).
  - Tidak ada opsi registrasi/sign-up mandiri publik.

#### 4. A-02: Dashboard Internal Admin (`/admin`)
- **Tujuan:** Monitoring operasional internal kelurahan dan kesiapan data.
- **Komponen Inti:**
  - `Status Sumber Data`: 3 kartu status (Gempolin, Bank Sampah, Demografi) dengan label "Terkini" atau "Perlu Diperbarui" (FR-75).
  - `Metrik Operasional Internal`: Total request, total kg terolah, baris data ditandai, baris data ditolak.
  - `Rincian Tabel per RT`: Monitoring kelengkapan pelaporan data partisipasi per RT.
  - `Banner Peringatan Sesi`: Notifikasi melayang jika sesi mendekati batas timeout 30 menit (FR-20).

#### 5. A-03: Rekap Pengolahan Gempolin (`/admin/gempolin`)
- **Tujuan:** Rincian operasional pengolahan sampah Gempolin berdasarkan tanggal diolah (WIB).
- **Komponen Inti:**
  - 2 Kartu KPI: Total request dan tonase kg terolah bulan berjalan.
  - Kartu Komparasi: Perbandingan antar-periode atau antar-wilayah dengan kalkulasi selisih absolut dan persentase perubahan (FR-27).
  - Grafik tren harian tonase diolah (WIB).
  - Tabel rincian per RT & tabel rincian harian (dilengkapi tooltip penjelasan perbedaan Berat Verifikasi vs Terolah - BR-03).

#### 6. A-04: Demografi & 6 Indikator Partisipasi (`/admin/demografi`)
- **Tujuan:** Analisis mendalam data demografi dan 6 indikator pilah-olah sampah.
- **Komponen Inti:**
  - Filter Objek: Toggle interaktif [Rumah | KK | Warga].
  - 6 Kartu Indikator Partisipasi dengan progress bar proporsional.
  - Tabel Data Bertingkat (Hierarki RW $\rightarrow$ RT): Perhitungan % RW murni dari total pembilang $\div$ total penyebut (BR-06).

#### 7. A-05: Informasi Bank Sampah (`/admin/bank-sampah`)
- **Tujuan:** Agregasi data tonase sampah terpilah dari timbangan IoT/sistem bank sampah terkait.
- **Komponen Inti:**
  - Banner Disclaimer Sistem: Platform hanya membaca data agregat numerik (BR-09).
  - Kartu metrik: Total kg terpilah, jumlah nasabah aktif, status pembaruan sumber.
  - Grafik batang bulanan & tabel kategori sampah (plastik, kertas, logam, dll.).

#### 8. A-06: Layar Pembaruan Data Excel (`/admin/pembaruan-data`)
- **Tujuan:** Form unggah berkas spreadsheet berekstensi `.xlsx` untuk pembaruan data berkala.
- **Alur & Validasi (FR-58 s.d. FR-69):**
  1. Pilih sumber data (Demografi / Gempolin / Bank Sampah) & unduh template kosong.
  2. Drag-and-drop berkas `.xlsx` (maksimal 10MB, makro otomatis dimatikan - NFR-19).
  3. Validasi otomatis: cek skema kolom, kewajaran nilai, dan pemetaan RT/RW.
  4. Munculkan rekap validasi: ✅ Valid, ⚠ Warning, ❌ Error.
  5. Pratinjau 12 baris pertama data di tabel.
  6. Tombol "Proses Impor" aktif jika bebas error; proses dieksekusi dalam **satu transaksi atomik (rollback penuh jika gagal)** dan mencegah penghitungan ganda (BR-10).

#### 9. A-07: Status Kemutakhiran & Riwayat Sinkronisasi (`/admin/sinkronisasi`)
- **Tujuan:** Log audit transparan dan status keterlambatan data.
- **Komponen Inti:**
  - Tabel status per sumber dengan 3 pemisahan makna waktu: Waktu Sumber, Periode Laporan, dan Waktu Impor (BR-11).
  - Label otomatis "Perlu diperbarui" bila data melampaui toleransi keterlambatan.
  - Tabel Audit Log: Waktu impor, nama admin, nama file, jumlah baris berhasil/ditolak, status transaksi atomik.

#### 10. A-08: Profil & Keamanan Admin (`/admin/profil`)
- **Tujuan:** Pengelolaan kredensial akun tunggal Admin Kelurahan.
- **Komponen Inti:**
  - Informasi akun Admin Kelurahan Gempolsari.
  - Formulir ganti kata sandi aman.
  - Indikator countdown sesi aktif dan tombol logout eksplisit (FR-18).

---

## 5. Keputusan Terbuka (TBD) & Status Terkini

| ID | Hal yang Dikonfirmasi | Status & Resolusi |
|---|---|---|
| **TBD-01** | Lingkup Backend | Backend dikerjakan divisi terpisah. Frontend menyiapkan mock layer & kontrak API terstandarisasi. |
| **TBD-02** | Geometri GeoJSON RT/RW | Data GeoJSON belum final. Halaman P-02 mengaktifkan **Fallback Tabel Spasial (FR-50)** secara default. |
| **TBD-03** | Skema Kolom Excel | Format kolom final menyusul. Frontend menyiapkan struktur mock modular yang mudah disesuaikan. |
| **TBD-05** | Halaman Template Bawaan | File disimpan di repositori untuk referensi komponen, namun disembunyikan dari sidebar navigasi aktif. |
| **TBD-06** | Bahasa Antarmuka | Menggunakan Bahasa Indonesia (`id`) sebagai bahasa default utama sistem. |
| **TBD-09** | Privasi Data Warga | Kepatuhan UU PDP No. 27/2022: Nama dan alamat detail warga 100% dilarang tampil di publik. |
