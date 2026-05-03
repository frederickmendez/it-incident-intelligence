export type DevicePlatform = "macos" | "windows" | "ios" | "android";

export type DeviceOwnership = "corporate" | "byod";

export type DeviceManagementState = "managed" | "supervised" | "partially_managed" | "unenrolled";

export type DeviceSecuritySignal =
  | "disk_not_encrypted"
  | "firewall_disabled"
  | "os_outdated"
  | "jailbreak_or_root_detected"
  | "missing_endpoint_protection"
  | "missing_screen_lock"
  | "mdm_checkin_stale"
  | "unknown_compliance_state";

export type DeviceUser = {
  id: string;
  display_name: string;
  email: string;
  department: string;
  role: string;
};

export type SecurityPosture = {
  encryption_enabled: boolean | null;
  firewall_enabled: boolean | null;
  endpoint_protection_enabled: boolean | null;
  screen_lock_enabled: boolean | null;
  jailbreak_or_root_detected: boolean;
  os_version: string;
  os_release_age_days: number;
  last_mdm_checkin_at: string;
};

export type ManagedDevice = {
  id: string;
  hostname: string;
  platform: DevicePlatform;
  ownership: DeviceOwnership;
  management_state: DeviceManagementState;
  serial_number: string;
  assigned_user: DeviceUser;
  business_criticality: "critical" | "high" | "medium" | "low";
  posture: SecurityPosture;
  security_signals: DeviceSecuritySignal[];
  location: string;
};

