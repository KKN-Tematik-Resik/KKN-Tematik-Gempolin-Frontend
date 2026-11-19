import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateParticipationRate,
  getParticipationClass,
  getParticipationColor,
  formatPercentage,
} from "./calculations.ts";

test("calculateParticipationRate returns correct percentage", () => {
  assert.equal(calculateParticipationRate(85, 100), 85);
  assert.equal(calculateParticipationRate(0, 100), 0);
  assert.ok(
    Math.abs((calculateParticipationRate(1, 3) ?? 0) - 33.333) < 0.01,
  );
});

test("calculateParticipationRate returns null when denominator <= 0 or invalid (BR-07)", () => {
  assert.equal(calculateParticipationRate(0, 0), null);
  assert.equal(calculateParticipationRate(10, -5), null);
  assert.equal(calculateParticipationRate(NaN, 100), null);
  assert.equal(calculateParticipationRate(10, NaN), null);
});

test("getParticipationClass returns 5-class range (BR-08)", () => {
  assert.equal(getParticipationClass(100), 1);
  assert.equal(getParticipationClass(80), 1);
  assert.equal(getParticipationClass(79.9), 2);
  assert.equal(getParticipationClass(60), 2);
  assert.equal(getParticipationClass(59.9), 3);
  assert.equal(getParticipationClass(40), 3);
  assert.equal(getParticipationClass(39.9), 4);
  assert.equal(getParticipationClass(20), 4);
  assert.equal(getParticipationClass(19.9), 5);
  assert.equal(getParticipationClass(0), 5);
  assert.equal(getParticipationClass(null), null);
});

test("getParticipationColor returns WCAG-compliant colors", () => {
  // Light mode
  assert.equal(getParticipationColor(1, false), "#15803D");
  assert.equal(getParticipationColor(2, false), "#22C55E");
  assert.equal(getParticipationColor(3, false), "#EAB308");
  assert.equal(getParticipationColor(4, false), "#F97316");
  assert.equal(getParticipationColor(5, false), "#DC2626");
  assert.equal(getParticipationColor(null, false), "#D1D5DB");

  // Dark mode
  assert.equal(getParticipationColor(1, true), "#22C55E");
  assert.equal(getParticipationColor(null, true), "#4B5563");
});

test("formatPercentage formats numbers and null safely", () => {
  assert.equal(formatPercentage(85.42), "85.4%");
  assert.equal(formatPercentage(0), "0.0%");
  assert.equal(formatPercentage(null), "Data tidak tersedia");
});
