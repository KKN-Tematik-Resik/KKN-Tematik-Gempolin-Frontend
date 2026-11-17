# Rencana Implementasi: Restrukturisasi Navigasi Sidebar & Scaffolding Route Gempolsari (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyembunyikan seluruh halaman template TailAdmin dari navigasi aktif sidebar, menggantinya dengan struktur menu resmi Sistem Pengelolaan Sampah Kelurahan Gempolsari, dan membuat file *route scaffolding placeholder* untuk setiap halaman agar dapat diakses tanpa galat 404.

**Architecture:** Memodifikasi konfigurasi menu navigasi pada `src/layout/app-layout/sidebar/data.tsx` dan kamus terjemahan `src/messages/*.json` untuk memetakan menu Admin Internal dan Portal Publik. Setiap menu diarahkan ke rute baru di `src/app/[locale]/(admin)/admin/*` dan `src/app/[locale]/(public)/*` yang diisi oleh komponen *placeholder shell* minimalis (menggunakan `PageBreadcrumb` dan `ComponentCard`), tanpa mengisi konten data terlebih dahulu sesuai instruksi.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (Strict, Zero `any`) · next-intl v4 · Tailwind CSS v4 · `@/icons`

**Spec:**
- [docs/superpowers/specs/02-gempolsari-dashboard-spec.md](../specs/02-gempolsari-dashboard-spec.md) (Bagian 3: Peta Routing & Sidebar)
- [docs/superpowers/specs/03-code-guideline-and-best-practices.md](../specs/03-code-guideline-and-best-practices.md) (Bagian 5: Konvensi Penulisan File)
- [AGENTS.md](../../../AGENTS.md) (Bagian 3 & 4)

> 💡 **Catatan untuk Tim Pengembang:** Tautan berkas dalam dokumen rencana ini menggunakan jalur relatif (`../specs/`). Sesuaikan navigasi dengan lokasi repositori lokal tim masing-masing.

---

## Global Constraints

- **Preservasi Template Bawaan:** Dilarang menghapus file kode template lama (calendar, form-elements, basic-tables, charts); file tetap dipertahankan di repositori untuk referensi komponen, namun disembunyikan dari sidebar navigasi aktif (`TBD-05`, `AGENTS.md`).
- **Zero `any` Policy:** Dilarang menggunakan tipe `any` pada seluruh file TypeScript baru maupun yang dimodifikasi (`AGENTS.md` Bagian 4.A).
- **Project Icons Only:** Wajib mengimpor ikon dari `@/icons`; dilarang menyisipkan tag `<svg>` mentah inline (`AGENTS.md` Bagian 4.C).
- **Navigation via i18n:** Wajib mengimpor navigasi dari `@/i18n/navigation`, bukan `next/link` atau `next/navigation` (`AGENTS.md` Bagian 4.D).
- **Placeholder Only:** Konten halaman tidak boleh diisi komponen data kompleks terlebih dahulu; gunakan placeholder shell sederhana (`PageBreadcrumb` + pesan informasi singkat) sesuai arahan.

## Review Focus

1. **Active Route Highlight:** Pastikan menu aktif di sidebar menyala (*highlighted*) saat pengguna berada di URL yang bersangkutan (`/admin`, `/admin/gempolin`, dsb.).
2. **Translation Key Integrity:** Pastikan tidak ada teks label sidebar yang muncul sebagai raw key (seperti `sidebar.items.gempolin`) melainkan teks bahasa Indonesia yang rapi.
3. **No 404 on Menu Click:** Seluruh tautan menu di sidebar wajib memiliki file `page.tsx` yang valid dan me-render shell placeholder tanpa crash.
4. **Promo Widget Hidden:** Pastikan widget promosi "TailAdmin Pro / purchase plan" pada bagian bawah sidebar dihilangkan atau diganti dengan informasi versi sistem kelurahan.
5. **Lint & Typecheck Clean:** Wajib lulus `npm run lint` dan `npx tsc --noEmit` dengan 0 errors dan 0 warnings.

---

### Task 1: Inisialisasi Dependensi Workspace (Pre-requisite Setup)

**Files:**
- Modify: `package.json` (jika ada script tambahan yang diperlukan)
- Target: Direktori `node_modules`

- [ ] **Step 1: Install dependensi lokal**
  Jalankan `npm install` di workspace untuk memastikan seluruh binary tools (`eslint`, `tsc`, `next`, `@base-ui/react`, dsb.) terpasang di `node_modules`.
- [ ] **Step 2: Verifikasi instalasi**
  Jalankan `npx tsc --noEmit` dan pastikan compiler TypeScript mengenali seluruh definisi tipe di proyek.

---

### Task 2: Lokalisasi Kamus Teks Sidebar (i18n Dictionary)

**Files:**
- Modify: `src/messages/en.json`
- Create: `src/messages/id.json` (Kamus Bahasa Indonesia)
- Modify: `src/i18n/routing.ts`

- [ ] **Step 1: Tambahkan kunci terjemahan sidebar di `src/messages/en.json`**
  Tambahkan entri untuk menu kelurahan:
  ```json
  "sidebar": {
    "groups": {
      "mainMenu": "Menu Utama",
      "publicPortal": "Portal Publik"
    },
    "items": {
      "adminDashboard": "Dashboard Admin",
      "gempolin": "Rekap Gempolin",
      "demografi": "Demografi & Partisipasi",
      "bankSampah": "Bank Sampah",
      "pembaruanData": "Pembaruan Data",
      "sinkronisasi": "Status Sinkronisasi",
      "profilAdmin": "Profil & Sesi",
      "publicDashboard": "Dashboard Publik",
      "petaPartisipasi": "Peta Partisipasi"
    }
  }
  ```
- [ ] **Step 2: Buat berkas `src/messages/id.json`**
  Salin struktur dari `en.json` dan terjemahkan ke Bahasa Indonesia sebagai bahasa default utama proyek (`TBD-06`, `AGENTS.md`).
- [ ] **Step 3: Sesuaikan konfigurasi `src/i18n/routing.ts`**
  Daftarkan `"id"` dan `"en"` dengan `defaultLocale: "id"`.

---

### Task 3: Restrukturisasi Konfigurasi Menu Sidebar (`data.tsx`) & Widget Promo

**Files:**
- Modify: `src/layout/app-layout/sidebar/data.tsx`
- Modify: `src/layout/app-layout/sidebar/sidebar-widget.tsx`
- Modify: `src/layout/app-layout/sidebar/index.tsx` (jika diperlukan penyesuaian label section)

- [ ] **Step 1: Ganti daftar menu di `src/layout/app-layout/sidebar/data.tsx`**
  Ganti array `navItems`, `othersItems`, dan `supportItems`:
  - **`navItems` (Grup Menu Utama Admin):**
    1. Dashboard Internal (`path: "/admin"`, icon: `<LayoutGridIcon className="size-6" />`, key: "adminDashboard")
    2. Rekap Gempolin (`path: "/admin/gempolin"`, icon: `<TrashBinIcon className="size-6" />`, key: "gempolin")
    3. Demografi & Partisipasi (`path: "/admin/demografi"`, icon: `<PieChartIcon className="size-6" />`, key: "demografi")
    4. Bank Sampah (`path: "/admin/bank-sampah"`, icon: `<BoxIcon className="size-6" />`, key: "bankSampah")
    5. Pembaruan Data (`path: "/admin/pembaruan-data"`, icon: `<UploadIcon className="size-6" />`, key: "pembaruanData")
    6. Status Sinkronisasi (`path: "/admin/sinkronisasi"`, icon: `<TimeIcon className="size-6" />`, key: "sinkronisasi")
    7. Profil & Keamanan Admin (`path: "/admin/profil"`, icon: `<UserCircleIcon className="size-6" />`, key: "profilAdmin")
  - **`othersItems` (Grup Portal Publik):**
    1. Dashboard Publik (`path: "/"`, icon: `<GlobeIcon className="size-6" />`, key: "publicDashboard", target: "_blank")
    2. Peta Partisipasi (`path: "/peta-partisipasi"`, icon: `<MapIcon className="size-6" />`, key: "petaPartisipasi", target: "_blank")
  - **`supportItems`:** Dikosongkan (`[]`).
  *(Seluruh menu demo template lama dihilangkan dari array aktif sehingga tidak tampil di sidebar).*
- [ ] **Step 2: Bersihkan widget promosi di `sidebar-widget.tsx`**
  Hapus tautan "pricing plan" TailAdmin. Ganti dengan banner ringkas informasi sistem:
  - Teks: "Kelurahan Gempolsari"
  - Sub-teks: "Sistem Pengelolaan Sampah v1.0"
  - Atau sembunyikan rendering widget jika tidak diperlukan.

---

### Task 4: Scaffolding Halaman Placeholder Admin (`/admin/*`)

**Files:**
- Create: `src/app/[locale]/(admin)/admin/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/gempolin/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/demografi/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/bank-sampah/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/pembaruan-data/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/sinkronisasi/page.tsx`
- Create: `src/app/[locale]/(admin)/admin/profil/page.tsx`

- [ ] **Step 1: Buat placeholder `src/app/[locale]/(admin)/admin/page.tsx`**
  Buat komponen Server Component standar:
  - Judul: "Dashboard Internal Admin"
  - Breadcrumb: `PageBreadcrumb pageTitle="Dashboard Internal Admin"`
  - Card Placeholder: Pesan informasi "Modul Dashboard Internal sedang disiapkan."
- [ ] **Step 2: Buat placeholder `src/app/[locale]/(admin)/admin/gempolin/page.tsx`**
  - Judul: "Rekap Pengolahan Gempolin"
  - Breadcrumb: `PageBreadcrumb pageTitle="Rekap Pengolahan Gempolin"`
  - Card Placeholder
- [ ] **Step 3: Buat placeholder `src/app/[locale]/(admin)/admin/demografi/page.tsx`**
  - Judul: "Demografi & Partisipasi Warga"
  - Breadcrumb: `PageBreadcrumb pageTitle="Demografi & Partisipasi Warga"`
  - Card Placeholder
- [ ] **Step 4: Buat placeholder `src/app/[locale]/(admin)/admin/bank-sampah/page.tsx`**
  - Judul: "Informasi Bank Sampah"
  - Breadcrumb: `PageBreadcrumb pageTitle="Informasi Bank Sampah"`
  - Card Placeholder
- [ ] **Step 5: Buat placeholder `src/app/[locale]/(admin)/admin/pembaruan-data/page.tsx`**
  - Judul: "Pembaruan Data (Impor Excel)"
  - Breadcrumb: `PageBreadcrumb pageTitle="Pembaruan Data"`
  - Card Placeholder
- [ ] **Step 6: Buat placeholder `src/app/[locale]/(admin)/admin/sinkronisasi/page.tsx`**
  - Judul: "Status Kemutakhiran & Riwayat Sinkronisasi"
  - Breadcrumb: `PageBreadcrumb pageTitle="Status Kemutakhiran"`
  - Card Placeholder
- [ ] **Step 7: Buat placeholder `src/app/[locale]/(admin)/admin/profil/page.tsx`**
  - Judul: "Profil & Keamanan Admin"
  - Breadcrumb: `PageBreadcrumb pageTitle="Profil Admin"`
  - Card Placeholder

---

### Task 5: Scaffolding Halaman Placeholder Publik (`/peta-partisipasi`)

**Files:**
- Create: `src/app/[locale]/(admin)/peta-partisipasi/page.tsx` (atau di bawah group public)

- [ ] **Step 1: Buat placeholder `src/app/[locale]/(admin)/peta-partisipasi/page.tsx`**
  - Judul: "Peta Partisipasi Spasial"
  - Breadcrumb: `PageBreadcrumb pageTitle="Peta Partisipasi Spasial"`
  - Card Placeholder: Pesan informasi "Peta Partisipasi Spasial sedang disiapkan."

---

### Task 6: Verifikasi Kepatuhan & Build Gate (*Verification Gate*)

**Files:** Seluruh file yang dimodifikasi dan dibuat.

- [ ] **Step 1: Jalankan linter ESLint**
  Jalankan `npm run lint` dan pastikan 0 error dan 0 warning.
- [ ] **Step 2: Jalankan compiler TypeScript**
  Jalankan `npx tsc --noEmit` dan pastikan tidak ada kesalahan tipe data (`strict: true`, Zero `any`).
- [ ] **Step 3: Uji navigasi antarmuka**
  Buka aplikasi dan verifikasi:
  - Sidebar hanya menampilkan menu Gempolsari (tidak ada menu demo lama seperti Calendar, Form Elements, UI Elements).
  - Teks terjemahan tampil sempurna (bukan raw key `sidebar.items.*`).
  - Mengklik setiap menu di sidebar membuka halaman placeholder yang sesuai tanpa galat 404.
  - Widget promosi TailAdmin Pro sudah tidak muncul.
