import type { ScanResult, Severity } from "./types";

export type FailOnThreshold = Severity | "none";

const THRESHOLD_RANK: Record<FailOnThreshold, number> = {
  none: 4,
  high: 3,
  medium: 2,
  low: 1
};

const SEVERITY_RANK: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export const FAIL_ON_THRESHOLDS: FailOnThreshold[] = ["high", "medium", "low", "none"];

export function parseFailOnThreshold(value: string): FailOnThreshold | undefined {
  return FAIL_ON_THRESHOLDS.includes(value as FailOnThreshold) ? (value as FailOnThreshold) : undefined;
}

export function violatesFailOnThreshold(result: ScanResult, threshold: FailOnThreshold): boolean {
  if (threshold === "none") {
    return false;
  }

  const minimumRank = THRESHOLD_RANK[threshold];
  return result.findings.some((finding) => SEVERITY_RANK[finding.severity] >= minimumRank);
}

export function getExitCodeForFailOn(result: ScanResult, threshold: FailOnThreshold): 0 | 1 {
  return violatesFailOnThreshold(result, threshold) ? 1 : 0;
}
