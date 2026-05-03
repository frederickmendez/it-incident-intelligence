# Nexus - Design System (Governance)

This document captures the **current UI direction** as the baseline for Nexus and defines how new module UI should be built.

## Baseline: keep the current look and feel

The existing frontend establishes a premium operations dashboard aesthetic:

- Dark theme with glassmorphism surfaces
- Consistent spacing/radius tokens
- Status colors for severity/priority
- Bespoke, zero-dependency SVG charts

New Nexus modules should **reuse and extend** this direction rather than introducing a conflicting style system.

## Design principles

- **Clarity over novelty**: dashboards must be scannable and executive-friendly.
- **Explainability first**: every module view should make the reason visible.
- **Consistency**: reuse existing patterns for cards, tables, filters, badges, and charts.
- **Separation of concerns**: components render outputs; they do not decide business outcomes.

## Component rules

- Presentational components must not hardcode business thresholds, mappings, or scoring logic.
- If a UI needs a derived metric (e.g., distribution buckets), compute it in a module formatter/view-model layer and pass it in.
- Prefer a small set of shared primitives when multiple modules need the same UI behavior (tables, KPI cards, badges).

## Shared UI conventions

- Reusable UI primitives belong in `frontend/src/components/shared/`.
- Module-specific UI stays in `frontend/src/components/[module-name]/`.
- Shared deterministic helpers/selectors belong in `frontend/src/lib/shared/`.
- Shared cross-module types belong in `frontend/src/types/shared/`.
- Existing legacy UI files can remain where they are until an explicit migration task moves them.

## Visual tokens and patterns

Use the existing token approach (CSS variables) and established patterns:

- Glass cards (surface + border + subtle hover)
- KPI cards with accent rails
- Data tables with sticky headers and hover rows
- Severity/priority badges with consistent colors

## Charting

Prefer existing bespoke SVG chart components (area, donut, bar, gauge) and expand them only when needed.

Rules:

- Charts render **already computed** series/breakdowns.
- Chart components should remain reusable and dependency-free.

## Copy and narrative

Business narrative is encouraged (executive summaries), but:

- Narrative must be grounded in deterministic outputs.
- Avoid claims not supported by mock data and policies.
