# Nexus IT Operations & Security Suite - Governance (Agents)

This repository is being evolved into **Nexus IT Operations & Security Suite**: a modular, mock-data-driven dashboard built with **Next.js + React + TypeScript + Tailwind CSS**.

## Non-negotiable rules

- **No live APIs** (mock/local data only for now).
- **No authentication**.
- **No database / persistence layer**.
- **No business rules inside React components** (no hardcoded scoring, thresholds, mappings, or policy decisions in UI).
- **Business logic must be deterministic and explainable** (output must include why).
- Keep changes incremental: **do not remove or break existing working code** unless explicitly tasked.

## Canonical app root and folder conventions

Treat `frontend/src` as the canonical application root for all new Nexus work.

- Deterministic module logic: `frontend/src/lib/[module-name]/`
- React UI/components: `frontend/src/components/[module-name]/`
- Mock data (fixtures): `frontend/src/data/mock/`
- Policy/config (deterministic inputs): `frontend/src/data/policies/`

> Note: Existing code may not yet follow this structure. Do **not** refactor legacy layout unless a task explicitly requests it.

## Shared code conventions

New shared Nexus code must use these paths:

- Shared UI primitives: `frontend/src/components/shared/`
- Shared deterministic helpers/selectors: `frontend/src/lib/shared/`
- Shared cross-module types: `frontend/src/types/shared/`

Module-specific code stays inside `frontend/src/components/[module-name]/` and `frontend/src/lib/[module-name]/`. Existing legacy files such as `frontend/src/types/incident.ts` may remain where they are until an explicit migration task moves them.

## Modules (target scope)

Nexus will include these modules (only implement when explicitly tasked):

1. Cloud Cost Auditor
2. MDM Security Monitor
3. Urgent Ticket Classifier
4. MDM Compliance Checker
5. Stale Account Cleanup

## Module requirements (when implementing a module)

Every module must be independently explainable (CV/interview ready) and must include:

- `types.ts` (module-only types; keep shared types in a separate shared area only when necessary)
- `analyzer.ts` with deterministic analyzer/scoring logic (pure functions; no network calls)
- Optional `formatter.ts` for chart/table-ready view models derived from analyzer output
- Mock data fixtures (small + representative + edge cases)
- Required analyzer/scoring tests for determinism and explainability
- Clear explainability output (reasons, factors, and rule hits)

Component rendering tests are recommended when a task adds UI. Integration tests are deferred until modules are routed or wired into shared suite navigation.

For CV/interview readiness, a module should make its purpose, inputs, rules, outputs, and reasoning easy to inspect without duplicating business logic in docs or UI.

## Legacy components and backend

- The current incident dashboard and backend are considered **preserved legacy/demo support** until a dedicated migration task is issued.
- Do not delete, rename, or clean up legacy code as drive-by work.
- New Nexus work follows these conventions immediately. Legacy code remains untouched until an explicit migration task says otherwise.
