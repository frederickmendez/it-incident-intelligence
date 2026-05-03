import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .engine import IncidentEngine
from .schemas import (
    IncidentSummary,
    PriorityBatchRequest,
    PriorityBatchResponse,
    RecurringProblem,
    TicketPriority,
)

DEFAULT_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "tickets_sample.csv"
DATA_PATH = Path(os.getenv("INCIDENTS_DATA_PATH", str(DEFAULT_DATA_PATH)))
engine = IncidentEngine(DATA_PATH)

app = FastAPI(title="IT Incident Intelligence API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/incidents/recurring", response_model=list[RecurringProblem])
def recurring(window_days: int = Query(default=30, ge=7, le=180), limit: int = Query(default=20, ge=1, le=100)) -> list[RecurringProblem]:
    return engine.recurring_problems(window_days=window_days, limit=limit)


@app.get("/api/v1/incidents/priority", response_model=TicketPriority)
def priority(ticket_id: str = Query(..., min_length=1)) -> TicketPriority:
    record = engine.priority_for_ticket(ticket_id=ticket_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Ticket '{ticket_id}' not found.")
    return record


@app.post("/api/v1/incidents/priority/batch", response_model=PriorityBatchResponse)
def priority_batch(payload: PriorityBatchRequest) -> PriorityBatchResponse:
    items = engine.batch_priority(ticket_ids=payload.ticket_ids, limit=payload.limit)
    return PriorityBatchResponse(items=items)


@app.get("/api/v1/incidents/summary", response_model=IncidentSummary)
def summary() -> IncidentSummary:
    return engine.summary()
