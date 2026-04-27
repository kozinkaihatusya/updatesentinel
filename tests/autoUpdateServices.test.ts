import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("auto-update service checks", () => {
  it("detects Watchtower as an auto-update service", () => {
    const result = scanComposeContent("services:\n  watchtower:\n    image: containrrr/watchtower:latest\n");

    expect(result.autoUpdateServices).toContainEqual(
      expect.objectContaining({
        service: "watchtower",
        kind: "auto-update"
      })
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "AUTO_UPDATE_SERVICE_DETECTED",
        service: "watchtower"
      })
    );
  });

  it("classifies DIUN as update monitoring", () => {
    const result = scanComposeContent("services:\n  diun:\n    image: crazymax/diun:latest\n");

    expect(result.autoUpdateServices).toContainEqual(
      expect.objectContaining({
        service: "diun",
        kind: "monitor"
      })
    );
    expect(result.findings).not.toContainEqual(
      expect.objectContaining({
        ruleId: "AUTO_UPDATE_SERVICE_DETECTED",
        service: "diun"
      })
    );
  });

  it("detects Watchtower labels and environment variables", () => {
    const result = scanComposeContent(`
services:
  app:
    image: ghcr.io/example/app:1.2.3
    labels:
      com.centurylinklabs.watchtower.enable: "true"
  watchtower:
    image: containrrr/watchtower:latest
    environment:
      WATCHTOWER_CLEANUP: "true"
`);

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "WATCHTOWER_HINT_DETECTED",
        service: "app"
      })
    );
    expect(result.autoUpdateServices).not.toContainEqual(
      expect.objectContaining({
        service: "app",
        kind: "auto-update"
      })
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "WATCHTOWER_HINT_DETECTED",
        service: "watchtower"
      })
    );
  });
});
