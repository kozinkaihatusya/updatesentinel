import type { ComposeFile, Finding } from "../types";
import { FLOATING_TAG_KEYWORDS } from "./utils";

export function checkFloatingTags(compose: ComposeFile): Finding[] {
  const findings: Finding[] = [];

  for (const service of compose.services) {
    const imageRef = service.imageRef;
    const lowerTag = imageRef?.tag?.toLowerCase();
    if (!imageRef || !lowerTag || lowerTag === "latest") {
      continue;
    }

    if (FLOATING_TAG_KEYWORDS.includes(lowerTag)) {
      findings.push({
        ruleId: "FLOATING_IMAGE_TAG",
        severity: "medium",
        service: service.name,
        title: `Image uses floating tag ${lowerTag}`,
        description: `Service \`${service.name}\` uses \`${imageRef.raw}\`, and \`${lowerTag}\` is commonly moved by upstream maintainers.`,
        evidence: imageRef.raw,
        recommendation: "Use a specific release version or digest for predictable updates."
      });
    }
  }

  return findings;
}
