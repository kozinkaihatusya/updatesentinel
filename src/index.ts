import { parseComposeContent, parseComposeFile } from "./parser";
import { renderMarkdownReport } from "./report/markdown";
import type { ComposeFile, HintSummary, Rule, ScanResult } from "./types";
import { checkAutoUpdateServices, detectAutomationServices } from "./rules/autoUpdateServices";
import { checkBackupHints } from "./rules/backupHints";
import { checkFloatingTags } from "./rules/floatingTags";
import { checkImageTags } from "./rules/imageTags";
import { checkRollbackHints } from "./rules/rollbackHints";
import { detectStatefulServices, checkStatefulServices } from "./rules/statefulServices";
import { checkUpdateHints } from "./rules/updateHints";
import { detectBackupHints, detectRollbackHints, detectUpdateHints } from "./rules/utils";

const RULES: Rule[] = [
  checkImageTags,
  checkFloatingTags,
  checkAutoUpdateServices,
  checkStatefulServices,
  checkBackupHints,
  checkUpdateHints,
  checkRollbackHints
];

export function scanComposeFile(filePath: string): ScanResult {
  return scanCompose(parseComposeFile(filePath));
}

export function scanComposeContent(rawText: string, filePath = "<inline>"): ScanResult {
  return scanCompose(parseComposeContent(rawText, filePath));
}

export function scanCompose(compose: ComposeFile): ScanResult {
  const findings = RULES.flatMap((rule) => rule(compose));
  const hints: HintSummary = {
    backup: detectBackupHints(compose),
    update: detectUpdateHints(compose),
    rollback: detectRollbackHints(compose)
  };

  return {
    filePath: compose.filePath,
    services: compose.services,
    findings,
    hints,
    autoUpdateServices: detectAutomationServices(compose),
    statefulServices: detectStatefulServices(compose)
  };
}

export { parseComposeContent, parseComposeFile, renderMarkdownReport };
export type { AutomationDetection, ComposeFile, ComposeService, Finding, HintSummary, ImageReference, ScanResult, Severity } from "./types";
