import type { Finding, ScanResult, Severity } from "../types";
import { describePinning } from "../rules/utils";

const SEVERITIES: Severity[] = ["high", "medium", "low"];

export function renderMarkdownReport(result: ScanResult): string {
  const lines: string[] = [];
  const imageCount = result.services.filter((service) => service.image).length;

  lines.push("# UpdateSentinel Report");
  lines.push("");
  lines.push(`Scanned file: \`${result.filePath}\``);
  lines.push("");
  lines.push(`Total services: ${result.services.length}`);
  lines.push(`Total images: ${imageCount}`);
  lines.push(`Total findings: ${result.findings.length}`);
  lines.push("");
  lines.push("> Risk classification is based on local Docker Compose configuration heuristics. UpdateSentinel does not update containers, pull images, query registries, or contact running containers.");
  lines.push("");

  lines.push("## Image Summary");
  lines.push("");
  lines.push("| Service | Image | Pinning |");
  lines.push("| --- | --- | --- |");
  for (const service of result.services) {
    lines.push(`| \`${escapeTable(service.name)}\` | ${service.image ? `\`${escapeTable(service.image)}\`` : "_none_"} | ${describePinning(service.imageRef)} |`);
  }
  lines.push("");

  lines.push("## Auto-update Services Detected");
  lines.push("");
  if (result.autoUpdateServices.length === 0) {
    lines.push("None detected.");
  } else {
    for (const detection of result.autoUpdateServices) {
      lines.push(`- \`${detection.service}\`: ${detection.kind} (${detection.evidence})`);
    }
  }
  lines.push("");

  lines.push("## Stateful Services Detected");
  lines.push("");
  if (result.statefulServices.length === 0) {
    lines.push("None detected.");
  } else {
    for (const service of result.statefulServices) {
      lines.push(`- \`${service}\``);
    }
  }
  lines.push("");

  lines.push("## Hints Detected");
  lines.push("");
  lines.push(`- Backup hints: ${formatHintList(result.hints.backup)}`);
  lines.push(`- Update hints: ${formatHintList(result.hints.update)}`);
  lines.push(`- Rollback hints: ${formatHintList(result.hints.rollback)}`);
  lines.push("");

  for (const severity of SEVERITIES) {
    const findings = result.findings.filter((finding) => finding.severity === severity);
    lines.push(`## ${severity.toUpperCase()} Risk`);
    lines.push("");

    if (findings.length === 0) {
      lines.push("No findings.");
      lines.push("");
      continue;
    }

    for (const finding of findings) {
      pushFinding(lines, finding);
    }
  }

  lines.push("## Update Readiness Checklist");
  lines.push("");
  lines.push("- [ ] Pin image versions.");
  lines.push("- [ ] Avoid latest for stateful services.");
  lines.push("- [ ] Review changelogs before updating.");
  lines.push("- [ ] Take backups before updating stateful services.");
  lines.push("- [ ] Run restore tests.");
  lines.push("- [ ] Roll out updates gradually.");
  lines.push("- [ ] Document rollback steps.");
  lines.push("- [ ] Avoid blind auto-updates for databases.");
  lines.push("");

  lines.push("## Limitations");
  lines.push("");
  lines.push("- Heuristic checks based on Docker Compose configuration only.");
  lines.push("- No registry lookup in the MVP.");
  lines.push("- No CVE scanning in the MVP.");
  lines.push("- No Kubernetes support in the MVP.");
  lines.push("- No hosted dashboard in the MVP.");
  lines.push("- No actual update execution.");
  lines.push("- Does not replace release-note review, tested backups, restore drills, or staged rollouts.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function pushFinding(lines: string[], finding: Finding): void {
  lines.push(`### ${finding.title}`);
  lines.push("");
  lines.push(`Service: \`${finding.service}\``);
  lines.push(`Rule: \`${finding.ruleId}\``);
  lines.push(`Severity: \`${finding.severity}\``);
  lines.push("");
  lines.push("Description:");
  lines.push(finding.description);
  lines.push("");
  lines.push("Evidence:");
  lines.push(`\`${finding.evidence}\``);
  lines.push("");
  lines.push("Recommendation:");
  lines.push(finding.recommendation);
  lines.push("");
}

function formatHintList(hints: string[]): string {
  if (hints.length === 0) {
    return "none detected";
  }

  return hints.map((hint) => `\`${hint}\``).join(", ");
}

function escapeTable(value: string): string {
  return value.replace(/\|/g, "\\|");
}
