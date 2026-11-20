import test from "node:test";
import assert from "node:assert/strict";
import { gempolinMockData } from "./mock-data.ts";

test("gempolinMockData covers RW 01..RW 06 and stays consistent across harian, perRt, and periode", () => {
  const { periode, harian, perRt } = gempolinMockData;

  const rwSet = new Set(perRt.map((row) => row.rwNama));
  assert.deepEqual(Array.from(rwSet).sort(), [
    "RW 01",
    "RW 02",
    "RW 03",
    "RW 04",
    "RW 05",
    "RW 06",
  ]);

  const sumHarianReq = harian.reduce((s, r) => s + r.requestCount, 0);
  const sumHarianTerolah = harian.reduce((s, r) => s + r.beratTerolah, 0);
  const sumHarianVerif = harian.reduce((s, r) => s + r.beratVerifikasi, 0);

  const sumRtReq = perRt.reduce((s, r) => s + r.totalRequest, 0);
  const sumRtTerolah = perRt.reduce((s, r) => s + r.totalTerolah, 0);
  const sumRtVerif = perRt.reduce((s, r) => s + r.totalVerifikasi, 0);

  assert.equal(sumRtReq, sumHarianReq);
  assert.equal(sumRtTerolah, sumHarianTerolah);
  assert.equal(sumRtVerif, sumHarianVerif);
  assert.equal(periode.totalRequest, sumRtReq);
  assert.equal(periode.totalTerolah, sumRtTerolah);
});
