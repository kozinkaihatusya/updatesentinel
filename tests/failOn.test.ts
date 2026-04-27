import { describe, expect, it } from "vitest";
import { getExitCodeForFailOn, parseFailOnThreshold, violatesFailOnThreshold } from "../src/failOn";
import { scanComposeContent } from "../src";

describe("fail-on thresholds", () => {
  const risky = scanComposeContent(`
services:
  db:
    image: postgres:latest
`);

  const lowOnly = scanComposeContent(`
# backup and rollback hints keep stateful checks quiet.
services:
  web:
    image: nginx:1.25.3
`);

  it("parses supported thresholds", () => {
    expect(parseFailOnThreshold("high")).toBe("high");
    expect(parseFailOnThreshold("medium")).toBe("medium");
    expect(parseFailOnThreshold("low")).toBe("low");
    expect(parseFailOnThreshold("none")).toBe("none");
    expect(parseFailOnThreshold("critical")).toBeUndefined();
  });

  it("does not fail when threshold is none", () => {
    expect(violatesFailOnThreshold(risky, "none")).toBe(false);
    expect(getExitCodeForFailOn(risky, "none")).toBe(0);
  });

  it("fails on high findings for high threshold", () => {
    expect(violatesFailOnThreshold(risky, "high")).toBe(true);
    expect(getExitCodeForFailOn(risky, "high")).toBe(1);
  });

  it("fails on high or medium findings for medium threshold", () => {
    expect(getExitCodeForFailOn(risky, "medium")).toBe(1);
  });

  it("fails on any finding for low threshold", () => {
    expect(lowOnly.findings.every((finding) => finding.severity === "low")).toBe(true);
    expect(getExitCodeForFailOn(lowOnly, "high")).toBe(0);
    expect(getExitCodeForFailOn(lowOnly, "medium")).toBe(0);
    expect(getExitCodeForFailOn(lowOnly, "low")).toBe(1);
  });
});
