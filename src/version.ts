import { readFileSync } from "node:fs";
import { join } from "node:path";

interface PackageJson {
  version?: string;
}

export function getToolVersion(): string {
  try {
    const packageJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8")) as PackageJson;
    return packageJson.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}
