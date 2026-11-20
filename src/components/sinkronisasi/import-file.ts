export const MAX_IMPORT_FILE_BYTES = 10 * 1024 * 1024;

export function validateImportFile(file: {
  name: string;
  size: number;
}): string | null {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return "Format berkas tidak didukung. Gunakan file Excel (.xlsx).";
  }
  if (file.size <= 0) {
    return "Berkas kosong. Pilih file Excel (.xlsx) yang berisi data.";
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    return "Ukuran berkas melebihi batas maksimal 10 MB.";
  }
  return null;
}

export function formatImportFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
