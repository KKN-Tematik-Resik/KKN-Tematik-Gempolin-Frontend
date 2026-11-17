# Panduan Penulisan Kode & Praktik Terbaik (Clean Code & React Best Practices)

## Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

**Versi:** 1.0  
**Status:** Disetujui  
**Stack Implementasi:** Next.js 16 (App Router) · React 19 · TypeScript (Strict) · Tailwind CSS v4  
**Referensi Terkait:**

- [01-design-system-guideline.md](./01-design-system-guideline.md) (Desain Visual)
- [02-gempolsari-dashboard-spec.md](./02-gempolsari-dashboard-spec.md) (Spesifikasi Fungsional)

> 💡 **Catatan untuk Tim Pengembang:** Tautan antar-dokumen menggunakan jalur relatif (`./`) agar selalu valid di GitHub maupun di folder clone masing-masing anggota tim. Import kode menggunakan path alias `@/*`.

---

## 1. Filosofi Utama: Anti-Overengineering (_The Pragmatic Senior Standard_)

Kode terbaik adalah kode paling sederhana yang menyelesaikan masalah secara tuntas tanpa lapisan kerumitan yang tidak diminta (_YAGNI - You Aren't Gonna Need It_).

1. **Gunakan yang Sudah Ada (_Reuse Existing Primitives_):**
   - Utamakan komponen yang sudah ada di `@/components/ui/*` (`Button`, `Card`, `Badge`, `Table`, `Dialog`, `Select`). Jangan membuat komponen primitif baru jika varian atau komposisi yang ada sudah mencukupi.
   - Gunakan pustaka utilitas bawaan (`cn` dari `@/utils`). Dilarang menambahkan pustaka helper baru (misal: lodash, moment) untuk hal-hal yang bisa diselesaikan dengan TypeScript/JavaScript native.
2. **Hindari Abstraksi Dini (_No Premature Abstraction_):**
   - Jangan membuat generic abstraction, custom hook wrapper berlapis-lapis, atau factory pattern jika kodenya hanya dipakai di satu tempat.
   - Buat fungsi pembantu (_helper_) hanya jika logika tersebut benar-benar dipakai ulang di 2 tempat atau lebih.
3. **Satu Widget, Satu Tanggung Jawab (_One Widget, One Folder_):**
   - File utama `index.tsx` berfungsi sebagai kontainer (_state & data orchestration_).
   - Bagian-bagian sub-komponen dipecah ke file saudara di folder yang sama (`card-header.tsx`, `metrics-row.tsx`) dengan sifat murni presentasional.

---

## 2. Pola Penulisan React 19 & Next.js 16 (App Router)

Sesuai panduan teknis rekayasa performa Vercel (_Vercel React Best Practices_):

### A. Server Components vs. Client Components

- **Default adalah Server Component:** Halaman (`page.tsx`) dan tata letak (`layout.tsx`) secara default adalah Server Component untuk mengurangi bundle JavaScript ke browser.
- **Hanya Gunakan `"use client"` Jika Diperlukan:**
  Tambahkan direktif `"use client"` di baris paling atas hanya jika komponen tersebut menggunakan:
  - React State atau Lifecycle (`useState`, `useReducer`, `useEffect`)
  - Event Handlers (`onClick`, `onChange`, `onSubmit`)
  - Hook Navigasi Interaktif (`useRouter`, `useSearchParams`, `usePathname`)
  - Browser APIs atau integrasi pustaka khusus klien (ApexCharts, MapLibre GL)

### B. Dynamic Import untuk Komponen Berat

Komponen yang memuat pustaka grafik (_ApexCharts_) atau peta wajib diimpor secara dinamis untuk mencegah error SSR dan menjaga ukuran bundle awal tetap ramping:

```tsx
// ✅ BENAR: Dynamic import untuk ApexCharts tanpa SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
});

// ❌ SALAH: Static import langsung di client component
import ReactApexChart from "react-apexcharts";
```

### C. State Lokal: Hitung Langsung Saat Render (_Derived State_)

Jangan menyalin props ke dalam state, dan jangan gunakan `useEffect` untuk menghitung nilai yang bisa dihitung langsung saat proses render:

```tsx
// ✅ BENAR: Derived state dihitung langsung saat render
export default function ParticipationCard({ numerator, denominator }: Props) {
  const percentage = denominator > 0 ? (numerator / denominator) * 100 : null;
  const isAvailable = percentage !== null;

  return (
    <div>
      {isAvailable ? `${percentage.toFixed(1)}%` : "Data tidak tersedia"}
    </div>
  );
}

// ❌ SALAH: Menggunakan useEffect untuk memperbarui state turunan
export default function BadCard({ numerator, denominator }: Props) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setPercent((numerator / denominator) * 100); // ❌ Overkill, trigger re-render ganda
  }, [numerator, denominator]);
  ...
}
```

### D. Render Kondisional Aman (_Safe Conditional Rendering_)

Hindari operator `&&` saat mengevaluasi angka numerik, karena angka `0` akan ter-render sebagai teks "0" di layar:

```tsx
// ✅ BENAR: Gunakan ternary eksplisit
{items.length > 0 ? <ItemList items={items} /> : null}

// ❌ SALAH: Angka 0 akan muncul di UI jika items.length === 0
{items.length && <ItemList items={items} />}
```

---

## 3. Konsumsi API & Pengambilan Data (Data Fetching & Lifecycle)

### A. Struktur API Client Sederhana

Tidak perlu membuat wrapper Axios atau Redux rumit. Gunakan `fetch` standar yang dibungkus fungsi async ber-tipe data TypeScript yang ketat:

```tsx
// src/services/api/gempolin.ts
export async function getGempolinSummary(params: { periode?: string; wilayah?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`/api/public/gempolin?${query}`, {
    next: { revalidate: 300 } // Cache 5 menit di level Next.js
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat data Gempolin: ${res.statusText}`);
  }

  return res.json() as Promise<GempolinSummaryResponse>;
}
```

### B. Menghilangkan Render Waterfall (_Eliminating Waterfalls_)

Jika sebuah halaman membutuhkan beberapa data yang saling independen (misal: Demografi, Rekap Gempolin, dan Bank Sampah), ambil seluruh data secara paralel menggunakan `Promise.all`:

```tsx
// ✅ BENAR: Pengambilan data paralel (waktu tunggu = max(A, B, C))
const [demografi, gempolin, bankSampah] = await Promise.all([
  getDemografiSummary(filters),
  getGempolinSummary(filters),
  getBankSampahSummary(filters)
]);

// ❌ SALAH: Waterfall berurutan (waktu tunggu = A + B + C)
const demografi = await getDemografiSummary(filters);
const gempolin = await getGempolinSummary(filters);
const bankSampah = await getBankSampahSummary(filters);
```

### C. Penanganan Tiga State Wajib (_Complete UI States_)

Setiap komponen yang menampilkan data asynchronous wajib memiliki penanganan 3 kondisi:

1. **Loading State:** Menggunakan skeleton dengan dimensi identik dengan hasil akhir (cegah _Cumulative Layout Shift_).
2. **Empty State:** Pesan ramah dan informatif bila filter menghasilkan data kosong (bukan tampilan kosong/rusak).
3. **Error State:** Banner notifikasi ramah pengguna dengan tombol "Coba Lagi", tanpa memaparkan pesan error teknis ke publik (NFR-22).

---

## 4. Implementasi Aturan Bisnis & Format Data Persampahan

### A. Kalkulasi Persentase & Agregasi Bertingkat (`BR-05`, `BR-06`, `BR-07`)

Pusatkan rumus matematika ke satu file helper sederhana (`src/utils/calculations.ts`):

```tsx
// src/utils/calculations.ts

/**
 * BR-05 & BR-07: Rumus Persentase Partisipasi
 * Mengembalikan null jika penyebut nol atau data tidak tersedia
 */
export function calculateParticipationRate(numerator: number, denominator: number): number | null {
  if (denominator <= 0 || isNaN(denominator) || isNaN(numerator)) {
    return null; // Menghasilkan "Data tidak tersedia", bukan 0%
  }
  return (numerator / denominator) * 100;
}

/**
 * BR-06: Agregasi Tingkat RW / Kelurahan
 * Menghitung dari total pembilang dibagi total penyebut seluruh RT di bawahnya (bukan rata-rata persentase)
 */
export function aggregateRtUnits(units: Array<{ numerator: number; denominator: number }>): number | null {
  const totalNumerator = units.reduce((acc, u) => acc + (u.numerator || 0), 0);
  const totalDenominator = units.reduce((acc, u) => acc + (u.denominator || 0), 0);
  return calculateParticipationRate(totalNumerator, totalDenominator);
}
```

### B. Format Tampilan Angka & Waktu (`BR-04`, `BR-11`)

Gunakan standar lokalisasi Indonesia:

```tsx
// src/utils/formatters.ts

/** Format angka dengan pemisah ribuan titik Indonesia */
export function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

/** Format berat sampah dalam kilogram */
export function formatWeightKg(kg: number): string {
  return `${formatNumber(kg)} kg`;
}

/** Format tanggal & waktu zona WIB (BR-04) */
export function formatWibDateTime(dateString: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta"
  }).format(new Date(dateString)) + " WIB";
}
```

---

## 5. Konvensi Penulisan File & Styling (Tailwind v4)

Sesuai aturan arsitektur repositori (`AGENTS.md`):

1. **Penamaan File & Folder:**
   - Semua nama folder dan file menggunakan format **kebab-case** (`stat-card.tsx`, `use-inactivity.ts`, `data-table.tsx`).
   - Setiap komponen diekspor dengan format default: `export default function NamaKomponen()`.
2. **Penggunaan Path Alias:**
   - Gunakan path alias `@/*` untuk import lintas folder (contoh: `import { Button } from "@/components/ui/button"`).
   - Gunakan relative import hanya untuk file saudara dalam satu folder fitur yang sama (contoh: `import { types } from "./types"`).
3. **Aturan Styling Tailwind CSS:**
   - **Gunakan Design Tokens:** Dilarang menggunakan nilai pixel atau hex sembarangan dalam `className` (contoh dilarang: `w-[327px]`, `bg-[#465fff]`).
   - **Gunakan Logical Properties (RTL/LTR Compatible):**
     - Gunakan `ms-*` / `me-*` (bukan `ml-*` / `mr-*`)
     - Gunakan `ps-*` / `pe-*` (bukan `pl-*` / `pr-*`)
     - Gunakan `text-start` / `text-end` (bukan `text-left` / `text-right`)
   - **Wajib Varian Mode Gelap:** Setiap elemen berwarna wajib memiliki pasangan `dark:` (contoh: `bg-white dark:bg-gray-800 text-gray-900 dark:text-white`).
   - **Gabungkan Class dengan `cn`:** Selalu gunakan `cn(...)` dari `@/utils` saat menggabungkan class dinamis.

---

## 6. Kebijakan Bebas `any` & TypeScript Ketat (Zero `any` Policy)

Sesuai aturan `strict: true` pada `tsconfig.json` dan `AGENTS.md`, **penggunaan tipe `any` dilarang keras**. Penggunaan `any` mematikan sistem proteksi compiler TypeScript, memicu potensi runtime crash di browser (`Cannot read properties of undefined`), dan berisiko meloloskan field data privasi warga (`BR-01`).

### A. Alternatif Tipe Pengganti `any`

| Situasi Kasus                     | Jangan Gunakan (`❌`) | Gunakan Ini Sebagai Gantinya (`✅`)     | Contoh di Proyek                                                          |
| :-------------------------------- | :-------------------- | :-------------------------------------- | :------------------------------------------------------------------------ |
| **Props Komponen**                | `(props: any)`        | Definisikan `interface Props` eksplisit | `interface MetricCardProps { title: string; value: number \| null; }`     |
| **Payload Luar / JSON Eksternal** | `any`                 | `unknown` + Zod Schema / Type Guard     | Validasi baris berkas Excel impor `A-06` dengan pustaka `zod`             |
| **Objek Dinamis Kunci-Nilai**     | `Record<string, any>` | `Record<string, unknown>`               | Parameter query URL atau objek filter dinamis                             |
| **Children / Elemen Renderable**  | `any`                 | `React.ReactNode`                       | Konten modal dialog, slot tab, atau pembungkus layout                     |
| **Event Handler**                 | `(e: any)`            | Tipe event native React spesifik        | `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>` |
| **Fungsi / Array Generik**        | `any[]`               | Generic Type `<T>`                      | `function paginate<T>(items: T[], page: number): T[]`                     |

```tsx
// ❌ CONTOH SALAH (DILARANG):
export default function MetricCard(props: any) {
  return <div>{props.data.total.value}</div>; // Rawan crash, tanpa validasi tipe
}

// ✅ CONTOH BENAR (STRICT TYPESAFE):
interface MetricCardProps {
  title: string;
  value: number | null;
  unit?: string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
}

export default function MetricCard({ title, value, unit, trend }: MetricCardProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="tabular-nums text-2xl font-bold">
        {value !== null ? `${formatNumber(value)} ${unit ?? ""}` : "Data tidak tersedia"}
      </p>
    </div>
  );
}

---

## 7. Matriks Larangan Keras & Anti-Patterns (*The Prohibitions Checklist*)

Sebelum kode di-commit atau diajukan untuk review, periksa terhadap 8 larangan kritis berikut:

| # | Larangan (*Anti-Pattern*) | Mengapa Berbahaya | Solusi yang Benar |
| :---: | :--- | :--- | :--- |
| **1** | **Mendefinisikan Komponen di Dalam Komponen** (`function Child() { ... }` di dalam `Parent`) | Komponen dibuat ulang di setiap render; kursor input teks hilang fokus (*unmount/remount*). | Pisahkan ke fungsi luar atau letakkan di file terpisah. |
| **2** | **Menaruh `"use client"` di Paling Atas Halaman (`page.tsx`)** | Membengkakkan ukuran bundle JS klien; melanggar target waktu muat $\le 3$ detik (NFR-01). | Biarkan halaman sebagai Server Component; dorong `"use client"` ke komponen daun terkecil. |
| **3** | **Menggunakan `any` pada TypeScript** | Mematikan type safety, memicu runtime crash undefined, dan berisiko meloloskan data privasi (BR-01). | Gunakan `interface`, `unknown` + Zod, `Record<string, unknown>`, atau generic `<T>`. |
| **4** | **Menggunakan `useEffect` untuk Menghitung Data Turunan** | Memicu siklus render ganda (*lag* visual dan layar berkedip). | Hitung langsung pada konstanta saat proses render (*derived state*). |
| **5** | **Pengambilan Data Berurutan (*Waterfall Fetching*)** | Halaman lambat karena waktu tunggu adalah akumulasi seluruh request ($A + B + C$). | Gunakan `Promise.all([A, B, C])` untuk data yang saling independen. |
| **6** | **Menggunakan `key={index}` pada List Dinamis** | Data tertukar atau state input salah letak saat tabel difilter/diurutkan. | Gunakan ID unik yang stabil (`rt.kodeRt`, `log.id`). |
| **7** | **Render Kondisional `numeric && <UI />`** | Nilai `0` dievaluasi sebagai angka nyata dan tercetak sebagai teks "0" di layar. | Gunakan ternary eksplisit: `numeric > 0 ? <UI /> : null`. |
| **8** | **Static Import Pustaka Berat Browser (ApexCharts / MapLibre)** | Memicu error crash `window is not defined` saat SSR Next.js. | Wajib gunakan `dynamic(() => import(...), { ssr: false })` + Skeleton loader. |
| **9** | **Mutasi State Secara Langsung (`state.push` / `state.prop = ...`)** | React tidak mendeteksi perubahan state; UI tidak ter-update. | Gunakan update immutability: `[...state, newItem]` atau spread object `{ ...state, prop: val }`. |
| **10**| **Double-Click pada Aksi Mutasi (Impor / Submit)** | Impor ganda atau pengiriman data berulang ke server. | Nonaktifkan tombol (`disabled={isSubmitting}`) dan tampilkan spinner loading. |
```
