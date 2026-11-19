"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { LogOutIcon, TrashBinIcon } from "@/icons";
import { useState } from "react";

export default function DangerZoneCard() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleLogoutAll = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      router.push("/signin");
    }, 500);
  };

  const handleDeleteAccount = () => {
    setShowDeleteAlert(true);
    setTimeout(() => {
      setShowDeleteAlert(false);
    }, 4000);
  };

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
      <h3 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
        Sesi Akun
      </h3>

      {showDeleteAlert && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          Akun tunggal Administrator Kelurahan (BR-02) terproteksi dan tidak dapat dihapus secara mandiri.
        </div>
      )}

      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-800">
        {/* Logout all devices */}
        <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <div>
            <h4 className="mb-0.5 text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              Keluar dari semua perangkat
            </h4>
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Keluar dari seluruh sesi login yang sedang aktif.
            </p>
          </div>
          <div className="flex shrink-0 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="gap-2"
            >
              <LogOutIcon className="size-4.5 rtl:rotate-180" />
              <span>{isLoggingOut ? "Mengeluarkan..." : "Log Out"}</span>
            </Button>
          </div>
        </div>

        {/* Delete account */}
        <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <div>
            <h4 className="mb-0.5 text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              Hapus akun
            </h4>
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Hapus akun administrator dan seluruh data secara permanen.
            </p>
          </div>
          <div className="flex shrink-0 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteAccount}
              className="gap-2 border-red-300 text-red-500 shadow-theme-xs hover:bg-red-50 hover:text-red-600 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <TrashBinIcon className="size-4.5" />
              <span>Hapus Akun</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
