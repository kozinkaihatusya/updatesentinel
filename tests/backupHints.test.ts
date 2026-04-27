import { describe, expect, it } from "vitest";
import { scanComposeContent } from "../src";

describe("backup hint checks", () => {
  it("flags auto-update services with stateful services and no backup hint", () => {
    const result = scanComposeContent(`
services:
  db:
    image: postgres:latest
  watchtower:
    image: containrrr/watchtower:latest
`);

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "AUTO_UPDATE_WITH_STATEFUL_SERVICES_NO_BACKUP",
        severity: "high"
      })
    );
  });

  it("detects backup hints", () => {
    const result = scanComposeContent(`
services:
  db:
    image: postgres:16.2
  backup:
    image: restic/restic:0.16.4
`);

    expect(result.hints.backup).toContain("backup");
    expect(result.hints.backup).toContain("restic");
    expect(result.findings).not.toContainEqual(
      expect.objectContaining({
        ruleId: "NO_BACKUP_HINT_FOR_STATEFUL_SERVICES"
      })
    );
  });
});
