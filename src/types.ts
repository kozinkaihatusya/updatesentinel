export type Severity = "high" | "medium" | "low";

export interface ImageReference {
  raw: string;
  name: string;
  tag?: string;
  digest?: string;
  hasExplicitTag: boolean;
  isDigestPinned: boolean;
  isSemverPinned: boolean;
  isFloatingTag: boolean;
}

export interface ComposeService {
  name: string;
  image?: string;
  imageRef?: ImageReference;
  config: Record<string, unknown>;
  text: string;
  environment: Record<string, string>;
  labels: Record<string, string>;
}

export interface ComposeFile {
  filePath: string;
  rawText: string;
  services: ComposeService[];
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  service: string;
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
}

export interface HintSummary {
  backup: string[];
  update: string[];
  rollback: string[];
}

export interface AutomationDetection {
  service: string;
  image?: string;
  kind: "auto-update" | "monitor";
  evidence: string;
  detail: string;
}

export interface ScanResult {
  filePath: string;
  services: ComposeService[];
  findings: Finding[];
  hints: HintSummary;
  autoUpdateServices: AutomationDetection[];
  statefulServices: string[];
}

export type Rule = (compose: ComposeFile) => Finding[];
