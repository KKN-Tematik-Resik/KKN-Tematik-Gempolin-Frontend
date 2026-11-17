# Gempolin — Frontend Application

**Gempolin** adalah Sistem Informasi Pengelolaan Sampah Warga Kelurahan Gempolsari berbasis web menggunakan arsitektur modern Next.js 16 (App Router), React 19, TypeScript Strict, dan Tailwind CSS v4.

---

## Ringkasan Proyek

Aplikasi ini bertujuan untuk menyajikan transparansi data pengelolaan sampah bagi warga (Portal Publik) serta menyediakan sarana pemantauan operasional internal bagi Admin Kelurahan (Dashboard Internal).

### Batasan Sistem & Aturan Mutlak (_The Unbreakable Laws_)

1. **Strict Privasi Warga (`BR-01`, `FR-11`):** Dilarang menampilkan nama warga, nomor rumah, atau alamat detail hunian di seluruh antarmuka publik. Data publik murni agregat tingkat RT/RW/Kelurahan.
2. **Satu Peran Pengguna Internal (`BR-02`):** Peran internal tunggal hanya **Admin Kelurahan**. Akses admin murni via URL `/signin` (tanpa tombol login publik di navigasi warga, dan tidak ada registrasi publik).
3. **Sifat Sistem Read-Only:** Tidak melayani penugasan armada sampah (`FR-28`), transaksi operasional Gempolin (`FR-14`), maupun transaksi saldo nasabah bank sampah (`FR-56`).

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Bahasa:** TypeScript (`strict: true`, Zero `any` policy)
- **Styling:** Tailwind CSS v4 (Palet Pine Green & Tailwind Design Tokens)
- **Komponen UI:** Base UI (`@base-ui/react`), CVA
- **Ikon:** Project Icons di `@/icons` (Dilarang inline `<svg>`)
- **Visualisasi & Peta:** ApexCharts (Dynamic Import), MapLibre GL
- **Internasionalisasi:** next-intl v4 (`id` default)

---

## Dokumen Panduan Tim (_Documentation_)

Seluruh spesifikasi resmi yang **wajib dipedomani** oleh anggota tim pengembang:

| Dokumen                              | Lokasi                                                                                                                               | Cakupan Utama                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Panduan Arsitektur & Aturan Agen** | [`AGENTS.md`](./AGENTS.md)                                                                                                           | Aturan mutlak sistem, pre-task checklist, konvensi kode, no-build rule       |
| **Design System Guideline**          | [`docs/superpowers/specs/01-design-system-guideline.md`](./docs/superpowers/specs/01-design-system-guideline.md)                     | Palet warna Pine Green, Light/Dark mode, 8-pt grid, palet peta 5-kelas       |
| **Spesifikasi Fungsional**           | [`docs/superpowers/specs/02-gempolsari-dashboard-spec.md`](./docs/superpowers/specs/02-gempolsari-dashboard-spec.md)                 | Alur 10 Halaman (P-01 s.d. P-02, A-01 s.d. A-08) & aturan bisnis persampahan |
| **Code Guideline & Best Practices**  | [`docs/superpowers/specs/03-code-guideline-and-best-practices.md`](./docs/superpowers/specs/03-code-guideline-and-best-practices.md) | Clean code, Vercel React Best Practices, Zero `any`, 10 anti-patterns        |
| **State & URL Flow**                 | [`docs/superpowers/specs/04-frontend-state-and-url-flow.md`](./docs/superpowers/specs/04-frontend-state-and-url-flow.md)             | State management, URL search params, filtering                               |
| **UI Component Inventory**           | [`docs/superpowers/specs/05-ui-component-inventory.md`](./docs/superpowers/specs/05-ui-component-inventory.md)                       | Inventaris komponen yang dapat digunakan kembali                             |

---

## Struktur Rute Aplikasi (_Pure Kebab-Case Architecture_)

Struktur folder menggunakan pemetaan langsung 1-to-1 dengan URL (tanpa tanda kurung `(...)`):

```text
src/app/
├── admin/                         ← Zona Internal Admin (Admin Layout + Shell)
│   ├── layout.tsx                 ← Server Component (membungkus AdminShell)
│   ├── page.tsx                   → /admin             (Dashboard Internal)
│   ├── gempolin/page.tsx          → /admin/gempolin    (Rekap Gempolin)
│   ├── demografi/page.tsx         → /admin/demografi   (Demografi & Partisipasi)
│   ├── bank-sampah/page.tsx       → /admin/bank-sampah (Informasi Bank Sampah)
│   ├── pembaruan-data/page.tsx    → /admin/pembaruan-data (Impor Data Excel)
│   ├── sinkronisasi/page.tsx      → /admin/sinkronisasi (Log Sinkronisasi)
│   └── profil/page.tsx            → /admin/profil      (Profil & Keamanan Admin)
├── peta-partisipasi/
│   └── page.tsx                   → /peta-partisipasi  (Peta Partisipasi Spasial)
├── signin/                        ← Zona Autentikasi Admin
│   ├── layout.tsx                 ← Auth Shell minimalis
│   └── page.tsx                   → /signin            (Login Admin Kelurahan)
├── layout.tsx                     ← Root Layout Aplikasi
├── not-found.tsx                  ← Halaman 404
└── page.tsx                       → /                  (Dashboard Publik)
```

---

## Memulai Pengembangan (_Quickstart_)

### 1. Prasyarat

- Node.js versi 20+ (disarankan Node.js 22 LTS)
- npm versi 10+

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka browser di `http://localhost:3000`.

### 4. Gerbang Verifikasi Koding (_Wajib Sebelum Push/PR_)

Setiap perubahan kode **wajib** lulus dua pengujian berikut:

```bash
# 1. Typecheck TypeScript (Zero any)
npx tsc --noEmit

# 2. Linter ESLint (Termasuk custom rule larangan "use client" di layout/page)
npm run lint
```

> **⚠️ Catatan Penting (_No Build Rule_):**
> Jangan menjalankan `npm run build` secara berulang selama alur kerja lokal biasa karena memakan resource dan waktu. Cukup verifikasi integritas kode menggunakan `npm run lint` dan `npx tsc --noEmit`.

---

## 🤝 Panduan Kolaborasi Tim (_Team Workflow_)

1. **Branching Model:**
   - `main`: Branch stabil yang siap rilis/deploy.
   - `feat/<nama-fitur>`: Branch untuk penambahan fitur baru (misal: `feat/demografi-cards`).
   - `fix/<nama-bug>`: Branch untuk perbaikan bug.
2. **Standar Komit:** Gunakan pesan komit deskriptif (format conventional commits disarankan: `feat: ...`, `fix: ...`, `refactor: ...`).
3. **Pemberitahuan Import:**
   - Navigasi (`Link`, `useRouter`, `usePathname`) **wajib** diimpor dari `@/i18n/navigation`, bukan `next/navigation`.
   - Ikon **wajib** diimpor dari `@/icons`.
   - Dilarang menambahkan `"use client"` di `layout.tsx` atau `page.tsx`. Logika interaktif diletakkan pada komponen daun.

---

&copy; 2026 Tim KKN Tematik Kelurahan Gempolsari.
