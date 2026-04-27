import type { ComposeFile, Finding } from "../types";

export function checkImageTags(compose: ComposeFile): Finding[] {
  const findings: Finding[] = [];

  for (const service of compose.services) {
    const imageRef = service.imageRef;
    if (!imageRef) {
      continue;
    }

    if (imageRef.isDigestPinned) {
      findings.push({
        ruleId: "IMAGE_DIGEST_PINNED",
        severity: "low",
        service: service.name,
        title: "Image is digest-pinned",
        description: `Service \`${service.name}\` uses a sha256 digest, which minimizes tag drift.`,
        evidence: imageRef.raw,
        recommendation: "Keep the digest update process documented and review upstream release notes before changing it."
      });
      continue;
    }

    if (!imageRef.hasExplicitTag) {
      findings.push({
        ruleId: "IMAGE_UNPINNED",
        severity: "medium",
        service: service.name,
        title: "Image has no explicit tag",
        description: `Service \`${service.name}\` does not specify an image tag or digest.`,
        evidence: imageRef.raw,
        recommendation: "Pin the image to a specific version tag or digest before routine updates."
      });
      continue;
    }

    if (imageRef.tag?.toLowerCase() === "latest") {
      findings.push({
        ruleId: "IMAGE_LATEST_TAG",
        severity: "medium",
        service: service.name,
        title: "Image uses the latest tag",
        description: `Service \`${service.name}\` uses \`${imageRef.raw}\`, which can change without an explicit version decision.`,
        evidence: imageRef.raw,
        recommendation: "Replace latest with a specific version and review changelogs before upgrading."
      });
      continue;
    }

    if (imageRef.isSemverPinned) {
      findings.push({
        ruleId: "IMAGE_SEMVER_PINNED",
        severity: "low",
        service: service.name,
        title: "Image is semver-pinned",
        description: `Service \`${service.name}\` uses a specific semantic version tag.`,
        evidence: imageRef.raw,
        recommendation: "Keep using explicit version tags and update intentionally after reading release notes."
      });
    }
  }

  return findings;
}
