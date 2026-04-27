import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("rollback hint checks", () => {
  it("reports missing rollback hints for stateful services", () => {
    const result = scanComposeContent("services:\n  db:\n    image: postgres:16.2\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "NO_ROLLBACK_HINT_FOR_STATEFUL_SERVICES",
        severity: "medium"
      })
    );
  });

  it("detects rollback hints", () => {
    const result = scanComposeContent(`
# rollback: restore snapshot and pin previous image before downgrade.
services:
  db:
    image: postgres:16.2
`);

    expect(result.hints.rollback).toContain("rollback");
    expect(result.hints.rollback).toContain("restore");
    expect(result.hints.rollback).toContain("snapshot");
    expect(result.findings).not.toContainEqual(
      expect.objectContaining({
        ruleId: "NO_ROLLBACK_HINT_FOR_STATEFUL_SERVICES"
      })
    );
  });
});
