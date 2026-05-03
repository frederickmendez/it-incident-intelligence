# Nexus - Module Contracts

This document defines the **required structure and contracts** for every Nexus module. It is governance-only and does not introduce runtime APIs.

## Canonical module placement

All module work is rooted at `frontend/src`:

- Logic: `frontend/src/lib/[module-name]/`
- UI: `frontend/src/components/[module-name]/`
- Mock fixtures: `frontend/src/data/mock/[module-name]/`
- Policies: `frontend/src/data/policies/[module-name]/`
- Shared UI primitives: `frontend/src/components/shared/`
- Shared deterministic helpers/selectors: `frontend/src/lib/shared/`
- Shared cross-module types: `frontend/src/types/shared/`

Existing legacy files outside these paths can remain in place until a dedicated migration task moves them. New Nexus module work must use the paths above immediately.

## Required module artifacts

Each module must include these artifacts (at minimum):

1. `types.ts`
   - Types for module inputs, outputs, findings, and explainability structures.
2. `analyzer.ts`
   - Pure functions (no network, no persistence).
   - Consumes mock records + policies and produces domain outputs.
3. Optional `formatter.ts`
   - Converts analyzer domain outputs into chart-ready or table-ready view models when needed.
4. Mock dataset
   - Small, representative fixtures covering typical and edge cases.
   - Prefer a `mock.ts` module fixture entry when fixtures are TypeScript objects.
5. Explainability notes
   - A short section in module docs (or inline README later) describing the rules and rationale.
6. Required analyzer/scoring tests
   - Must cover determinism, score/severity rules, and explainability outputs.

Component rendering tests are recommended when a task adds UI. Integration tests are deferred until modules are routed or wired into shared suite navigation.

## Standard module output shape (documentation-level)

Each module's analyzer should produce a domain output object with:

- `summary`: top-line numbers (counts, totals, rates) needed for KPIs.
- `items`: list of findings/entities (tickets, devices, resources, accounts) with:
  - `score` or `severity` (when applicable)
  - `status` (e.g., pass/fail/needs-review)
  - `reasons`: ordered, human-readable explanations
  - `rule_hits`: structured evidence of which rules fired (for auditing)

Formatters may produce a separate view model with chart series, table groupings, histogram buckets, or sorted display lists. UI components may format labels and layout, but must not change scoring semantics.

## Explainability requirements

- Every non-trivial score must include **reasons** with enough detail that a reviewer can reproduce the decision.
- Rules must be attributable to policy/config entries (not magic values in UI).
- Avoid "AI said so" phrasing. Prefer explicit rule language: "impact=critical (+35)", "keyword=outage (+5)", etc.

For CV/interview readiness, a module should make its purpose, inputs, rules, outputs, and reasoning easy to inspect without duplicating business logic in docs or UI.

## Policy and test conventions

- Rule-bearing policies must be TypeScript files under `frontend/src/data/policies/[module-name]/`.
- Avoid JSON/YAML policy drift unless a future task explicitly standardizes a non-TypeScript policy format.
- Prefer colocated analyzer tests near module logic, such as `frontend/src/lib/[module-name]/analyzer.test.ts`.
- Use `frontend/src/test` only when a task explicitly calls for centralized tests.

## Routing conventions

When a task explicitly includes module pages, use `frontend/src/app/[module-name]/page.tsx`. Do not add routing, navigation, or dashboard integration unless that task explicitly includes integration work.

## Naming conventions

Use kebab-case for `[module-name]` directories:

- `cloud-cost-auditor`
- `mdm-security-monitor`
- `urgent-ticket-classifier`
- `mdm-compliance-checker`
- `stale-account-cleanup`

Public labels in the UI can be Title Case.
