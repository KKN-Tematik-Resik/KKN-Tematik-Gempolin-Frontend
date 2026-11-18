# 🗺️ Skill Mapping Guide — Gudang Prompt

> **Cara pakai:** Lihat situasi kamu → cari kategori yang cocok → copy prompt yang sudah siap pakai.

---

## 🔄 Kategori 1: Workflow & Process (Superpowers)

### 1. `using-superpowers` — Disiplin Skill di Awal Sesi
**Kondisi:** Setiap awal percakapan baru; saat ingin memastikan AI memakai skill yang tepat.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Establish skill discipline for this session. I'm working on a Next.js dashboard project.` |
| 2 | `Sebelum mulai, aktifkan skill yang relevan untuk proyek ini.` |
| 3 | `Check which skills apply before we begin coding.` |

---

### 2. `brainstorming` — Eksplorasi Ide Sebelum Eksekusi
**Kondisi:** Mau bikin fitur baru, komponen baru, atau merancang sesuatu. **WAJIB** sebelum creative work apapun.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Brainstorm ide untuk fitur notifikasi real-time di dashboard ini.` |
| 2 | `Saya mau bikin halaman analytics baru. Brainstorm dulu opsi layout dan komponen yang bisa dipakai.` |
| 3 | `Brainstorm pendekatan terbaik untuk state management di form wizard multi-step ini.` |
| 4 | `Bantu saya brainstorm struktur sidebar yang lebih intuitif untuk user admin.` |
| 5 | `Brainstorm cara terbaik untuk implement dark mode toggle yang smooth.` |

---

### 3. `writing-plans` — Membuat Rencana Multi-Step
**Kondisi:** Task kompleks yang butuh lebih dari 1 langkah; sebelum menyentuh kode apapun.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Buatkan plan untuk menambahkan sistem autentikasi JWT ke dashboard ini.` |
| 2 | `Saya mau refactor halaman e-commerce. Tulis plan step-by-step yang bisa saya approve dulu.` |
| 3 | `Buatkan implementation plan untuk integrasi ApexCharts di halaman analytics baru.` |
| 4 | `Plan migrasi dari static data ke API calls untuk komponen tabel ini.` |

---

### 4. `executing-plans` — Eksekusi Plan yang Sudah Disetujui
**Kondisi:** Setelah plan di-approve, siap eksekusi; saat user pilih "inline execution" bukan subagent.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Execute the plan we just agreed on.` |
| 2 | `Jalankan plan step 1 sampai 3 yang sudah kita bahas.` |
| 3 | `Lanjutkan eksekusi plan — kita sudah di step 4.` |

---

### 5. `systematic-debugging` — Debug Bug / Error Secara Sistematis
**Kondisi:** Ada bug, error, atau perilaku tidak terduga. **JANGAN langsung fix** — debug dulu sistematis.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Komponen DataTable ini crash saat data kosong. Debug secara sistematis.` |
| 2 | `Kenapa form ini tidak submit? Error: "Cannot read property of undefined". Debug ini.` |
| 3 | `Build gagal dengan error ini: [paste error]. Lakukan systematic debugging.` |
| 4 | `Halaman ini hydration error di Next.js. Temukan root cause-nya dulu sebelum fix.` |
| 5 | `TypeScript complaining tentang type mismatch ini. Debug dan jelaskan root cause-nya.` |

---

### 6. `test-driven-development` — TDD: Test Dulu, Baru Code
**Kondisi:** Implementasi fitur/bugfix; ingin test coverage yang solid; "pakai TDD".

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Pakai TDD untuk implement fungsi formatCurrency di utils.` |
| 2 | `Tulis test dulu untuk komponen UserDropdown, baru implement perubahannya.` |
| 3 | `TDD approach untuk hook useFilter yang akan saya buat.` |

---

### 7. `subagent-driven-development` — Eksekusi Paralel via Subagent
**Kondisi:** Ada plan dengan task-task **independen** yang bisa dikerjakan paralel; bukan task berurutan.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Pakai subagent untuk eksekusi 3 task ini secara paralel: [list tasks].` |
| 2 | `Task A dan Task B tidak saling bergantung. Dispatch subagents untuk keduanya.` |
| 3 | `Run these independent tasks in parallel using subagent-driven development.` |

---

### 8. `dispatching-parallel-agents` — 2+ Task Independen Sekaligus
**Kondisi:** Minimal 2 task yang benar-benar independen dan bisa dikerjakan bersamaan.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Dispatch agents: satu untuk refactor komponen Header, satu untuk refactor Sidebar. Keduanya independen.` |
| 2 | `Saya punya 4 halaman yang perlu ditambah translations. Dispatch parallel untuk semua sekaligus.` |
| 3 | `Kerjakan task-task ini paralel — mereka tidak saling depend: [list].` |

---

### 9. `requesting-code-review` — Minta Review Sebelum Selesai
**Kondisi:** Implementasi sudah selesai, sebelum commit/merge; ingin verifikasi kualitas.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Implementasi sudah selesai. Lakukan code review sebelum kita commit.` |
| 2 | `Review perubahan yang baru saja saya buat di komponen ini sebelum merge.` |
| 3 | `Request code review untuk fitur yang baru kita implement.` |

---

### 10. `receiving-code-review` — Memproses Feedback Review dengan Kritis
**Kondisi:** Ada feedback review masuk; sebelum buta-buta implement saran reviewer.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Saya dapat feedback review ini: [paste feedback]. Bantu evaluasi apakah saran ini valid sebelum saya implement.` |
| 2 | `Reviewer menyarankan X, tapi saya ragu. Verifikasi apakah ini benar secara teknis.` |
| 3 | `Receiving code review — help me critically assess this feedback before applying it.` |

---

### 11. `verification-before-completion` — Verifikasi Sebelum Bilang "Selesai"
**Kondisi:** Mau declare task selesai, sebelum commit, sebelum bikin PR.

> [!CAUTION]
> Jangan pernah bilang "sudah selesai" tanpa menjalankan skill ini dulu.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Verify bahwa implementasi ini benar-benar done sebelum saya commit.` |
| 2 | `Run verification checks sebelum kita declare task ini complete.` |
| 3 | `Pastikan semua requirements terpenuhi dan tidak ada yang tertinggal.` |

---

### 12. `using-git-worktrees` — Isolasi Branch / Feature Work
**Kondisi:** Mau mulai feature work yang perlu diisolasi dari workspace sekarang.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Setup git worktree untuk fitur baru ini agar tidak mengganggu main branch.` |
| 2 | `Saya mau kerja di feature branch terpisah. Setup worktree dulu.` |
| 3 | `Isolate this feature work using git worktrees.` |

---

### 13. `finishing-a-development-branch` — Integrasi Branch Setelah Semua Test Pass
**Kondisi:** Implementasi selesai, semua test hijau, siap merge ke main.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Implementasi selesai dan semua test pass. Bantu finishing branch ini — squash, cleanup, siap merge.` |
| 2 | `Feature branch sudah siap. Jalankan finishing steps sebelum merge.` |
| 3 | `Finish this development branch — tests passing, ready to integrate.` |

---

### 14. `diagnosing-superpowers` — Debug Masalah Skill / Session AI
**Kondisi:** Skill tidak terpicu, AI mengulang pekerjaan, session terasa lambat/mahal/aneh.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Skill brainstorming tadi tidak terpicu. Diagnose kenapa.` |
| 2 | `AI tadi mengulang pekerjaan yang sama dua kali. Diagnose sesi ini.` |
| 3 | `Session ini terasa lambat dan mahal. Diagnose superpowers untuk sesi ini.` |
| 4 | `Skill tidak bekerja seperti seharusnya. Buatkan bug report untuk maintainer.` |

---

---

## 🔧 Kategori 2: Code Quality

### 15. `karpathy-guidelines` — Anti-Overengineering, Surgical Changes
**Kondisi:** Nulis kode baru, review, atau refactor. Mencegah kesalahan umum LLM coding.

**Prinsip inti:** Think before coding → Surgical changes → Surface assumptions → Verifiable success criteria

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Pakai karpathy-guidelines untuk review komponen ini sebelum kita modifikasi.` |
| 2 | `Saya mau refactor ini. Apply karpathy guidelines — jangan over-engineer.` |
| 3 | `Sebelum nulis kode, think dulu: apa asumsi kita? Apa success criteria-nya?` |
| 4 | `Make surgical changes only — jangan ubah hal yang tidak perlu diubah.` |
| 5 | `Review kode ini dengan karpathy lens: apakah ada yang over-complicated?` |

---

### 16. `ponytail` — Solusi Termudah, YAGNI Mode
**Kondisi:** Mau solusi simpel; anti-bloat; saat AI cenderung over-engineer.

**Level:**
- `ponytail lite` → perubahan kecil, 1-2 file
- `ponytail` (default) → solusi lazim, refactor normal
- `ponytail ultra` → minimum viable, hapus semua yang tidak perlu

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Ponytail: tambahkan tombol export CSV ke tabel ini.` |
| 2 | `Be lazy — solusi termudah untuk implement search filter ini.` |
| 3 | `YAGNI mode: jangan tambah abstraksi baru, solve minimal saja.` |
| 4 | `Ponytail ultra: hapus semua yang tidak dipakai dari komponen ini.` |
| 5 | `Simplest solution only — tidak perlu pattern fancy untuk fitur ini.` |

---

### 17. `ponytail-review` — Review Perubahan/Diff untuk Bloat & Bug
**Kondisi:** Setelah ada perubahan kode; mau cek apakah ada bug, security risk, atau over-engineering.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Ponytail review perubahan yang baru saja kita buat di komponen ini.` |
| 2 | `Review diff ini: apakah ada bloat, bug, atau security risk?` |
| 3 | `Is this change over-engineered? Ponytail review please.` |
| 4 | `Review PR ini — cari apa yang bisa dihapus atau disederhanakan.` |

---

### 18. `ponytail-audit` — Audit Seluruh Repo
**Kondisi:** Mau audit keseluruhan codebase; cari bug, security holes, kode lambat, bloat.

> [!NOTE]
> One-shot report — tidak mengubah apapun, hanya melaporkan.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `/ponytail-audit` |
| 2 | `Audit seluruh codebase ini. Temukan bug, security holes, dan kode yang bisa dihapus.` |
| 3 | `Lakukan ponytail audit — ranked findings, dari yang paling berbahaya.` |
| 4 | `Find bloat di repo ini — apa yang bisa saya delete, merge, atau split?` |

---

### 19. `ponytail-debt` — Daftar Technical Debt (Shortcut Comments)
**Kondisi:** Mau tahu semua shortcut/debt yang tertinggal dari sesi ponytail sebelumnya.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `/ponytail-debt` |
| 2 | `List semua shortcut: comments sebagai debt ledger.` |
| 3 | `Apa yang di-defer oleh ponytail di sesi-sesi sebelumnya?` |

---

---

## 🎨 Kategori 3: UI/UX Design

### 20. `ui-ux-pro-max` — Dashboard, Charts, Data-Dense UI
**Kondisi:** Bikin/review komponen dashboard; charts; design system; data table; komponen admin.

**Database internal:** 80 styles, 192 palettes, 74 font pairings, 120 UX guidelines, 25 chart types.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Desain komponen analytics card yang menampilkan revenue trend dengan ApexCharts.` |
| 2 | `Pilihkan color palette terbaik untuk dashboard SaaS yang professional dan trustworthy.` |
| 3 | `Rekomendasikan font pairing untuk admin dashboard — readable di data-dense layout.` |
| 4 | `Review chart ini dari sisi UX — apakah data mudah dibaca dan dipahami?` |
| 5 | `Desain layout untuk halaman laporan dengan 6 metric cards dan 2 chart besar.` |
| 6 | `Pilih chart type yang tepat untuk menampilkan perbandingan revenue 12 bulan.` |
| 7 | `Buatkan design system tokens untuk dashboard ini — warna, spacing, typography.` |

---

### 21. `design-taste-frontend` (taste-skill) — Landing Page Premium, Anti-AI-Slop
**Kondisi:** Bikin/redesign landing page, hero section, company website; saat halaman terlihat generik/template.

**Referensi:** Figma.com, Linear.app, x.ai, Vercel.com level quality.

> [!IMPORTANT]
> Gunakan skill ini saat halaman terlihat "AI-made" atau terlalu template-ish.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Desain hero section untuk landing page SaaS ini — anti-generic, premium feel.` |
| 2 | `Halaman ini terlihat terlalu template. Redesign dengan taste-skill agar terlihat seperti Figma.com.` |
| 3 | `Buat landing page untuk produk AI ini — shader effects, real copy, bukan lorem ipsum.` |
| 4 | `Review halaman ini — apakah terlihat generik atau AI-made? Perbaiki dengan taste.` |
| 5 | `Desain coming soon page yang memorable — satu system, satu pesan, micro-interactions.` |
| 6 | `Halaman ini terlalu ramai. Redesign: satu section per screen, equal edges, clean.` |

---

### 22. `web-design-guidelines` — Audit Aksesibilitas & Best Practices
**Kondisi:** Review UI untuk aksesibilitas (WCAG), keyboard navigation, semantic HTML, Vercel standards.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Audit aksesibilitas halaman login ini — WCAG compliance, keyboard nav, ARIA labels.` |
| 2 | `Review UI ini terhadap web design guidelines — apakah ada violations?` |
| 3 | `Cek semantic HTML di halaman ini — apakah heading hierarchy benar?` |
| 4 | `Audit form ini: apakah accessible untuk screen reader dan keyboard-only users?` |
| 5 | `Check accessibility di komponen modal ini — focus trap, escape key, aria-modal.` |

---

### 23. `react-best-practices` (vercel) — React/Next.js Performance & Patterns
**Kondisi:** Nulis/review React components; data fetching; bundle optimization; performance issues.

| # | Prompt Siap Pakai |
|---|---|
| 1 | `Review komponen ini dari sisi React best practices — apakah ada unnecessary re-renders?` |
| 2 | `Optimize data fetching di halaman ini menggunakan Next.js App Router patterns.` |
| 3 | `Cek bundle size impact dari perubahan ini — apakah ada yang bisa di-lazy-load?` |
| 4 | `Refactor komponen ini menggunakan React 19 patterns — Server Components, Suspense.` |
| 5 | `Apakah useEffect di sini sudah benar? Review dengan Vercel React best practices.` |
| 6 | `Optimalkan halaman ini untuk Core Web Vitals — LCP, CLS, FID.` |

---

---

## 🗂️ Quick Reference Table

| Situasi | Skill yang Dipakai |
|---|---|
| Mau bikin fitur baru | `brainstorming` → `writing-plans` → `executing-plans` |
| Ada bug / error | `systematic-debugging` |
| Mau solusi cepat & simpel | `ponytail` |
| Nulis kode baru | `karpathy-guidelines` |
| Mau review sebelum commit | `ponytail-review` → `requesting-code-review` → `verification-before-completion` |
| Bikin dashboard / charts | `ui-ux-pro-max` |
| Bikin landing page | `design-taste-frontend` |
| Cek aksesibilitas UI | `web-design-guidelines` |
| React/Next.js performance | `react-best-practices` |
| Halaman terlihat generik | `design-taste-frontend` |
| Audit seluruh repo | `ponytail-audit` |
| Task paralel independen | `dispatching-parallel-agents` |
| Skill tidak bekerja | `diagnosing-superpowers` |
| Siap merge ke main | `finishing-a-development-branch` |

---

## ⚡ Cheat Sheet: Trigger Words

```
"mau bikin..."          → brainstorming
"buatkan plan..."       → writing-plans  
"fix bug ini..."        → systematic-debugging
"ponytail / be lazy..." → ponytail
"review ini..."         → ponytail-review
"dashboard / chart..."  → ui-ux-pro-max
"landing page..."       → design-taste-frontend
"aksesibilitas..."      → web-design-guidelines
"performance..."        → react-best-practices
"audit repo..."         → ponytail-audit
"skill tidak jalan..."  → diagnosing-superpowers
"siap merge..."         → finishing-a-development-branch
```

---

> [!TIP]
> **Flow ideal untuk fitur baru:**
> `brainstorming` → `writing-plans` → `karpathy-guidelines` (review plan) → `executing-plans` → `ponytail-review` → `verification-before-completion` → `finishing-a-development-branch`
