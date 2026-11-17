"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Login Admin Kelurahan
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gempolin — Sistem Informasi Pengelolaan Sampah Kelurahan Gempolsari
          </p>
        </div>

        <form className="space-y-5">
          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Masukkan username"
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
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
