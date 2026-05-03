# Nexus IT Operations & Security Suite - Architecture

This document defines the target architecture for evolving this repository into **Nexus IT Operations & Security Suite**. It is governance-only (no feature implementation).

## Goals

- A **modular dashboard** (each module can be understood and demoed independently).
- **Deterministic, explainable** scoring and findings (every output includes a human-readable reason).
- **Mock-data-first** development (no live API integrations yet).
- Strict separation of **UI** from **business logic**.

## Constraints (current phase)

- Frontend stack: **Next.js + React + TypeScript + Tailwind CSS**
- **No live APIs**, **no authentication**, **no database**
- Do not refactor or remove existing working code unless explicitly requested.

## Canonical folder layout (for all new Nexus work)

All new Nexus code must treat `frontend/src` as the canonical application root:

- UI: `frontend/src/components/[module-name]/`
- Deterministic module logic: `frontend/src/lib/[module-name]/`
- Mock fixtures: `frontend/src/data/mock/`
- Policy/config inputs: `frontend/src/data/policies/`

Existing code may not yet match this structure; that mismatch is expected during transition.

## Shared code layout

New shared Nexus code must use these paths:

- Shared UI primitives: `frontend/src/components/shared/`
- Shared deterministic helpers/selectors: `frontend/src/lib/shared/`
- Shared cross-module types: `frontend/src/types/shared/`

Existing legacy files in other locations can remain in place until a dedicated migration task moves them.

## Architectural layering

### 1) Data (fixtures and policies)

- **Mock data** represents input records (tickets, devices, accounts, cost resources) and expected sample outputs.
- **Policy/config** defines the deterministic rules (thresholds, severity mappings, rule toggles) consumed by analyzers.
- Rule-bearing policies must be TypeScript config files under `frontend/src/data/policies/[module-name]/`.
- Policies must be documented and versioned like code (no magic numbers hidden in UI).

### 2) Deterministic analyzers (module logic)

Module analyzers live under `frontend/src/lib/[module-name]/` and must:

- Be **pure/deterministic**: same inputs => same outputs.
- Produce **domain outputs**: canonical findings, summary values, reasons, and rule hits.
- Avoid UI concerns: no CSS classes, no component imports, no rendering logic.

Optional formatters live beside analyzers in `frontend/src/lib/[module-name]/` and may convert domain outputs into chart-ready series, table groupings, or other view models. React components should consume formatter outputs when they need presentation-ready shapes, but analyzers themselves must stay presentation-neutral.

### 3) UI components (presentation)

Module UI lives under `frontend/src/components/[module-name]/` and must:

- Render outputs from analyzers, formatters, and mock data.
- Avoid embedding business rules.
- Prefer small presentational components that can be reused across modules.

## Routing and integration

When a task explicitly includes module pages, place the page at `frontend/src/app/[module-name]/page.tsx`. Do not add routes, global navigation, or dashboard integration unless the task explicitly asks for integration.

## Modules (target product)

The suite includes five modules. In this phase we define the boundaries only - no implementation.

1. **Cloud Cost Auditor**: identify idle/unattached/inefficient resources and estimate waste with explainable rules.
2. **MDM Security Monitor**: surface device security posture risks (encryption, jailbreak/root, OS age, etc.) from mock device signals.
3. **Urgent Ticket Classifier**: score/triage tickets by impact/urgency/keywords/recurrence with explainable reasoning.
4. **MDM Compliance Checker**: evaluate devices against explicit compliance policies and report pass/fail with evidence.
5. **Stale Account Cleanup**: detect dormant/stale identities (inactive days, last login, privileged roles) and recommend actions.

## Transition note (existing implementation)

This repository currently contains an existing incident-focused dashboard and a backend demo implementation. These are considered **preserved legacy/demo support** until a dedicated migration task explicitly restructures them to match Nexus conventions.

New Nexus work follows the conventions in this document immediately. Legacy code remains untouched until an explicit migration task says otherwise.
