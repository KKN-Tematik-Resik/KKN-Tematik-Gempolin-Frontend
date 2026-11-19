# Login Page — Route Rename (`/signin` → `/login`) & Centered Card Auth Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename authentication route from `/signin` to `/login`, update internal references and documentation, and redesign the layout into an isolated, centered card auth shell (Pilihan 3.A: clean, no public footer links) strictly for Kelurahan Gempolsari admin staff, including keyboard navigation (Enter key advancement).

**Architecture:** 
1. Rename folder `src/app/signin/` to `src/app/login/`, update route mapping in specs, and update user dropdown logout URL.
2. Transform `src/app/login/layout.tsx` into a centered viewport shell with neutral background (`bg-slate-50 dark:bg-gray-950`) and subtle `GridShape` decoration (pure Server Component).
3. Redesign `src/app/login/login-form.tsx` as a centered elevated card with authentic `TrashBinIcon` branding, username & password inputs (free from paste-blocking), Enter key focus shift from username to password, and a primary submit button without public portal links.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · `@/components/ui/*` · `@/icons` · `@/i18n/navigation` · `@/context/theme-context`

**Spec:**
- `docs/superpowers/specs/01-design-system-guideline.md` — Pine Green palette, elevation (`shadow-theme-lg`), 8-point spacing, dark mode pairs
- `docs/superpowers/specs/02-gempolsari-dashboard-spec.md` — A-01 login spec (§4.B.3, line 67: Auth Shell minimalis Layar Penuh, Card Tengah), BR-02
- `docs/superpowers/specs/03-code-guideline-and-best-practices.md` — Server Components, Zero `any`, kebab-case, logical properties

---

## Global Constraints

- **No git commit or git add commands**: The user explicitly manages all git staging and commits.
- **Routing folder names**: Pure **kebab-case only**, no parentheses — `login/` not `(auth)/login/`.
- **Server Component integrity**: `src/app/login/layout.tsx` and `src/app/login/page.tsx` must be Server Components — `"use client"` is strictly forbidden.
- `"use client"` is only allowed on the leaf form component (`src/app/login/login-form.tsx`).
- **No public footer/portal link**: The login page is an exclusive administrative gateway (BR-02); no links to public pages or external registration.
- **No paste blocking (A-01)**: The password input must never prevent clipboard paste events.
- **No inline `<svg>` tags**: All visual icons must come from `@/icons`.
- **Navigation imports**: All navigation imports must use `@/i18n/navigation` instead of `next/link` or `next/navigation`.
- **Dark mode parity**: Every color class (`bg-*`, `text-*`, `border-*`) must define an explicit `dark:` counterpart.
- **Design tokens only**: No raw hex codes or inline arbitrary pixel sizes in `className`.
- **Verification gate**: `npm run lint` and `npx tsc --noEmit` must exit with 0 errors before completion. No automatic build (`npm run build` is forbidden).

## Review Focus

1. **Paste accessibility (A-01)**: Verify the password `<Input>` has no `onPaste` handler that blocks paste events.
2. **Server vs Client boundary**: Verify `layout.tsx` and `page.tsx` have no `"use client"` directive, while `login-form.tsx` has `"use client"`.
3. **Keyboard navigation**: Pressing Enter on the username field shifts focus directly to the password field without premature submission.
4. **Visual isolation (BR-02)**: No sign-up links, reset password links, or public dashboard links present on the login page.
5. **No active `/signin` references**: All internal app navigation points to `/login`.

---

## Task 1: Rename Route Folder & Update Spec Documentation

**Files:**
- Rename/Delete: `src/app/signin/` → `src/app/login/`
- Modify: `docs/superpowers/specs/02-gempolsari-dashboard-spec.md`

**Interfaces:**
- Produces: `src/app/login/` folder; spec documentation synchronized to `/login`.

- [x] **Step 1: Rename folder from `signin` to `login`**
  Folder `src/app/signin` moved/renamed to `src/app/login`.

- [x] **Step 2: Update spec routing table and headings**
  In `docs/superpowers/specs/02-gempolsari-dashboard-spec.md`, updated lines 66–68 to `login/` and line 120 heading to `/login`.

---

## Task 2: Update Internal Logout Navigation

**Files:**
- Modify: `src/layout/header/user-dropdown/index.tsx`

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation`
- Produces: `href="/login"` on the user dropdown logout item.

- [x] **Step 1: Update logout link in user dropdown**
  In `src/layout/header/user-dropdown/index.tsx`, updated logout item `render={<Link href="/login" />}`.

- [x] **Step 2: Verify no active `/signin` references in app routes**
  Verified that no active files in `src/app/` or `src/layout/` retain `/signin`.

---

## Task 3: Redesign Auth Shell Layout (`layout.tsx`)

**Files:**
- Modify: `src/app/login/layout.tsx`

**Interfaces:**
- Consumes: `GridShape` from `@/components/common/grid-shape`, `ThemeToggler` from `@/components/common/theme-toggler`, `ThemeProvider` from `@/context/theme-context`
- Produces: `AuthLayout` — centered container (`min-h-screen`, `items-center`, `justify-center`) replacing the split 50/50 desktop grid.

- [x] **Step 1: Implement centered viewport shell**
  Shell wrapper centered with `min-h-screen`, `bg-slate-50 dark:bg-gray-950`, subtle `GridShape` background decoration, centered content slot (`max-w-[420px]`), and fixed `ThemeToggler`.

- [x] **Step 2: Verify Server Component status**
  Verified no `"use client"` directive in `layout.tsx`.

---

## Task 4: Redesign Centered Card Form & Keyboard Navigation (`login-form.tsx` & `page.tsx`)

**Files:**
- Modify: `src/app/login/login-form.tsx`
- Modify: `src/app/login/page.tsx`
- Delete: `src/app/login/sign-in-form.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button`, `Field` from `@/components/ui/field`, `Input` from `@/components/ui/input`, `Label` from `@/components/ui/label`, `EyeCloseIcon`, `EyeIcon`, `TrashBinIcon` from `@/icons`
- Produces: `LoginForm` — `"use client"` leaf component rendering a centered card with keyboard focus shift from username to password.

- [x] **Step 1: Implement centered card UI**
  Card with `rounded-2xl`, `border-gray-200 dark:border-gray-800`, `shadow-theme-lg`, `bg-white dark:bg-gray-900`. Header displays `TrashBinIcon` in pine green container and title "Login Admin Kelurahan". No external/public footer links (Option 3.A).

- [x] **Step 2: Implement Enter key focus navigation**
  Added `passwordInputRef` via `useRef<HTMLInputElement>` and `onKeyDown` handler on username input to focus the password field on Enter (`e.key === "Enter"`).

- [x] **Step 3: Update `page.tsx` and delete obsolete `sign-in-form.tsx`**
  `page.tsx` renders `<LoginForm />` as a Server Component with metadata. Removed old `sign-in-form.tsx`.

---

## Task 5: Lint, Type Check & Verification Gate

**Files:**
- Verification only

- [x] **Step 1: Run ESLint**
  `npm run lint` exited with code 0 (0 errors, 0 warnings).

- [x] **Step 2: Run TypeScript check**
  `npx tsc --noEmit` exited with code 0 (0 errors).

- [x] **Step 3: Verify Review Focus & constraints**
  - No paste blocker on password input.
  - `page.tsx` and `layout.tsx` are Server Components.
  - No git add or git commit executed by agent.
