import type { AutomationDetection, Finding, ScanResult, Severity } from "../types";
import { getToolVersion } from "../version";

interface JsonImageEntry {
  service: string;
  image: string;
  tag: string | null;
  isPinned: boolean;
  isDigestPinned: boolean;
  isLatest: boolean;
  isFloating: boolean;
  riskLevel: Severity;
}

interface JsonReport {
  toolName: "UpdateSentinel";
  toolVersion: string;
  scannedFile: string;
  generatedAt: string;
  summary: {
    totalServices: number;
    totalImages: number;
    unpinnedImageCount: number;
    latestTagCount: number;
    floatingTagCount: number;
    statefulServicesCount: number;
    autoUpdateServicesCount: number;
    totalFindings: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  images: JsonImageEntry[];
  statefulServices: string[];
  autoUpdateServices: AutomationDetection[];
  backupHints: string[];
  rollbackHints: string[];
  findings: Finding[];
}

interface JsonReportOptions {
  generatedAt?: string;
  toolVersion?: string;
}

export function renderJsonReport(result: ScanResult, options: JsonReportOptions = {}): string {
  return `${JSON.stringify(buildJsonReport(result, options), null, 2)}\n`;
}

export function buildJsonReport(result: ScanResult, options: JsonReportOptions = {}): JsonReport {
  const images = result.services
    .filter((service) => service.image && service.imageRef)
    .map((service) => {
      const imageRef = service.imageRef!;
      const isLatest = imageRef.tag?.toLowerCase() === "latest";
      const isPinned = imageRef.isDigestPinned || (imageRef.hasExplicitTag && !imageRef.isFloatingTag);

      return {
        service: service.name,
        image: imageRef.raw,
        tag: imageRef.tag ?? null,
        isPinned,
        isDigestPinned: imageRef.isDigestPinned,
        isLatest,
        isFloating: imageRef.isFloatingTag,
        riskLevel: getImageRiskLevel(result, service.name)
      };
    });

  return {
    toolName: "UpdateSentinel",
    toolVersion: options.toolVersion ?? getToolVersion(),
    scannedFile: result.filePath,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    summary: {
      totalServices: result.services.length,
      totalImages: images.length,
      unpinnedImageCount: images.filter((image) => !image.isPinned && !image.isDigestPinned && image.tag === null).length,
      latestTagCount: images.filter((image) => image.isLatest).length,
      floatingTagCount: images.filter((image) => image.isFloating).length,
      statefulServicesCount: result.statefulServices.length,
      autoUpdateServicesCount: result.autoUpdateServices.filter((service) => service.kind === "auto-update").length,
      totalFindings: result.findings.length,
      highCount: countFindings(result, "high"),
      mediumCount: countFindings(result, "medium"),
      lowCount: countFindings(result, "low")
    },
    images,
    statefulServices: result.statefulServices,
    autoUpdateServices: result.autoUpdateServices,
    backupHints: result.hints.backup,
    rollbackHints: result.hints.rollback,
    findings: result.findings.map((finding) => ({
      ruleId: finding.ruleId,
      severity: finding.severity,
      service: finding.service,
      title: finding.title,
      description: finding.description,
      evidence: finding.evidence,
      recommendation: finding.recommendation
    }))
  };
}

function getImageRiskLevel(result: ScanResult, serviceName: string): Severity {
  const service = result.services.find((entry) => entry.name === serviceName);
  const imageRef = service?.imageRef;

  if (!service || !imageRef || imageRef.isDigestPinned) {
    return "low";
  }

  const isStateful = result.statefulServices.includes(service.name);
  const isLatest = imageRef.tag?.toLowerCase() === "latest";
  const isUnpinned = !imageRef.hasExplicitTag && !imageRef.isDigestPinned;

  if (isStateful && (isLatest || isUnpinned)) {
    return "high";
  }

  if (imageRef.isFloatingTag || isUnpinned) {
    return "medium";
  }

  return "low";
}

function countFindings(result: ScanResult, severity: Severity): number {
  return result.findings.filter((finding) => finding.severity === severity).length;
}
