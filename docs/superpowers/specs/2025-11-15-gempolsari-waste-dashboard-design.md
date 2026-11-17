# Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari

Dokumen spesifikasi untuk proyek ini telah dipecah secara modular menjadi rangkaian dokumen resmi yang saling melengkapi:

1. **[01-design-system-guideline.md](./01-design-system-guideline.md)**  
   Pedoman desain visual UI/UX lengkap: Matriks warna Light Mode vs Dark Mode, Palet Brand Pine Green Eco-Civic, Tipografi & Angka Tabular, Pewarnaan Peta 5-Kelas (Ramah Buta Warna), dan Aturan Spasi (8-pt Grid, Gestalt Proximity, Fitts's Law, Equal Edges).

2. **[02-gempolsari-dashboard-spec.md](./02-gempolsari-dashboard-spec.md)**  
   Spesifikasi arsitektur fungsional: Intent & Scope, Batasan Sistem, 11 Aturan Bisnis formal (`BR-01` s.d. `BR-11`), Arsitektur Routing (`(public)` vs `(admin)`), Spesifikasi Detail 10 Halaman (P-01 s.d. P-02, A-01 s.d. A-08), dan Resolusi Keputusan Terbuka (TBD).

3. **[03-code-guideline-and-best-practices.md](./03-code-guideline-and-best-practices.md)**  
   Panduan penulisan kode clean & anti-overengineering (prinsip Ponytail & Vercel React Best Practices): Pola Server vs Client Components, Dynamic Import ApexCharts/MapLibre, Konsumsi API & Paralelisasi Fetching, Implementasi Rumus Bisnis Persampahan (BR-05/06/07), Zero `any` Policy, serta Checklist 10 Anti-Patterns.

4. **[04-frontend-state-and-url-flow.md](./04-frontend-state-and-url-flow.md)**  
   Arsitektur state management dan aliran data Next.js 16: URL Query SearchParams sebagai *single source of truth* untuk filter shareable, hook `useDashboardFilters()`, daur hidup sesi admin 30 menit (`AuthContext`), dan diagram alir data siklus tertutup.

5. **[05-ui-component-inventory.md](./05-ui-component-inventory.md)**  
   Katalog inventaris komponen UI lengkap: Primitif bawaan template `@/components/ui/*`, komponen domain baru persampahan (`MetricCard`, `IndicatorCard`, `FilterBar`, `MapLegend`, `SpatialTableFallback`, `DropzoneUploader`, `ValidationAlertList`, `HelpModal`), katalog ikon resmi `@/icons`, dan checklist kepatuhan pembuatan komponen baru.
