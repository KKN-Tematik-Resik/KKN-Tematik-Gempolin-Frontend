"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertIcon } from "@/icons";
import type { AdminUser } from "@/types/super-admin";

interface DeleteConfirmModalProps {
  adminData: AdminUser | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteConfirmModal({
  adminData,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!adminData) return null;

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <AlertIcon className="size-5" />
            </div>
            <div>
              <DialogTitle>Hapus Akun Admin</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-sm text-gray-600 dark:text-gray-300">
          Apakah Anda yakin ingin menghapus akun admin{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {adminData.namaLengkap}
          </span>{" "}
          (<span className="font-mono text-gray-700 dark:text-gray-400">@{adminData.username}</span>)?
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(adminData.id);
              onClose();
            }}
          >
            Ya, Hapus Akun
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
