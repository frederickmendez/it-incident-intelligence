from pathlib import Path

from app.engine import IncidentEngine


def test_recurring_problems_are_ranked_and_typed() -> None:
    engine = IncidentEngine(Path("data/tickets_sample.csv"))
    rows = engine.recurring_problems(window_days=30, limit=5)

    assert rows
    assert rows[0].frequency >= rows[-1].frequency
    assert rows[0].signature
    assert rows[0].sample_ticket_ids


def test_priority_scoring_maps_to_expected_buckets() -> None:
    engine = IncidentEngine(Path("data/tickets_sample.csv"))
    result = engine.priority_for_ticket("INC-1037")

    assert result is not None
    assert result.score >= 80
    assert result.recommended_priority == "P1"
    assert any("critical service exposure" in reason for reason in result.reasons)


def test_summary_has_trend_points() -> None:
    engine = IncidentEngine(Path("data/tickets_sample.csv"))
    summary = engine.summary()

    assert summary.open_tickets > 0
    assert len(summary.trends) == 10
    assert sum(point.count for point in summary.trends) >= 0
