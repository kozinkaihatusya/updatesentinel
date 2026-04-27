import { readFileSync } from "node:fs";
import { parse } from "yaml";
import type { ComposeFile, ComposeService } from "./types";
import { parseImageReference } from "./rules/utils";

export function parseComposeFile(filePath: string): ComposeFile {
  return parseComposeContent(readFileSync(filePath, "utf8"), filePath);
}

export function parseComposeContent(rawText: string, filePath = "<inline>"): ComposeFile {
  const document = parse(rawText) as unknown;

  if (!document || typeof document !== "object") {
    throw new Error("Compose file must be a YAML object.");
  }

  const root = document as Record<string, unknown>;
  const servicesObject = root.services;

  if (!servicesObject || typeof servicesObject !== "object" || Array.isArray(servicesObject)) {
    return { filePath, rawText, services: [] };
  }

  const services: ComposeService[] = Object.entries(servicesObject as Record<string, unknown>)
    .filter(([, config]) => config && typeof config === "object" && !Array.isArray(config))
    .map(([name, config]) => {
      const serviceConfig = config as Record<string, unknown>;
      const image = typeof serviceConfig.image === "string" ? serviceConfig.image : undefined;

      return {
        name,
        image,
        imageRef: image ? parseImageReference(image) : undefined,
        config: serviceConfig,
        text: JSON.stringify(serviceConfig),
        environment: normalizeKeyValue(serviceConfig.environment),
        labels: normalizeKeyValue(serviceConfig.labels)
      };
    });

  return { filePath, rawText, services };
}

function normalizeKeyValue(value: unknown): Record<string, string> {
  if (!value) {
    return {};
  }

  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => {
          const separatorIndex = item.indexOf("=");
          if (separatorIndex === -1) {
            return [item, ""];
          }
          return [item.slice(0, separatorIndex), item.slice(separatorIndex + 1)];
        })
    );
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
        key,
        String(entryValue ?? "")
      ])
    );
  }

  return {};
}
