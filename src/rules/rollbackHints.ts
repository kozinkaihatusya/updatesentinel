import type { ComposeFile, Finding } from "../types";
import { detectStatefulServices } from "./statefulServices";
import { detectRollbackHints } from "./utils";

export function checkRollbackHints(compose: ComposeFile): Finding[] {
  const statefulServices = detectStatefulServices(compose);

  if (statefulServices.length === 0 || detectRollbackHints(compose).length > 0) {
    return [];
  }

  return [
    {
      ruleId: "NO_ROLLBACK_HINT_FOR_STATEFUL_SERVICES",
      severity: "medium",
      service: "stack",
      title: "No rollback hint found for stateful services",
      description: `Stateful services were detected (${statefulServices.join(", ")}), but no obvious rollback, restore, snapshot, previous-version, pinning, or downgrade hint was found.`,
      evidence: statefulServices.join(", "),
      recommendation: "Document rollback steps before upgrading stateful services, including restore commands and the previous known-good image tag."
    }
  ];
}
