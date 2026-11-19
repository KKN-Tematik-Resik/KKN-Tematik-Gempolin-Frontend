"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "@/icons";
import { useState } from "react";
import type { AddressInfo } from "@/types/profil";

interface AdminAddressCardProps {
  initialData: AddressInfo;
}

export default function AdminAddressCard({ initialData }: AdminAddressCardProps) {
  const [address, setAddress] = useState<AddressInfo>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddressInfo>(initialData);

  const handleOpen = () => {
    setFormData(address);
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(formData);
    setIsOpen(false);
  };

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        {/* Header: Title & Edit Button */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg dark:text-white/90">
            Alamat Kantor Kelurahan
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="gap-2"
          >
            <PencilIcon className="size-4.5" />
            <span>Ubah</span>
          </Button>
        </div>

        {/* Grid Alamat */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Alamat Jalan / Lokasi
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {address.streetAddress}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Kota & Provinsi
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {address.cityState}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Kode Pos
            </p>
            <p className="text-sm font-medium tabular-nums text-gray-800 sm:text-base dark:text-white/90">
              {address.postalCode}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Negara
            </p>
            <p className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">
              {address.country}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Address Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-3xl p-6 sm:max-w-146 sm:p-8">
          <DialogHeader className="gap-1.5 text-start">
            <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
              Ubah Alamat Kantor
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Perbarui informasi wilayah dan alamat kantor kelurahan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="streetAddress">Alamat Jalan / Lokasi</FieldLabel>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="cityState">Kota & Provinsi</FieldLabel>
                <Input
                  id="cityState"
                  value={formData.cityState}
                  onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="postalCode">Kode Pos</FieldLabel>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </Field>
            </div>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="country">Negara</FieldLabel>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </Field>

            <DialogFooter className="gap-3 pt-3 sm:justify-end">
              <DialogClose
                render={
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                }
              />
              <Button type="submit">Simpan Alamat</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
