import type { AutomationDetection, ComposeFile, ComposeService, Finding } from "../types";

export function detectAutomationServices(compose: ComposeFile): AutomationDetection[] {
  const detections: AutomationDetection[] = [];

  for (const service of compose.services) {
    const haystack = `${service.name} ${service.image ?? ""}`.toLowerCase();

    if (haystack.includes("diun")) {
      detections.push({
        service: service.name,
        image: service.image,
        kind: "monitor",
        evidence: service.image ?? service.name,
        detail: "DIUN is usually notification-focused, so UpdateSentinel classifies it as update monitoring."
      });
      continue;
    }

    if (haystack.includes("watchtower") || haystack.includes("containrrr/watchtower") || haystack.includes("ouroboros")) {
      detections.push({
        service: service.name,
        image: service.image,
        kind: "auto-update",
        evidence: service.image ?? service.name,
        detail: "Watchtower/Ouroboros-style services commonly update containers automatically."
      });
    }
  }

  return detections;
}

export function checkAutoUpdateServices(compose: ComposeFile): Finding[] {
  const findings: Finding[] = [];

  for (const detection of detectAutomationServices(compose)) {
    if (detection.kind === "auto-update") {
      findings.push({
        ruleId: "AUTO_UPDATE_SERVICE_DETECTED",
        severity: "medium",
        service: detection.service,
        title: "Auto-update service detected",
        description: `${detection.detail} This can be useful, but it increases update risk when used without backups and rollback steps.`,
        evidence: detection.evidence,
        recommendation: "Avoid blind auto-updates for stateful services. Document backup, restore, and rollback steps."
      });
    } else {
      findings.push({
        ruleId: "UPDATE_MONITOR_SERVICE_DETECTED",
        severity: "low",
        service: detection.service,
        title: "Update monitoring service detected",
        description: detection.detail,
        evidence: detection.evidence,
        recommendation: "Use monitoring alerts as input to a documented update process with changelog review."
      });
    }
  }

  for (const service of compose.services) {
    const watchtowerHints = detectWatchtowerHints(service);
    for (const evidence of watchtowerHints) {
      findings.push({
        ruleId: "WATCHTOWER_HINT_DETECTED",
        severity: "medium",
        service: service.name,
        title: "Watchtower configuration hint detected",
        description: `Service \`${service.name}\` includes Watchtower-related configuration.`,
        evidence,
        recommendation: "Confirm whether this service can be updated automatically and document exclusions for stateful services."
      });
    }
  }

  return findings;
}

function detectWatchtowerHints(service: ComposeService): string[] {
  const envHints = Object.keys(service.environment).filter((key) => key.toUpperCase().startsWith("WATCHTOWER_"));
  const labelHints = Object.keys(service.labels).filter((key) =>
    key.toLowerCase().startsWith("com.centurylinklabs.watchtower.")
  );

  return [...envHints, ...labelHints];
}
