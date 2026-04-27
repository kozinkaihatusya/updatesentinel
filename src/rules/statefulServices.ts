import type { ComposeFile, Finding } from "../types";
import { isStatefulService } from "./utils";

export function detectStatefulServices(compose: ComposeFile): string[] {
  return compose.services.filter(isStatefulService).map((service) => service.name);
}

export function checkStatefulServices(compose: ComposeFile): Finding[] {
  const findings: Finding[] = [];

  for (const service of compose.services.filter(isStatefulService)) {
    const imageRef = service.imageRef;
    if (!imageRef || imageRef.isDigestPinned) {
      continue;
    }

    if (!imageRef.hasExplicitTag) {
      findings.push({
        ruleId: "STATEFUL_SERVICE_UNPINNED_IMAGE",
        severity: "high",
        service: service.name,
        title: "Stateful service has no explicit image tag",
        description: `Service \`${service.name}\` appears stateful and uses an unpinned image.`,
        evidence: imageRef.raw,
        recommendation: "Pin stateful services to specific versions and verify backup and restore steps before updating."
      });
      continue;
    }

    if (imageRef.tag?.toLowerCase() === "latest") {
      findings.push({
        ruleId: "STATEFUL_SERVICE_LATEST_TAG",
        severity: "high",
        service: service.name,
        title: "Stateful service uses the latest tag",
        description: `Service \`${service.name}\` appears stateful and uses \`${imageRef.raw}\`.`,
        evidence: imageRef.raw,
        recommendation: "Pin the service to a specific version. Review release notes, take a backup, and verify restore steps before upgrading."
      });
      continue;
    }

    if (imageRef.isFloatingTag) {
      findings.push({
        ruleId: "STATEFUL_SERVICE_FLOATING_TAG",
        severity: "medium",
        service: service.name,
        title: "Stateful service uses a floating tag",
        description: `Service \`${service.name}\` appears stateful and uses the floating tag \`${imageRef.tag}\`.`,
        evidence: imageRef.raw,
        recommendation: "Prefer explicit version tags for databases and other stateful services."
      });
    }
  }

  return findings;
}
