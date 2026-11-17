# Arsitektur State & Aliran Data (State Management & URL-Driven State)

## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Versi:** 1.0  
**Status:** Disetujui  
**Stack Implementasi:** Next.js 16 (App Router) · React 19 · TypeScript · `@/i18n/navigation`  
**Referensi Terkait:**

- [01-design-system-guideline.md](./01-design-system-guideline.md)
- [02-gempolsari-dashboard-spec.md](./02-gempolsari-dashboard-spec.md)
- [03-code-guideline-and-best-practices.md](./03-code-guideline-and-best-practices.md)

> 💡 **Catatan untuk Tim Pengembang:** Tautan antar-dokumen menggunakan jalur relatif (`./`) agar selalu valid di GitHub maupun di folder clone masing-masing anggota tim.

---

## 1. Filosofi Utama: URL-First & Anti-Overengineering

Sistem ini menolak penggunaan pustaka state management eksternal yang rumit (seperti Redux, MobX, atau Zustand) karena fitur bawaan **Next.js 16 App Router** dan **React 19** sudah menyediakan fondasi yang jauh lebih tangguh, cepat, dan ringan.

Prinsip utama pengelolaan state:

1. **URL adalah Single Source of Truth untuk Seluruh Filter Data:**
   - Semua parameter filter (periode, wilayah RW/RT, indikator, objek hitung) wajib disimpan langsung di **URL Query Parameters** (`searchParams`).
   - _Manfaat Nyata:_ Warga atau admin dapat menyalin (_copy-paste_) link spesifik (misal: link capaian RW 03 bulan April) dan membagikannya ke WhatsApp tanpa kehilangan konteks filter. Tombol _Back_ dan _Forward_ browser bekerja secara alami.
2. **Derivasi Langsung Tanpa Efek Samping (_Zero Sync Effects_):**
   - Dilarang menggunakan `useEffect` untuk menyinkronkan data antar-komponen. Nilai kalkulasi persentase dan agregasi diturunkan langsung saat komponen di-render (_render-time derived state_).
3. **Pemisahan Tegas Antara State Server, State Global, dan State Transient:**
   - Data agregat persampahan adalah **Server State**.
   - Preferensi tampilan (tema gelap/terang, sesi admin) adalah **Global Client Context**.
   - Input formulir sementara dan status modal adalah **Local Transient State**.

---

## 2. Taksonomi & Klasifikasi State dalam Sistem

| Kategori State          | Lingkup (_Scope_)           | Teknologi Penyimpanan                      | Contoh di Proyek Gempolsari                                  |
| :---------------------- | :-------------------------- | :----------------------------------------- | :----------------------------------------------------------- |
| **A. URL-Driven State** | Lintas Komponen & Shareable | URL `searchParams` via `@/i18n/navigation` | Filter `periode`, `rw`, `rt`, `objek`, `indikator`, `view`   |
| **B. Server State**     | Asynchronous Data & Caching | Next.js Server Components + Data Cache     | Data Agregat Demografi, Data Gempolin, Data Bank Sampah      |
| **C. Global Context**   | App-Wide Browser State      | React Context Provider                     | `ThemeContext` (Dark/Light), `SidebarContext`, `AuthContext` |
| **D. Transient State**  | Komponen Daun Tertutup      | React `useState` / `useRef`                | File staging dropzone Excel, status buka/tutup modal dialog  |
| **E. Form State**       | Pengelolaan Input Form      | `react-hook-form` + `zod`                  | Form input Login Admin (`A-01`), Form Ganti Sandi (`A-08`)   |

---

## 3. Spesifikasi Kontrak URL Query Parameters

Semua halaman filter wajib mematuhi skema parameter URL berikut:

```
/?periode=2025-04&rw=03&rt=02&objek=rumah&aktivitas=memilah
/peta-partisipasi?indikator=rumah_memilah&kelas=1,2&view=map
/admin/gempolin?periode=2025-04&bandingkan=2025-03
/admin/demografi?periode=2025-04&rw=01&objek=kk
```

### Kamus Kunci Parameter URL (_Query Keys Dictionary_):

| Parameter Key    | Tipe Data | Nilai yang Valid                                                                                  | Nilai Default (Fallback)                 | Peruntukan Halaman        |
| :--------------- | :-------- | :------------------------------------------------------------------------------------------------ | :--------------------------------------- | :------------------------ |
| **`periode`**    | `string`  | Format `YYYY-MM` (misal: `2025-04`)                                                               | Bulan berjalan / data terkini            | P-01, A-02 s.d. A-05      |
| **`rw`**         | `string`  | `all`, `01`, `02`, `03`, `04`, `05`, `06`                                                         | `all` (Tingkat Kelurahan)                | P-01, P-02, A-02, A-04    |
| **`rt`**         | `string`  | `all`, `001`, `002`, `003`, ...                                                                   | `all` (Tingkat RW)                       | P-01, P-02, A-03, A-04    |
| **`objek`**      | `string`  | `rumah`, `kk`, `warga`                                                                            | `rumah`                                  | P-01, A-04                |
| **`aktivitas`**  | `string`  | `semua`, `memilah`, `mengolah`                                                                    | `semua`                                  | P-01                      |
| **`indikator`**  | `string`  | `rumah_memilah`, `rumah_mengolah`, `kk_memilah`, `kk_mengolah`, `warga_memilah`, `warga_mengolah` | `rumah_memilah`                          | P-02 (Peta Partisipasi)   |
| **`kelas`**      | `string`  | Comma-separated: `1,2,3,4,5`                                                                      | `1,2,3,4,5` (Semua kelas aktif)          | P-02 (Filter Kelas Peta)  |
| **`view`**       | `string`  | `map`, `table`                                                                                    | `table` (jika GeoJSON belum ada) / `map` | P-02 (Toggle Peta/Tabel)  |
| **`bandingkan`** | `string`  | Format `YYYY-MM`                                                                                  | Bulan sebelumnya                         | A-03 (Komparasi Gempolin) |

---

## 4. Pola Implementasi Hook URL-Driven State

Untuk memastikan perubahan filter berjalan mulus tanpa reload halaman penuh dan tidak memblokir input antarmuka, gunakan hook terpadu `useDashboardFilters`:

```tsx
// src/hooks/use-dashboard-filters.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "@/i18n/navigation";
import { useCallback, useTransition } from "react";

export function useDashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper untuk membaca nilai filter saat ini
  const getFilter = useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams.get(key) ?? defaultValue;
    },
    [searchParams]
  );

  // Helper untuk mengupdate satu atau beberapa parameter URL secara atomik
  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Transisi non-blocking untuk performa UI instan
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // FR-06: Tombol Reset Filter ke kondisi default agregat kelurahan
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    getFilter,
    setFilters,
    resetFilters,
    isPending,
  };
}
```

---

## 5. Arsitektur Aliran Data (Data Flow Cycle)

Aliran data bekerja dalam siklus tertutup 4 langkah:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. URL Query Params (?periode=2025-04&rw=03)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ dibaca oleh
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Server Component Page (src/app/[locale]/(public)/page.tsx)│
│    - Mengambil data paralel via Promise.all                 │
│    - Menjalankan rekapitulasi data agregat                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ diteruskan sebagai props murni
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Client Component Island (Kontainer Filter & Widget UI)   │
│    - Merender Kartu Metrik, Chart ApexCharts, & Tabel       │
│    - Menangkap aksi klik / pergantian dropdown pengguna     │
└──────────────────────────────┬──────────────────────────────┘
                               │ memicu router.push via startTransition
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Pembaruan URL Params (Siklus Kembali ke Langkah 1)       │
│    - Next.js secara cerdas me-revalidate data Server        │
│    - Tidak ada reload halaman penuh (Fast & Smooth)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Pengelolaan Global State Sesi Admin (`AuthContext`)

Sesuai aturan `FR-20` (Timeout ketidakaktifan 30 menit) dan `BR-02` (Admin Kelurahan peran tunggal):

```tsx
// src/context/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface AuthState {
  isAuthenticated: boolean;
  adminName: string;
  sessionRemainingMinutes: number;
  logout: () => void;
  renewSession: () => void;
}

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 Menit (FR-20)
const WARNING_THRESHOLD_MS = 5 * 60 * 1000;   // Peringatan di 5 menit terakhir

// State sesi memantau event aktivitas mouse & keyboard
// Jika idle > 25 menit -> tampilkan Warning Banner
// Jika idle >= 30 menit -> panggil logout() otomatis dan redirect ke /signin
```

---

## 7. Matriks Larangan Pengelolaan State (_Anti-Patterns Checklist_)

|   #   | Larangan Keras (_State Anti-Patterns_)                                    | Mengapa Berbahaya                                                        | Solusi Standar                                                                         |
| :---: | :------------------------------------------------------------------------ | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **1** | Menyalin `searchParams` ke dalam `useState` lokal                         | Memicu _state desync_ (nilai di URL dan di input menjadi tidak sinkron). | Baca langsung dari `useSearchParams()`.                                                |
| **2** | Memasang Redux / Zustand untuk filter data                                | Menambah beban ukuran bundle JS dan membuat URL tidak dapat dibagikan.   | Gunakan URL `searchParams`.                                                            |
| **3** | Menggunakan `useEffect` untuk memicu pengambilan data saat filter berubah | Memicu _waterfall lag_ di sisi klien.                                    | Biarkan Server Component yang mengambil data secara otomatis saat URL berubah.         |
| **4** | Menyimpan kata sandi atau token sensitif di `localStorage`                | Rentan terhadap serangan XSS (_Cross-Site Scripting_).                   | Simpan sesi di Cookie dengan atribut `HttpOnly; Secure; SameSite=Strict`.              |
| **5** | Menghitung persentase di dalam state lokal                                | Nilai persentase terlambat 1 siklus render dari data aslinya.            | Hitung langsung saat _render_ menggunakan fungsi murni `calculateParticipationRate()`. |
