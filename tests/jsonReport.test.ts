import { describe, expect, it } from "vitest";
import { buildJsonReport, renderJsonReport } from "../src/report/json";
import { scanComposeContent } from "../src";

describe("JSON report", () => {
  it("renders a CI-friendly JSON report", () => {
    const result = scanComposeContent(
      `
services:
  app:
    image: ghcr.io/example/app:stable
  db:
    image: postgres:latest
  cache:
    image: redis
  worker:
    image: ghcr.io/example/worker@sha256:abcdef
  watchtower:
    image: containrrr/watchtower:latest
`,
      "compose.yml"
    );

    const report = buildJsonReport(result, {
      generatedAt: "2026-04-28T00:00:00.000Z",
      toolVersion: "9.9.9-test"
    });

    expect(report.toolName).toBe("UpdateSentinel");
    expect(report.toolVersion).toBe("9.9.9-test");
    expect(report.scannedFile).toBe("compose.yml");
    expect(report.generatedAt).toBe("2026-04-28T00:00:00.000Z");
    expect(report.summary.totalServices).toBe(5);
    expect(report.summary.totalImages).toBe(5);
    expect(report.summary.unpinnedImageCount).toBe(1);
    expect(report.summary.latestTagCount).toBe(2);
    expect(report.summary.floatingTagCount).toBe(3);
    expect(report.summary.statefulServicesCount).toBe(2);
    expect(report.summary.autoUpdateServicesCount).toBe(1);
    expect(report.summary.totalFindings).toBe(result.findings.length);
    expect(report.summary.highCount).toBe(result.findings.filter((finding) => finding.severity === "high").length);
    expect(report.summary.mediumCount).toBe(result.findings.filter((finding) => finding.severity === "medium").length);
    expect(report.summary.lowCount).toBe(result.findings.filter((finding) => finding.severity === "low").length);

    expect(report.images).toContainEqual(
      expect.objectContaining({
        service: "db",
        image: "postgres:latest",
        tag: "latest",
        isPinned: false,
        isDigestPinned: false,
        isLatest: true,
        isFloating: true,
        riskLevel: "high"
      })
    );
    expect(report.images).toContainEqual(
      expect.objectContaining({
        service: "worker",
        tag: null,
        isPinned: true,
        isDigestPinned: true,
        riskLevel: "low"
      })
    );
    expect(report.statefulServices).toEqual(["db", "cache"]);
    expect(report.autoUpdateServices).toContainEqual(
      expect.objectContaining({
        service: "watchtower",
        kind: "auto-update"
      })
    );
    expect(report.backupHints).toEqual([]);
    expect(report.rollbackHints).toEqual([]);
    expect(report.findings[0]).toEqual(
      expect.objectContaining({
        ruleId: expect.any(String),
        severity: expect.stringMatching(/high|medium|low/),
        service: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        evidence: expect.any(String),
        recommendation: expect.any(String)
      })
    );
  });

  it("serializes valid JSON with a generated timestamp", () => {
    const result = scanComposeContent("services:\n  web:\n    image: nginx:1.25.3\n", "compose.yml");
    const parsed = JSON.parse(renderJsonReport(result)) as { generatedAt: string; toolVersion: string };

    expect(parsed.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(parsed.toolVersion).toBe("0.2.0");
  });
});
