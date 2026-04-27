import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("floating tag checks", () => {
  it("detects risky floating tags", () => {
    const result = scanComposeContent("services:\n  app:\n    image: ghcr.io/example/app:stable\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "FLOATING_IMAGE_TAG",
        severity: "medium",
        service: "app"
      })
    );
  });
});
