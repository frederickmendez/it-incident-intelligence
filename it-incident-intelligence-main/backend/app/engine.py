from __future__ import annotations

import csv
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from pathlib import Path

from .schemas import IncidentSummary, RecurringProblem, TicketPriority, TrendPoint

KEYWORD_BUCKETS: dict[str, tuple[str, ...]] = {
    "access": ("login", "access", "mfa", "permission", "password"),
    "network": ("vpn", "latency", "packet", "dns", "network", "disconnect"),
    "email": ("email", "outlook", "mailbox", "smtp"),
    "infrastructure": ("server", "vm", "cpu", "memory", "disk", "storage"),
    "application": ("error", "timeout", "crash", "deploy", "portal", "service"),
}

IMPACT_WEIGHTS = {"critical": 35, "high": 30, "medium": 18, "low": 8}
URGENCY_WEIGHTS = {"critical": 30, "high": 24, "medium": 12, "low": 6}
CRITICAL_SERVICES = {"identity", "network core", "payments", "customer portal"}
URGENT_TERMS = ("outage", "down", "unavailable", "failed", "breach", "offline")


@dataclass(frozen=True)
class Ticket:
    ticket_id: str
    created_at: datetime
    category: str
    service: str
    priority: str
    title: str
    description: str
    status: str
    impact: str
    urgency: str
    keyword_bucket: str
    signature: str


class IncidentEngine:
    def __init__(self, csv_path: Path) -> None:
        self.csv_path = csv_path
        self._tickets = self._load_tickets()
        self._ticket_by_id = {ticket.ticket_id: ticket for ticket in self._tickets}
        self._signature_counts = Counter(ticket.signature for ticket in self._tickets)

    def _load_tickets(self) -> list[Ticket]:
        with self.csv_path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            records = list(reader)

        required = {
            "ticket_id",
            "created_at",
            "category",
            "service",
            "priority",
            "title",
            "description",
            "status",
            "impact",
            "urgency",
        }
        if not records:
            return []
        missing = [field for field in required if field not in records[0]]
        if missing:
            raise ValueError(f"Missing required ticket columns: {', '.join(sorted(missing))}")

        tickets: list[Ticket] = []
        for row in records:
            created_at = _parse_datetime(row.get("created_at", ""))
            if created_at is None:
                continue

            title = row.get("title", "").strip()
            description = row.get("description", "").strip()
            category = row.get("category", "Unknown").strip() or "Unknown"
            service = row.get("service", "Unknown").strip() or "Unknown"
            status = (row.get("status", "Open").strip() or "Open").title()
            impact = (row.get("impact", "low").strip() or "low").lower()
            urgency = (row.get("urgency", "low").strip() or "low").lower()
            priority = (row.get("priority", "P4").strip() or "P4").upper()
            keyword_bucket = _keyword_bucket(title, description)
            signature = f"{category.lower()}|{service.lower()}|{keyword_bucket}"

            tickets.append(
                Ticket(
                    ticket_id=str(row.get("ticket_id", "")).strip(),
                    created_at=created_at,
                    category=category,
                    service=service,
                    priority=priority,
                    title=title,
                    description=description,
                    status=status,
                    impact=impact,
                    urgency=urgency,
                    keyword_bucket=keyword_bucket,
                    signature=signature,
                )
            )

        tickets.sort(key=lambda ticket: ticket.created_at)
        return tickets

    def recurring_problems(self, window_days: int = 30, limit: int = 20) -> list[RecurringProblem]:
        today = datetime.now(UTC).date()
        window_start = today - timedelta(days=window_days - 1)
        previous_start = window_start - timedelta(days=window_days)
        previous_end = window_start - timedelta(days=1)

        current = [ticket for ticket in self._tickets if ticket.created_at.date() >= window_start]
        previous = [
            ticket
            for ticket in self._tickets
            if previous_start <= ticket.created_at.date() <= previous_end
        ]

        previous_counts = Counter(ticket.signature for ticket in previous)
        grouped: dict[str, dict[str, object]] = {}

        for ticket in current:
            bucket = grouped.setdefault(
                ticket.signature,
                {
                    "signature": ticket.signature,
                    "category": ticket.category,
                    "service": ticket.service,
                    "keyword_bucket": ticket.keyword_bucket,
                    "frequency": 0,
                    "last_seen": ticket.created_at,
                    "sample_ticket_ids": [],
                    "sample_titles": [],
                },
            )
            bucket["frequency"] = int(bucket["frequency"]) + 1
            if ticket.created_at > bucket["last_seen"]:
                bucket["last_seen"] = ticket.created_at
            if len(bucket["sample_ticket_ids"]) < 3:
                bucket["sample_ticket_ids"].append(ticket.ticket_id)
            if len(bucket["sample_titles"]) < 3:
                bucket["sample_titles"].append(ticket.title)

        sorted_groups = sorted(
            grouped.values(),
            key=lambda row: (int(row["frequency"]), row["last_seen"]),
            reverse=True,
        )[:limit]

        rows: list[RecurringProblem] = []
        for row in sorted_groups:
            previous_frequency = previous_counts.get(str(row["signature"]), 0)
            rows.append(
                RecurringProblem(
                    signature=str(row["signature"]),
                    category=str(row["category"]),
                    service=str(row["service"]),
                    keyword_bucket=str(row["keyword_bucket"]),
                    frequency=int(row["frequency"]),
                    last_seen=row["last_seen"].date(),
                    trend_delta=int(row["frequency"]) - int(previous_frequency),
                    sample_ticket_ids=list(row["sample_ticket_ids"]),
                    sample_titles=list(row["sample_titles"]),
                )
            )
        return rows

    def priority_for_ticket(self, ticket_id: str) -> TicketPriority | None:
        ticket = self._ticket_by_id.get(ticket_id)
        if ticket is None:
            return None
        recurrence_count = self._signature_counts[ticket.signature]
        return _build_priority_record(ticket, recurrence_count)

    def batch_priority(self, ticket_ids: list[str] | None = None, limit: int = 50) -> list[TicketPriority]:
        if ticket_ids:
            selected = [ticket for ticket in self._tickets if ticket.ticket_id in set(ticket_ids)]
        else:
            open_tickets = [ticket for ticket in self._tickets if ticket.status.lower() != "resolved"]
            selected = sorted(open_tickets, key=lambda ticket: ticket.created_at, reverse=True)[:limit]

        records = [
            _build_priority_record(ticket, self._signature_counts[ticket.signature])
            for ticket in selected
        ]
        return sorted(records, key=lambda row: row.score, reverse=True)

    def summary(self) -> IncidentSummary:
        open_count = sum(1 for ticket in self._tickets if ticket.status.lower() != "resolved")
        recurring = self.recurring_problems(window_days=30, limit=100)
        high_risk = [item for item in self.batch_priority(limit=500) if item.score >= 75]

        top_services = [
            item[0]
            for item in Counter(ticket.service for ticket in self._tickets).most_common(3)
        ]

        today = datetime.now(UTC).date()
        start = today - timedelta(days=9)
        counts_by_day: dict[date, int] = defaultdict(int)
        for ticket in self._tickets:
            day = ticket.created_at.date()
            if day >= start:
                counts_by_day[day] += 1

        trends = [
            TrendPoint(date=start + timedelta(days=offset), count=counts_by_day.get(start + timedelta(days=offset), 0))
            for offset in range(10)
        ]

        return IncidentSummary(
            open_tickets=open_count,
            recurring_clusters=len(recurring),
            high_risk_tickets=len(high_risk),
            top_services=top_services,
            trends=trends,
        )


def _parse_datetime(value: str) -> datetime | None:
    candidate = value.strip()
    if not candidate:
        return None
    normalized = candidate.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(normalized).astimezone(UTC)
    except ValueError:
        return None


def _keyword_bucket(title: str, description: str) -> str:
    haystack = f"{title} {description}".lower()
    for bucket, terms in KEYWORD_BUCKETS.items():
        if any(term in haystack for term in terms):
            return bucket
    return "general"


def _build_priority_record(ticket: Ticket, recurrence_count: int) -> TicketPriority:
    reasons: list[str] = []
    score = 0

    impact = ticket.impact
    impact_score = IMPACT_WEIGHTS.get(impact, IMPACT_WEIGHTS["low"])
    score += impact_score
    reasons.append(f"impact={impact} (+{impact_score})")

    urgency = ticket.urgency
    urgency_score = URGENCY_WEIGHTS.get(urgency, URGENCY_WEIGHTS["low"])
    score += urgency_score
    reasons.append(f"urgency={urgency} (+{urgency_score})")

    service_name = ticket.service.lower()
    if service_name in CRITICAL_SERVICES:
        score += 18
        reasons.append("critical service exposure (+18)")

    recurrence_bonus = min(25, max(0, (recurrence_count - 1) * 4))
    if recurrence_bonus:
        score += recurrence_bonus
        reasons.append(f"recurring pattern x{recurrence_count} (+{recurrence_bonus})")

    text = f"{ticket.title} {ticket.description}".lower()
    urgent_hits = [term for term in URGENT_TERMS if term in text]
    if urgent_hits:
        boost = min(15, len(set(urgent_hits)) * 5)
        score += boost
        reasons.append(f"urgent wording ({', '.join(sorted(set(urgent_hits)))}) (+{boost})")

    score = min(score, 100)
    if score >= 80:
        bucket = "P1"
    elif score >= 65:
        bucket = "P2"
    elif score >= 45:
        bucket = "P3"
    else:
        bucket = "P4"

    return TicketPriority(
        ticket_id=ticket.ticket_id,
        title=ticket.title,
        category=ticket.category,
        service=ticket.service,
        status=ticket.status,
        score=score,
        recommended_priority=bucket,
        reasons=reasons,
    )
