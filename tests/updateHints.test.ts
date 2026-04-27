import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("update hint checks", () => {
  it("detects update strategy hints", () => {
    const result = scanComposeContent(`
# renovate checks releases and changelogs before upgrade windows.
services:
  app:
    image: ghcr.io/example/app:1.2.3
`);

    expect(result.hints.update).toContain("renovate");
    expect(result.hints.update).toContain("release");
    expect(result.hints.update).toContain("changelog");
  });

  it("reports missing update strategy hints", () => {
    const result = scanComposeContent("services:\n  app:\n    image: ghcr.io/example/app:1.2.3\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "NO_UPDATE_STRATEGY_HINT",
        severity: "low"
      })
    );
  });
});
