"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { EyeCloseIcon, EyeIcon, TrashBinIcon } from "@/icons";
import { useRef, useState } from "react";

type RoleType = "admin" | "super-admin";

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "super-admin") {
      router.push("/super-admin");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-lg sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-center">
        {/* Role Switcher Pill */}
        <div className="mb-5 inline-flex rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-800 dark:bg-gray-800/60">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              role === "admin"
                ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Admin Kelurahan
          </button>
          <button
            type="button"
            onClick={() => setRole("super-admin")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              role === "super-admin"
                ? "bg-white text-brand-700 shadow-xs dark:bg-gray-700 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Super Admin
          </button>
        </div>

        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400">
          <TrashBinIcon className="size-6" />
        </div>
        <h1 className="text-title-sm font-bold text-gray-900 dark:text-white sm:text-title-md">
          {role === "admin" ? "Login Admin Kelurahan" : "Login Super Admin"}
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {role === "admin"
            ? "Gempolin · Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
            : "Kelola akun pengguna dan hak akses Admin Kelurahan (Draft)"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder={
              role === "admin"
                ? "Masukkan username admin"
                : "Masukkan username super admin"
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleUsernameKeyDown}
          />
        </Field>

        <Field>
          <Label htmlFor="password">Kata Sandi</Label>
          <div className="relative">
            <Input
              ref={passwordInputRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pe-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
            >
              {showPassword ? (
                <EyeCloseIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          </div>
        </Field>

        <Button type="submit" className="w-full" size="lg">
          {role === "admin" ? "Masuk Admin" : "Masuk Super Admin"}
        </Button>
      </form>
    </div>
  );
}
