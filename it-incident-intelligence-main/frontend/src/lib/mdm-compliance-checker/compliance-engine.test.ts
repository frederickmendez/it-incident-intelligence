import { describe, expect, it } from "vitest";
import { mdmComplianceDevices } from "@/data/mock/mdm-compliance-checker/mock";
import { evaluateComplianceFleet, evaluateDeviceCompliance } from "./compliance-engine";
import { macOsCompliancePolicy } from "./policy";
import { compareVersions, parseOsVersion } from "./version-utils";

function findDevice(deviceId: string) {
  const device = mdmComplianceDevices.find((item) => item.device_id === deviceId);
  if (!device) {
    throw new Error(`Missing test device: ${deviceId}`);
  }
  return device;
}

describe("version-utils", () => {
  it("normalizes macOS version strings before comparison", () => {
    expect(parseOsVersion("macOS 13.5.1")).toMatchObject({
      ok: true,
      version: { major: 13, minor: 5, patch: 1, normalized: "13.5.1" },
    });
    expect(parseOsVersion("14.4")).toMatchObject({
      ok: true,
      version: { major: 14, minor: 4, patch: 0, normalized: "14.4.0" },
    });
    expect(compareVersions("14.4", "14.4.0")).toMatchObject({ ok: true, result: 0 });
    expect(compareVersions("macOS 13.5.1", "14.4.0")).toMatchObject({ ok: true, result: -1 });
  });

  it("surfaces malformed or missing versions without throwing", () => {
    expect(parseOsVersion(null)).toMatchObject({ ok: false, reason: "OS version is missing." });
    expect(parseOsVersion("macOS Ventura build 22G90")).toMatchObject({ ok: false });
  });
});

describe("evaluateDeviceCompliance", () => {
  it("returns compliant when every required macOS policy check passes", () => {
    const result = evaluateDeviceCompliance(findDevice("mac-eng-450"), macOsCompliancePolicy);

    expect(result.status).toBe("compliant");
    expect(result.reasons).toContain("SFO-ENG-MBP-450 satisfies all required macOS compliance checks.");
    expect(result.rule_hits.every((ruleHit) => ruleHit.status === "compliant")).toBe(true);
  });

  it("returns non_compliant for explicit failing evidence or below-minimum OS versions", () => {
    const result = evaluateDeviceCompliance(findDevice("mac-legal-118"), macOsCompliancePolicy);

    expect(result.status).toBe("non_compliant");
    expect(result.reasons.some((reason) => reason.includes("below required 14.4.0"))).toBe(true);
    expect(result.reasons.some((reason) => reason.includes("FileVault encryption"))).toBe(true);
  });

  it("returns warning when required evidence is missing but no required check explicitly fails", () => {
    const result = evaluateDeviceCompliance(findDevice("mac-ops-777"), macOsCompliancePolicy);

    expect(result.status).toBe("warning");
    expect(result.reasons).toEqual(["SEA-OPS-MBP-777 is missing evidence for required check: Firewall."]);
  });

  it("returns warning when macOS version evidence is malformed", () => {
    const result = evaluateDeviceCompliance(findDevice("mac-sec-999"), macOsCompliancePolicy);

    expect(result.status).toBe("warning");
    expect(result.reasons.some((reason) => reason.includes("does not contain a parseable numeric version"))).toBe(true);
  });

  it("returns warning for devices outside the macOS policy scope", () => {
    const result = evaluateDeviceCompliance(findDevice("win-ops-840"), macOsCompliancePolicy);

    expect(result.status).toBe("warning");
    expect(result.reasons[0]).toContain("applies to macOS devices only");
  });
});

describe("evaluateComplianceFleet", () => {
  it("summarizes compliant, warning, and non_compliant results", () => {
    const result = evaluateComplianceFleet(mdmComplianceDevices, macOsCompliancePolicy);

    expect(result.summary.total_devices).toBe(mdmComplianceDevices.length);
    expect(result.summary.compliant).toBeGreaterThanOrEqual(1);
    expect(result.summary.warning).toBeGreaterThanOrEqual(1);
    expect(result.summary.non_compliant).toBeGreaterThanOrEqual(1);
  });
});

