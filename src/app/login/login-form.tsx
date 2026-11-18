"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeCloseIcon, EyeIcon, TrashBinIcon } from "@/icons";
import { useRef, useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-lg sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400">
          <TrashBinIcon className="size-6" />
        </div>
        <h1 className="text-title-sm font-bold text-gray-900 dark:text-white sm:text-title-md">
          Login Admin Kelurahan
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Gempolin · Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari
        </p>
      </div>

      <form className="mt-6 space-y-4 sm:space-y-5" noValidate>
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Masukkan username"
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
          Masuk
        </Button>
      </form>
    </div>
  );
}
