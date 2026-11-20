import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_IMPORT_FILE_BYTES,
  formatImportFileSize,
  validateImportFile,
} from "./import-file.ts";

test("validateImportFile accepts valid .xlsx files (case-insensitive)", () => {
  assert.equal(validateImportFile({ name: "demografi.xlsx", size: 2048 }), null);
  assert.equal(
    validateImportFile({ name: "REKAP_NOV.XLSX", size: MAX_IMPORT_FILE_BYTES }),
    null,
  );
});

test("validateImportFile rejects invalid extension, empty, and oversized files", () => {
  assert.match(
    validateImportFile({ name: "demografi.csv", size: 1024 }) ?? "",
    /\.xlsx/i,
  );
  assert.match(
    validateImportFile({ name: "kosong.xlsx", size: 0 }) ?? "",
    /kosong/i,
  );
  assert.match(
    validateImportFile({
      name: "besar.xlsx",
      size: MAX_IMPORT_FILE_BYTES + 1,
    }) ?? "",
    /10 MB/i,
  );
});

test("formatImportFileSize formats bytes, KB, and MB", () => {
  assert.equal(formatImportFileSize(512), "512 B");
  assert.equal(formatImportFileSize(248 * 1024), "248 KB");
  assert.equal(formatImportFileSize(2.5 * 1024 * 1024), "2.5 MB");
});
