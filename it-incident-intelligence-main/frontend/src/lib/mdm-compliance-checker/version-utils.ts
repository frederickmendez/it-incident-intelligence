import type {
  NormalizedVersion,
  VersionComparisonResult,
  VersionParseResult,
} from "./types";

const VERSION_PATTERN = /\b(\d{1,2})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?\b/;

export function parseOsVersion(input: string | null | undefined): VersionParseResult {
  const raw = input?.trim() ?? null;
  if (!raw) {
    return {
      ok: false,
      raw,
      reason: "OS version is missing.",
    };
  }

  const match = raw.match(VERSION_PATTERN);
  if (!match) {
    return {
      ok: false,
      raw,
      reason: `OS version "${raw}" does not contain a parseable numeric version.`,
    };
  }

  const major = Number.parseInt(match[1], 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  const patch = Number.parseInt(match[3] ?? "0", 10);

  if ([major, minor, patch].some((part) => Number.isNaN(part))) {
    return {
      ok: false,
      raw,
      reason: `OS version "${raw}" contains an invalid numeric segment.`,
    };
  }

  return {
    ok: true,
    version: {
      raw,
      major,
      minor,
      patch,
      normalized: `${major}.${minor}.${patch}`,
    },
  };
}

export function compareNormalizedVersions(
  left: NormalizedVersion,
  right: NormalizedVersion
): VersionComparisonResult {
  const leftParts = [left.major, left.minor, left.patch];
  const rightParts = [right.major, right.minor, right.patch];

  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] < rightParts[index]) return -1;
    if (leftParts[index] > rightParts[index]) return 1;
  }

  return 0;
}

export function compareVersions(
  left: string | NormalizedVersion | null | undefined,
  right: string | NormalizedVersion | null | undefined
):
  | { ok: true; result: VersionComparisonResult; left: NormalizedVersion; right: NormalizedVersion }
  | { ok: false; reason: string } {
  const leftResult = typeof left === "string" || left == null ? parseOsVersion(left) : { ok: true as const, version: left };
  const rightResult =
    typeof right === "string" || right == null ? parseOsVersion(right) : { ok: true as const, version: right };

  if (!leftResult.ok) {
    return { ok: false, reason: leftResult.reason };
  }
  if (!rightResult.ok) {
    return { ok: false, reason: rightResult.reason };
  }

  return {
    ok: true,
    result: compareNormalizedVersions(leftResult.version, rightResult.version),
    left: leftResult.version,
    right: rightResult.version,
  };
}
