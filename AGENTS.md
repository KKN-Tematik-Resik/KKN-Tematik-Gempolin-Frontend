# AGENTS.md — Gempolin: Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

Panduan operasional, arsitektur teknis, dan standar rekayasa perangkat lunak untuk AI Agent dan pengembang (*Senior Developer Standard*).

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (Strict, Zero `any`) · Tailwind CSS v4 · next-intl v4 (`id` default) · Base UI · react-hook-form + zod · TanStack Table · ApexCharts · MapLibre GL

---

## 1. Aturan Mutlak & Batasan Sistem (*The Unbreakable Laws*)

Setiap agen yang bekerja di repositori ini **WAJIB** mematuhi batasan sistem berikut tanpa kompromi:

1. **Strict Privasi Warga (`BR-01`, `FR-11`):**
   - **DILARANG KERAS** menampilkan nama warga, nomor rumah, atau alamat detail hunian di seluruh antarmuka publik, tabel agregat, maupun pop-up peta. Data publik murni agregat tingkat RT/RW/Kelurahan.
2. **Satu Peran Pengguna Internal (`BR-02`):**
   - Peran pengguna internal tunggal hanya **Admin Kelurahan**. **DILARANG** membuat/mengaktifkan form pendaftaran (*sign-up*) publik.
3. **Sifat Sistem Hanya Integrasi & Penyajian Data (*Read-Only*):**
   - ❌ **DILARANG** membuat fitur pengajuan, persetujuan, atau penugasan armada pengangkutan sampah (`FR-28`).
   - ❌ **DILARANG** membuat fitur ubah/hapus/tambah transaksi operasional Gempolin (`FR-14`).
   - ❌ **DILARANG** membuat fitur transaksi keuangan, setor/tarik tunai, atau kelola saldo nasabah bank sampah (`FR-56`, `BR-09`).
   - ❌ **DILARANG** membuat kontrol/perintah ke perangkat keras atau sensor IoT timbangan (`FR-54`).
4. **Pemisahan Makna Data (`BR-03`, `BR-04`):**
   - Berat terverifikasi Gempolin berbeda makna dari partisipasi mandiri warga; data partisipasi tidak boleh dikonversi menjadi tonase tanpa aturan sah.
   - Rekap Gempolin dihitung berdasarkan tanggal diolah dengan zona waktu **WIB**.

---

## 2. Dokumen Spesifikasi Resmi (*Source of Truth*)

> 💡 **Catatan untuk Tim Pengembang:** Seluruh tautan berkas menggunakan jalur relatif repositori agar kompatibel di semua mesin pengembang dan antarmuka GitHub. Sesuaikan navigasi dengan lokasi repositori lokal masing-masing anggota tim.

Sebelum membuat atau mengubah kode, pengembang dan AI agent wajib merujuk ke 3 dokumen spesifikasi di `docs/superpowers/specs/`:

1. 🎨 **[01-design-system-guideline.md](./docs/superpowers/specs/01-design-system-guideline.md):**
   - Matriks warna Light vs Dark Mode, palet Brand Pine Green (`brand-50` s.d. `brand-950`).
   - Palet peta 5-kelas ramah buta warna (`BR-08`, `NFR-23`).
   - Standar jarak 8-point grid, Gestalt proximity, Fitts's law, dan equal edges.
2. 📐 **[02-gempolsari-dashboard-spec.md](./docs/superpowers/specs/02-gempolsari-dashboard-spec.md):**
   - Alur fungsional 10 Halaman (P-01 s.d. P-02, A-01 s.d. A-08).
   - Alur impor data atomik Excel (.xlsx) dan resolusi keputusan TBD.
3. 💻 **[03-code-guideline-and-best-practices.md](./docs/superpowers/specs/03-code-guideline-and-best-practices.md):**
   - Standar Clean Code, filosofi Ponytail (Anti-Overengineering), Zero `any` policy, dan Vercel React Best Practices.

---

## 3. Peta Routing & Standar Struktur Folder (Pure Kebab-Case Architecture)

Penamaan seluruh folder di proyek menggunakan format **pure kebab-case** (seperti `recent-order`, `peta-partisipasi`, `bank-sampah`) **TANPA tanda kurung `(...)`**:

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
├── signin/                        ← Zona Autentikasi
│   ├── layout.tsx                 ← Auth Shell minimalis (Layar Penuh, Card Tengah)
│   └── page.tsx                   → /signin            (A-01: Login Admin Kelurahan)
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

### Standar Rekayasa Struktur Folder (*Senior Engineering Rules*):
1. **Dilarang Tanda Kurung (*No Parentheses Routing*):**
   - **DILARANG KERAS** menggunakan tanda kurung `(...)` pada nama folder di seluruh direktori proyek.
   - Semua penamaan folder wajib menggunakan **kebab-case** huruf kecil dipisah tanda hubung (contoh: `recent-order`, `bank-sampah`, `pembaruan-data`).
   - Hubungan folder dan URL adalah **1-to-1 direct mapping**: folder `admin` menjadi URL `/admin`, folder `signin` menjadi URL `/signin`.
2. **Layout Spesifik per Direktori:**
   - Folder `admin/` memiliki `layout.tsx` sendiri untuk membungkus seluruh halaman internal dengan sidebar.
   - Folder `signin/` memiliki `layout.tsx` sendiri untuk membungkus kartu login.
   - Halaman root `/` dan `/peta-partisipasi` langsung menggunakan root layout tanpa terkena sidebar admin.
3. **Penyimpanan Arsip Demo Template di Luar `src/app/`:**
   - Seluruh halaman demo template bawaan TailAdmin diparkir di `src/legacy-demo/` (di luar `src/app/`) agar Next.js tidak menjadikannya rute aplikasi dan hierarki routing 100% bersih.

---

## 4. Standar Rekayasa Kode (React 19, TypeScript, Tailwind v4)

### A. Kebijakan Bebas `any` (*Zero `any` Policy*)
- `strict: true` aktif. **DILARANG KERAS** menggunakan `any`.
- Gunakan `interface Props` eksplisit untuk setiap komponen.
- Gunakan `unknown` + validasi `zod` schema untuk data eksternal/impor Excel.
- Gunakan `Record<string, unknown>` untuk objek dinamis.
- Gunakan `React.ReactNode` untuk children dan generics `<T>` untuk fungsi utilitas.

### B. Performa & Pola Komponen Vercel
1. **Server Component Default:** Biarkan `page.tsx` sebagai Server Component. Tempatkan `"use client"` hanya pada komponen daun terkecil (*leaf nodes*) yang membutuhkan state/event listener.
2. **Dilarang Komponen Bersarang (*No Nested Components*):** Jangan pernah menulis `function SubComponent() { ... }` di dalam tubuh komponen lain. Pisahkan ke file saudara.
3. **Dynamic Import untuk Pustaka Berat:**
   - ApexCharts: `const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })`
   - MapLibre GL / VectorMap: Wajib dynamic import + skeleton fallback.
4. **Derived State Langsung saat Render:** Jangan gunakan `useEffect` untuk menghitung nilai yang bisa diturunkan langsung dari props/state.
5. **Hilangkan Waterfalls:** Gunakan `Promise.all([fetchA(), fetchB()])` untuk pengambilan data independen secara paralel.
6. **Key Stabil:** Dilarang menggunakan `key={index}` pada daftar dinamis. Gunakan ID unik (`kodeRt`, `id`).
7. **Render Kondisional:** Hindari `count && <Component />` pada angka numerik; gunakan ternary `count > 0 ? <Component /> : null`.
8. **Angka Tabular:** Wajib menambahkan class `tabular-nums` pada seluruh angka KPI, berat kg, persentase, dan kolom tabel.

### C. Ikon & Aset Grafis (*Project Icon Rules*)
- **DILARANG KERAS** menyisipkan tag `<svg>` mentah inline di dalam komponen antarmuka.
- Wajib menggunakan pustaka ikon proyek di `@/icons` (contoh: `import { TrashBinIcon, FilterIcon, UploadIcon } from "@/icons"`).

### D. Navigasi & Lokalisasi (`next-intl`)
- **DILARANG** mengimpor `Link`, `useRouter`, atau `usePathname` dari `next/link` atau `next/navigation`.
- **Wajib mengimpor dari `@/i18n/navigation`** (`import { Link, useRouter, usePathname } from "@/i18n/navigation"`) agar parameter bahasa dan prefix URL tidak rusak.
- Kamus teks antarmuka dipusatkan di `src/messages/` (`en.json`, `id.json`).

### E. Konvensi Berkas & Styling Tailwind v4
- **Nama file & folder:** Format **kebab-case** (`metric-card.tsx`, `use-inactivity.ts`). Ekspor komponen dengan `export default function`.
- **One Widget, One Folder:** `index.tsx` mengorkestrasi sub-komponen di folder yang sama (`types.ts`, `data.ts`, `header.tsx`).
- **Styling Tailwind v4:**
  - Hanya gunakan design tokens (dilarang nilai hex/px manual di className seperti `w-[230px]` atau `bg-[#059669]`).
  - Gunakan logical properties: `ms/me`, `ps/pe`, `start/end` (bukan `ml/mr`, `pl/pr`, `left/right`).
  - Setiap warna wajib memiliki pasangan mode gelap `dark:`.
  - Gabungkan class menggunakan helper `cn(...)` dari `@/utils`.

---

## 5. Implementasi Rumus Bisnis Persampahan

1. **Rumus Persentase Partisipasi (`BR-05`):**
   $$\text{Persentase} = \left(\frac{\text{Jumlah yang Memenuhi}}{\text{Jumlah Terdata}}\right) \times 100\%$$
2. **Agregasi Wilayah Bertingkat (`BR-06`):**
   - Agregasi RW/Kelurahan dihitung dari: $\frac{\sum \text{pembilang seluruh RT}}{\sum \text{penyebut seluruh RT}} \times 100\%$
   - **DILARANG** merata-ratakan persentase antar-RT!
3. **Penyebut Nol / Data Kosong (`BR-07`):**
   - Jika penyebut $\le 0$, hasilkan nilai `null` dan tampilkan badge: **"Data tidak tersedia"** (Bukan `0%`).
   - Angka nol nyata (0 kg sampah) tetap ditampilkan **`0 kg`**.

---

## 6. Protokol Kerja Agen (*Senior Surgical Engineering*)

Diadaptasi dari *Karpathy Guidelines* dan prinsip *Ponytail (Senior Pragmatic)*:

1. **Berpikir Sebelum Menulis (*Think Before Coding*):**
   - Paparkan asumsi secara eksplisit. Jika ada keraguan mengenai aturan bisnis, konfirmasi terlebih dahulu.
   - Pilih solusi paling sederhana yang menyelesaikan masalah secara tuntas (*YAGNI*).
2. **Perubahan Bedah (*Surgical Changes*):**
   - Hanya sentuh file dan baris kode yang relevan dengan tugas.
   - **DILARANG** melakukan *drive-by refactoring* (jangan merapikan spasi, mengubah gaya penulisan, atau memformat file lain di luar cakupan tugas).
   - Bersihkan hanya *orphan imports/variables* yang dihasilkan oleh perubahan Anda sendiri.
3. **Gerbang Verifikasi Mandiri (*Evidence Before Assertion*):**
   - Agen **TIDAK BOLEH** menyatakan tugas selesai atau berhasil sebelum menjalankan perintah verifikasi dan membuktikan output bebas galat:
     - `npm run lint` (`eslint .`) — wajib lulus tanpa warning/error.
     - `npx tsc --noEmit` — wajib nol kesalahan tipe TypeScript.
4. **Larangan Build Otomatis (*No Build Rule*):**
   - **DILARANG KERAS** menjalankan `npm run build` atau `next build` secara otomatis dalam alur kerja reguler atau sebagai gerbang verifikasi rutin (karena memakan waktu dan resource tinggi).
   - Verifikasi fungsional dan integritas kode cukup dibuktikan melalui `npm run lint` dan `npx tsc --noEmit`. Perintah build **HANYA** boleh dijalankan jika pengguna memberikan instruksi eksplisit untuk mem-build.
5. **Pre-Task Checklist Wajib — Jawab SEBELUM Menulis Satu Baris Kode:**

   > **⚠️ Checklist ini WAJIB dijalankan sebelum menulis kode apapun.** ESLint custom rule di `eslint.config.mjs` akan menangkap pelanggaran #1 secara otomatis, tapi checklist ini mencegah masalah sebelum kode ditulis.

   | # | Pertanyaan | Jika Ya → Tindakan |
   |:---:|:---|:---|
   | **1** | Apakah file yang saya tulis adalah `layout.tsx` atau `page.tsx`? | **DILARANG** menambahkan `"use client"`. Pindahkan logika interaktif ke komponen daun (`admin-shell.tsx`, `form.tsx`, dll.) yang diimpor di sini. |
   | **2** | Apakah saya mengimpor library besar (ApexCharts, MapLibre, flatpickr, swiper, simplebar) secara static? | Wajib gunakan `dynamic(() => import(...), { ssr: false })` + skeleton loader. |
   | **3** | Apakah CSS library (`.css`) saya impor di `src/app/layout.tsx`? | Pindahkan ke komponen yang benar-benar memakainya, bukan root layout. |
   | **4** | Apakah komponen atau file yang saya buat berada di dalam `src/components/`? | Pastikan hanya komponen aktif proyek ini. Komponen template demo/legacy wajib diletakkan di `src/legacy-demo/`. |
   | **5** | Apakah saya mendefinisikan sub-komponen (`function Child()`) di dalam tubuh komponen lain? | Pisahkan ke file saudara terpisah. Komponen dalam komponen menyebabkan unmount/remount setiap render. |
   | **6** | Apakah saya menggunakan `any` di TypeScript? | Ganti dengan `interface`, `unknown + zod`, `Record<string, unknown>`, atau generic `<T>`. |

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
