"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useState } from "react";

type RoleType = "admin" | "super-admin";

export default function SignInForm() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "super-admin") {
      router.push("/super-admin");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6">
        <div className="mb-6">
          {/* Role Switcher Pill */}
          <div className="mb-6 inline-flex rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-800 dark:bg-gray-800/60">
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

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {role === "admin" ? "Login Admin Kelurahan" : "Login Super Admin"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {role === "admin"
              ? "Gempolin — Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari"
              : "Kelola akun pengguna dan hak akses Admin Kelurahan (Draft)"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder={
                role === "admin" ? "Masukkan username admin" : "Masukkan username super admin"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeCloseIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" className="w-full">
            Masuk sebagai {role === "admin" ? "Admin Kelurahan" : "Super Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
