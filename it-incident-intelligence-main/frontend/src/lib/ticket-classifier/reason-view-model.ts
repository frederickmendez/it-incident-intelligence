export type TicketReasonTone =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "gold";

export type TicketReasonToken = {
  key: string;
  label: string;
  value: string;
  tone: TicketReasonTone;
};

export function buildTicketReasonTokens(
  classificationReason: string
): TicketReasonToken[] {
  return classificationReason
    .split("|")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token, index) => mapReasonToken(token, index));
}

function mapReasonToken(token: string, index: number): TicketReasonToken {
  const normalized = token.toLowerCase();

  if (normalized.startsWith("impact=")) {
    return {
      key: `impact-${index}`,
      label: "Impact",
      value: token.split("=")[1] ?? "",
      tone: "red",
    };
  }

  if (normalized.startsWith("urgency=")) {
    return {
      key: `urgency-${index}`,
      label: "Urgency",
      value: token.split("=")[1] ?? "",
      tone: "orange",
    };
  }

  if (normalized === "customer-facing") {
    return {
      key: `customer-${index}`,
      label: "Customer",
      value: "Facing",
      tone: "blue",
    };
  }

  if (normalized === "security-related") {
    return {
      key: `security-${index}`,
      label: "Security",
      value: "Related",
      tone: "purple",
    };
  }

  if (normalized === "vip requester") {
    return {
      key: `vip-${index}`,
      label: "VIP",
      value: "Requester",
      tone: "gold",
    };
  }

  if (normalized.startsWith("users=")) {
    return {
      key: `users-${index}`,
      label: "Users",
      value: token.split("=")[1] ?? "",
      tone: "green",
    };
  }

  if (normalized.startsWith("score=")) {
    return {
      key: `score-${index}`,
      label: "Score",
      value: token.split("=")[1] ?? "",
      tone: "green",
    };
  }

  return {
    key: `reason-${index}`,
    label: "Signal",
    value: token,
    tone: "blue",
  };
}
