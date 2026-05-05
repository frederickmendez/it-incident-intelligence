export type EnvironmentScenario =
  | "enterprise"
  | "security_stress"
  | "finops_review";

export type EnvironmentScenarioMeta = {
  value: EnvironmentScenario;
  label: string;
  subtitle: string;
  accent:
    | "green"
    | "blue"
    | "orange"
    | "purple"
    | "red"
    | "gold";
  shortLabel: string;
};

export const ENVIRONMENT_SCENARIOS: EnvironmentScenarioMeta[] = [
  {
    value: "enterprise",
    label: "Enterprise Mock",
    subtitle: "Balanced cross-functional operating posture.",
    accent: "green",
    shortLabel: "Balanced",
  },
  {
    value: "security_stress",
    label: "Security Stress Mock",
    subtitle: "Elevated threat, endpoint drift, and urgent response pressure.",
    accent: "red",
    shortLabel: "Threat Surge",
  },
  {
    value: "finops_review",
    label: "FinOps Review Mock",
    subtitle: "Cloud waste, optimization pressure, and savings review mode.",
    accent: "gold",
    shortLabel: "Savings Push",
  },
];

export function normalizeEnvironmentScenario(
  value: string | string[] | undefined
): EnvironmentScenario {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    candidate === "enterprise" ||
    candidate === "security_stress" ||
    candidate === "finops_review"
  ) {
    return candidate;
  }

  return "enterprise";
}

export function getEnvironmentScenarioMeta(
  scenario: EnvironmentScenario
): EnvironmentScenarioMeta {
  return (
    ENVIRONMENT_SCENARIOS.find((item) => item.value === scenario) ??
    ENVIRONMENT_SCENARIOS[0]
  );
}

export function withEnvironmentScenario(
  pathname: string,
  scenario: EnvironmentScenario
): string {
  return `${pathname}?env=${scenario}`;
}
