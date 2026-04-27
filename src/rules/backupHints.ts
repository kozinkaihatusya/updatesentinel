import type { ComposeFile, Finding } from "../types";
import { detectAutomationServices } from "./autoUpdateServices";
import { detectStatefulServices } from "./statefulServices";
import { detectBackupHints } from "./utils";

export function checkBackupHints(compose: ComposeFile): Finding[] {
  const findings: Finding[] = [];
  const statefulServices = detectStatefulServices(compose);
  const backupHints = detectBackupHints(compose);
  const autoUpdateServices = detectAutomationServices(compose).filter((detection) => detection.kind === "auto-update");

  if (statefulServices.length > 0 && backupHints.length === 0) {
    findings.push({
      ruleId: "NO_BACKUP_HINT_FOR_STATEFUL_SERVICES",
      severity: "medium",
      service: "stack",
      title: "No backup hint found for stateful services",
      description: `Stateful services were detected (${statefulServices.join(", ")}), but no obvious backup hint was found in the Compose file.`,
      evidence: statefulServices.join(", "),
      recommendation: "Document backups near the stack or add a backup service such as restic, borg, kopia, pgBackRest, rclone, or snapshots."
    });
  }

  if (autoUpdateServices.length > 0 && statefulServices.length > 0 && backupHints.length === 0) {
    findings.push({
      ruleId: "AUTO_UPDATE_WITH_STATEFUL_SERVICES_NO_BACKUP",
      severity: "high",
      service: "stack",
      title: "Auto-update service is present without a visible backup hint",
      description: `Auto-update services (${autoUpdateServices.map((service) => service.service).join(", ")}) and stateful services (${statefulServices.join(", ")}) are present, but no backup hint was found.`,
      evidence: `auto-update: ${autoUpdateServices.map((service) => service.service).join(", ")}; stateful: ${statefulServices.join(", ")}`,
      recommendation: "Disable blind auto-updates for stateful services or add clear backup and restore procedures before enabling them."
    });
  }

  return findings;
}
