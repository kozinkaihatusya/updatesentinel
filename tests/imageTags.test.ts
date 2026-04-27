import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("image tag checks", () => {
  it("detects unpinned images", () => {
    const result = scanComposeContent("services:\n  web:\n    image: nginx\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "IMAGE_UNPINNED",
        severity: "medium",
        service: "web"
      })
    );
  });

  it("detects latest tags", () => {
    const result = scanComposeContent("services:\n  web:\n    image: nginx:latest\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "IMAGE_LATEST_TAG",
        severity: "medium",
        service: "web"
      })
    );
  });

  it("handles digest-pinned images as low drift risk", () => {
    const result = scanComposeContent("services:\n  web:\n    image: nginx@sha256:abcdef\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "IMAGE_DIGEST_PINNED",
        severity: "low",
        service: "web"
      })
    );
  });
});
