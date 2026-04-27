import type { ComposeFile, Finding } from "../types";
import { detectUpdateHints } from "./utils";

export function checkUpdateHints(compose: ComposeFile): Finding[] {
  if (compose.services.length === 0 || detectUpdateHints(compose).length > 0) {
    return [];
  }

  return [
    {
      ruleId: "NO_UPDATE_STRATEGY_HINT",
      severity: "low",
      service: "stack",
      title: "No update strategy hint found",
      description: "No obvious update, release, changelog, Renovate, Dependabot, Watchtower, or DIUN hint was found in the Compose file.",
      evidence: "No update hint keywords detected",
      recommendation: "Document how updates are discovered and reviewed for this stack."
    }
  ];
}
