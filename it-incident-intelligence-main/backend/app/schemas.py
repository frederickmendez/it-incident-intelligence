from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


PriorityBucket = Literal["P1", "P2", "P3", "P4"]


class RecurringProblem(BaseModel):
    signature: str
    category: str
    service: str
    keyword_bucket: str
    frequency: int
    last_seen: date
    trend_delta: int
    sample_ticket_ids: list[str]
    sample_titles: list[str]


class TicketPriority(BaseModel):
    ticket_id: str
    title: str
    category: str
    service: str
    status: str
    score: int = Field(ge=0, le=100)
    recommended_priority: PriorityBucket
    reasons: list[str]


class PriorityBatchRequest(BaseModel):
    ticket_ids: list[str] | None = None
    limit: int = Field(default=50, ge=1, le=500)


class PriorityBatchResponse(BaseModel):
    items: list[TicketPriority]


class TrendPoint(BaseModel):
    date: date
    count: int


class IncidentSummary(BaseModel):
    open_tickets: int
    recurring_clusters: int
    high_risk_tickets: int
    top_services: list[str]
    trends: list[TrendPoint]

