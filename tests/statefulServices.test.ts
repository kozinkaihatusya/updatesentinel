import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("stateful service checks", () => {
  it("detects stateful services", () => {
    const result = scanComposeContent("services:\n  db:\n    image: postgres:16.2\n");

    expect(result.statefulServices).toEqual(["db"]);
  });

  it("flags stateful services using latest as high risk", () => {
    const result = scanComposeContent("services:\n  db:\n    image: postgres:latest\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "STATEFUL_SERVICE_LATEST_TAG",
        severity: "high",
        service: "db"
      })
    );
  });

  it("flags unpinned stateful images as high risk", () => {
    const result = scanComposeContent("services:\n  cache:\n    image: redis\n");

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "STATEFUL_SERVICE_UNPINNED_IMAGE",
        severity: "high",
        service: "cache"
      })
    );
  });
});
