# Rencana Implementasi: Layout Top Navbar Publik & Isolasi Sidebar Admin (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun layout `PublicHeader` (Top Navbar horizontal) khusus halaman publik (`/` dan `/peta-partisipasi`) tanpa tombol login admin dan tanpa sidebar, serta mengisolasi sidebar admin (`/admin/*`) agar murni hanya menampilkan 7 menu internal admin kelurahan (menghapus grup portal publik).

**Architecture:** Memisahkan layout antarmuka secara tegas: Halaman publik (`/` dan `/peta-partisipasi`) menggunakan `PublicLayout` yang membentang horizontal penuh dengan `PublicHeader` di atas (logo, navigasi horizontal, theme toggler, tombol bantuan rumus, tanpa link login admin). Sedangkan seluruh halaman internal admin (`/admin/*`) tetap menggunakan `AdminLayout` dengan `AppSidebar` bawaan template yang telah dibersihkan dari seluruh tautan menu publik.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (Strict, Zero `any`) · Tailwind CSS v4 · `@/icons` · `@/i18n/navigation`

**Spec:**
- [docs/superpowers/specs/01-design-system-guideline.md](../specs/01-design-system-guideline.md)
- [docs/superpowers/specs/02-gempolsari-dashboard-spec.md](../specs/02-gempolsari-dashboard-spec.md) (Bagian 3 & 4.A)
- [AGENTS.md](../../../AGENTS.md) (Bagian 1, 3, dan 6)

> 💡 **Catatan untuk Tim Pengembang:** Tautan berkas dalam dokumen rencana ini menggunakan jalur relatif (`../specs/`). Sesuaikan navigasi dengan lokasi repositori lokal tim masing-masing.

---

## Global Constraints

- **Security by Obscurity (`BR-02`):** Dilarang keras menampilkan tombol, tautan, atau indikator "Login Admin" / "Sign In" pada seluruh antarmuka publik (`PublicHeader`). Akses admin murni via URL `/signin`.
- **Pure Kebab-Case (No Parentheses):** Dilarang membuat folder bertanda kurung `(...)` di seluruh proyek (`AGENTS.md` Bagian 3).
- **Zero `any` Policy:** Dilarang menggunakan tipe `any` pada seluruh kode TypeScript (`AGENTS.md` Bagian 4.A).
- **Project Icons Only:** Wajib mengimpor ikon dari `@/icons`; dilarang menyisipkan tag `<svg>` inline mentah (`AGENTS.md` Bagian 4.C).
- **Navigation via i18n:** Wajib mengimpor navigasi (`Link`, `usePathname`) dari `@/i18n/navigation` (`AGENTS.md` Bagian 4.D).
- **Larangan Build Otomatis (*No Build Rule*):** Dilarang menjalankan `npm run build` atau `next build`. Verifikasi cukup menggunakan `npm run lint` dan `npx tsc --noEmit` (`AGENTS.md` Bagian 6.4).

---

## Review Focus

1. **Public Navbar Cleanliness:** Pastikan `PublicHeader` tidak memuat tombol "Login Admin" atau tautan ke `/signin`.
2. **Active State Navigasi Publik:** Tautan aktif di navbar publik (misal sedang di `/` atau `/peta-partisipasi`) memiliki highlight visual yang jelas dan kontras.
3. **Admin Sidebar Isolation:** Pastikan saat membuka `/admin`, sidebar kiri hanya menampilkan 7 menu internal kelurahan (tidak ada lagi grup "Portal Publik").
4. **Layout Full Width Publik:** Pastikan halaman publik tidak memiliki sidebar kiri dan membentang rapi memenuhi lebar kontainer (maksimal `max-w-7xl`).
5. **Lint & Typecheck Green:** Lulus verifikasi `npm run lint` dan `npx tsc --noEmit` dengan 0 errors dan 0 warnings.

---

### Task 1: Isolasi Menu Sidebar Admin (Pembersihan Menu Publik)

**Files:**
- Modify: `src/layout/app-layout/sidebar/data.tsx`
- Modify: `src/layout/app-layout/sidebar/index.tsx`

**Interfaces:**
- Produces: `othersItems = []` dan `menuSections` murni fokus ke grup `mainMenu`.

- [x] **Step 1: Kosongkan array `othersItems` di `src/layout/app-layout/sidebar/data.tsx`**
  Hapus entri `publicDashboard` dan `petaPartisipasi` dari `othersItems` sehingga menjadi:
  ```typescript
  export const othersItems: NavItem[] = [];
  ```
  Bersihkan unused imports (`GlobeIcon`, `MapIcon`) dari berkas ini.
- [x] **Step 2: Sesuaikan `src/layout/app-layout/sidebar/index.tsx`**
  Pastikan `menuSections` hanya memproses grup yang memiliki item aktif (`navItems`).
- [x] **Step 3: Verifikasi TypeScript**
  Jalankan `npx tsc --noEmit` dan pastikan 0 error.

---

### Task 2: Pembuatan Komponen Layout Publik (`PublicHeader` & `PublicLayout`)

**Files:**
- Create: `src/layout/public-layout/header.tsx`
- Create: `src/layout/public-layout/index.tsx`

**Interfaces:**
- Produces: `export default function PublicLayout({ children }: { children: React.ReactNode })`
- Consumes: `ThemeToggler` dari `@/components/common/theme-toggler`, `Link` dan `usePathname` dari `@/i18n/navigation`.

- [x] **Step 1: Buat komponen `src/layout/public-layout/header.tsx`**
  Komponen header horizontal modern:
  - Sisi Kiri: Logo Kelurahan Gempolsari (menggunakan teks/elemen branding resmi "SIP Sampah Kelurahan Gempolsari").
  - Sisi Tengah: Navigasi horizontal:
    - `Link` ke `/` ("Dashboard")
    - `Link` ke `/peta-partisipasi` ("Peta Partisipasi")
    - Highlight kelas aktif menggunakan `usePathname()`: teks aktif `text-brand-600 dark:text-brand-400 font-semibold`, teks inaktif `text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`.
  - Sisi Kanan: `<ThemeToggler />` dan tombol Bantuan Istilah/Rumus.
  - STRICT: Tidak menyertakan tombol / tautan login admin.
- [x] **Step 2: Buat komponen `src/layout/public-layout/index.tsx`**
  Komponen pembungkus halaman publik:
  - Menyematkan `<PublicHeader />` di bagian atas.
  - Menyediakan `<main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">` untuk me-render `{children}`.
- [x] **Step 3: Verifikasi TypeScript**
  Jalankan `npx tsc --noEmit` dan pastikan 0 error.

---

### Task 3: Penerapan `PublicLayout` pada Halaman Publik

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/peta-partisipasi/page.tsx`

**Interfaces:**
- Consumes: `PublicLayout` dari `@/layout/public-layout`.

- [x] **Step 1: Bungkus `src/app/page.tsx` dengan `PublicLayout`**
  Ganti kontainer polos dengan `<PublicLayout>`:
  - Halaman `/` kini otomatis memiliki `PublicHeader` di atas dan area konten di tengah.
  - Menampilkan breadcrumb "Dashboard Publik" dan card placeholder informasi.
- [x] **Step 2: Bungkus `src/app/peta-partisipasi/page.tsx` dengan `PublicLayout`**
  Ganti kontainer polos dengan `<PublicLayout>`:
  - Halaman `/peta-partisipasi` kini memiliki `PublicHeader` di atas dengan active highlight pada menu "Peta Partisipasi".
  - Menampilkan breadcrumb "Peta Partisipasi Spasial" dan card placeholder informasi.
- [x] **Step 3: Verifikasi TypeScript**
  Jalankan `npx tsc --noEmit` dan pastikan 0 error.

---

### Task 4: Verifikasi Kepatuhan & Build Gate (*Verification Gate*)

**Files:** Seluruh berkas yang dimodifikasi.

- [x] **Step 1: Jalankan linter ESLint**
  Jalankan `npm run lint` dan pastikan **0 error dan 0 warning**.
- [x] **Step 2: Jalankan compiler TypeScript**
  Jalankan `npx tsc --noEmit` dan pastikan **0 error** (Strict Zero `any`).
- [x] **Step 3: Verifikasi Fungsional Peramban**
  Pastikan:
  - Mengakses `http://localhost:3000/`: Menampilkan Top Navbar publik (Dashboard, Peta Partisipasi, Switcher Mode) tanpa sidebar dan tanpa link login admin.
  - Mengakses `http://localhost:3000/peta-partisipasi`: Menampilkan Top Navbar publik dengan menu "Peta Partisipasi" yang aktif menyala.
  - Mengakses `http://localhost:3000/admin`: Menampilkan Sidebar Admin lengkap dengan 7 menu internal (tanpa menu portal publik).
