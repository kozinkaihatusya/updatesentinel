import type { ComposeFile, ComposeService, ImageReference } from "../types";

export const FLOATING_TAG_KEYWORDS = [
  "latest",
  "stable",
  "edge",
  "dev",
  "nightly",
  "main",
  "master",
  "rolling",
  "current",
  "beta",
  "alpha"
];

export const STATEFUL_KEYWORDS = [
  "postgres",
  "postgresql",
  "mysql",
  "mariadb",
  "mongodb",
  "mongo",
  "redis",
  "elasticsearch",
  "opensearch",
  "couchdb",
  "influxdb",
  "timescaledb",
  "cockroach",
  "vaultwarden",
  "gitea",
  "nextcloud",
  "immich",
  "jellyfin",
  "homeassistant",
  "paperless"
];

export const BACKUP_HINT_KEYWORDS = [
  "backup",
  "restic",
  "borg",
  "kopia",
  "duplicati",
  "backrest",
  "pgbackrest",
  "dump",
  "mysqldump",
  "mongodump",
  "rclone",
  "rsync",
  "snapshot",
  "snapshots"
];

export const UPDATE_HINT_KEYWORDS = [
  "update",
  "upgrade",
  "watchtower",
  "renovate",
  "dependabot",
  "diun",
  "release",
  "changelog"
];

export const ROLLBACK_HINT_KEYWORDS = [
  "rollback",
  "restore",
  "backup",
  "snapshot",
  "previous",
  "pin",
  "pinned",
  "downgrade"
];

export function parseImageReference(image: string): ImageReference {
  const raw = image.trim();
  const atIndex = raw.indexOf("@");
  const beforeDigest = atIndex >= 0 ? raw.slice(0, atIndex) : raw;
  const digest = atIndex >= 0 ? raw.slice(atIndex + 1) : undefined;
  const lastSlash = beforeDigest.lastIndexOf("/");
  const lastColon = beforeDigest.lastIndexOf(":");
  const hasTag = lastColon > lastSlash;
  const tag = hasTag ? beforeDigest.slice(lastColon + 1) : undefined;
  const name = hasTag ? beforeDigest.slice(0, lastColon) : beforeDigest;
  const lowerTag = tag?.toLowerCase();

  return {
    raw,
    name,
    tag,
    digest,
    hasExplicitTag: Boolean(tag),
    isDigestPinned: Boolean(digest?.toLowerCase().startsWith("sha256:")),
    isSemverPinned: Boolean(tag && /^v?\d+(?:\.\d+){1,3}(?:[-+][0-9A-Za-z.-]+)?$/.test(tag)),
    isFloatingTag: Boolean(lowerTag && FLOATING_TAG_KEYWORDS.includes(lowerTag))
  };
}

export function findKeywordsInText(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return uniqueSorted(keywords.filter((keyword) => lower.includes(keyword.toLowerCase())));
}

export function detectBackupHints(compose: ComposeFile): string[] {
  return findKeywordsInText(compose.rawText, BACKUP_HINT_KEYWORDS);
}

export function detectUpdateHints(compose: ComposeFile): string[] {
  return findKeywordsInText(compose.rawText, UPDATE_HINT_KEYWORDS);
}

export function detectRollbackHints(compose: ComposeFile): string[] {
  return findKeywordsInText(compose.rawText, ROLLBACK_HINT_KEYWORDS);
}

export function isStatefulService(service: ComposeService): boolean {
  const haystack = `${service.name} ${service.image ?? ""}`.toLowerCase();
  return STATEFUL_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function describePinning(imageRef?: ImageReference): string {
  if (!imageRef) {
    return "no image";
  }

  if (imageRef.isDigestPinned) {
    return "digest-pinned";
  }

  if (!imageRef.hasExplicitTag) {
    return "unpinned";
  }

  if (imageRef.isFloatingTag) {
    return `floating:${imageRef.tag}`;
  }

  if (imageRef.isSemverPinned) {
    return "semver-pinned";
  }

  return `tag:${imageRef.tag}`;
}
