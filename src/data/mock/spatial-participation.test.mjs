import test from "node:test";
import assert from "node:assert/strict";
import {
  MOCK_SPATIAL_PARTICIPATION,
  getSpatialParticipationList,
  getRwList,
  getRtFullReport,
} from "./spatial-participation.ts";

test("MOCK_SPATIAL_PARTICIPATION contains exactly 67 RT entries", () => {
  assert.equal(MOCK_SPATIAL_PARTICIPATION.length, 67);
});

test("getRwList returns all 10 RWs", () => {
  const rws = getRwList();
  assert.equal(rws.length, 10);
  assert.equal(rws[0], "RW 001");
  assert.equal(rws[9], "RW 010");
});

test("Contains at least one RT with zero denominator for BR-07 test", () => {
  const zeroEntries = MOCK_SPATIAL_PARTICIPATION.filter((item) =>
    Object.values(item.indicators).some((ind) => ind.denominator === 0),
  );
  assert.ok(zeroEntries.length >= 1, "Must have at least one RT with zero denominator");
});

test("getSpatialParticipationList filters by indicator and RW", () => {
  const rw1Items = getSpatialParticipationList({
    indicator: "rumah_memilah",
    rw: "RW 001",
  });
  assert.equal(rw1Items.length, 4); // RW 001 has 4 RTs
  assert.ok(rw1Items.every((item) => item.rw === "RW 001"));
});

test("getSpatialParticipationList searches by RT name", () => {
  const searched = getSpatialParticipationList({
    indicator: "rumah_memilah",
    search: "RT 013",
  });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].rt, "RT 013");
});

test("getRtFullReport returns comprehensive 6 indicators and demographics for valid RT", () => {
  const report = getRtFullReport("RT 001", "RW 001");
  assert.ok(report !== null, "Report should not be null");
  assert.equal(report.rt, "RT 001");
  assert.equal(report.rw, "RW 001");

  // Demographics
  assert.ok(report.demographics.totalRumah > 0);
  assert.ok(report.demographics.totalKk > 0);
  assert.ok(report.demographics.totalWarga > 0);

  // Indicators
  assert.equal(report.indicators.length, 6);
  const keys = report.indicators.map((i) => i.key);
  assert.deepEqual(keys, [
    "rumah_memilah",
    "rumah_mengolah",
    "kk_memilah",
    "kk_mengolah",
    "warga_memilah",
    "warga_mengolah",
  ]);

  for (const ind of report.indicators) {
    assert.ok(ind.label.length > 0);
    assert.ok(["rumah", "kk", "warga"].includes(ind.objectType));
    assert.ok(["memilah", "mengolah"].includes(ind.activity));
    assert.ok(typeof ind.numerator === "number");
    assert.ok(typeof ind.denominator === "number");
    assert.ok(ind.percentage === null || typeof ind.percentage === "number");
    assert.ok(typeof ind.statusLabel === "string");
  }
});

test("getRtFullReport handles zero denominator edge case (RT 013 RW 004)", () => {
  const report = getRtFullReport("RT 013", "RW 004");
  assert.ok(report !== null);
  assert.equal(report.demographics.totalRumah, 0);
  assert.equal(report.demographics.totalKk, 0);
  assert.equal(report.demographics.totalWarga, 0);

  for (const ind of report.indicators) {
    assert.equal(ind.numerator, 0);
    assert.equal(ind.denominator, 0);
    assert.equal(ind.percentage, null);
    assert.equal(ind.participationClass, null);
    assert.equal(ind.statusLabel, "Data Tidak Tersedia");
  }
});

test("getRtFullReport returns null for unknown RT", () => {
  const report = getRtFullReport("RT 999", "RW 999");
  assert.equal(report, null);
});

