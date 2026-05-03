# Directive: Build a Nexus Module (Step-by-step)

This directive is the canonical process for adding one Nexus module at a time. It does **not** authorize refactors of existing legacy code unless explicitly tasked.

## Preconditions

- No live APIs, no auth, no DB.
- `frontend/src` is the canonical app root for new work.

## Module build sequence (must follow)

1. **Choose the module name (kebab-case)**
   - Create `frontend/src/lib/[module-name]/` and `frontend/src/components/[module-name]/`.

2. **Define types**
   - Add `frontend/src/lib/[module-name]/types.ts`.
   - Define input record types, policy types, analyzer output types, and explainability structures.

3. **Create policies**
   - Add TypeScript policy/config files under `frontend/src/data/policies/[module-name]/`.
   - Policies must encode thresholds and mappings used by scoring.
   - Avoid JSON/YAML policy drift unless a future task explicitly standardizes that format.

4. **Create mock data**
   - Add `frontend/src/data/mock/[module-name]/...` for input records and (optionally) expected outputs.
   - Prefer a `mock.ts` module fixture entry when fixtures are TypeScript objects.
   - Include at least: typical case, edge case, empty/none case, and a worst case.

5. **Implement deterministic analyzer/scoring**
   - Add `frontend/src/lib/[module-name]/analyzer.ts`.
   - Must consume mock data + policies, and emit a domain output with canonical findings, summary values, reasons, and rule hits.
   - Must not import React or UI code.

6. **Add formatter/view-model logic when needed**
   - Add `frontend/src/lib/[module-name]/formatter.ts` only when charts, tables, or UI groupings need presentation-ready derived data.
   - Formatters may shape analyzer outputs for display, but must not change scoring semantics.

7. **Create presentational UI**
   - Add module UI under `frontend/src/components/[module-name]/`.
   - Components receive analyzer/formatter outputs and render:
     - KPIs/summary
     - tables/lists of items
     - visible explainability (reasons)

8. **Add required analyzer/scoring tests**
   - Prefer colocated tests such as `frontend/src/lib/[module-name]/analyzer.test.ts`.
   - Use `frontend/src/test` only when a task explicitly calls for centralized tests.
   - Test analyzer determinism and explainability outputs.
   - Test edge cases and policy changes.

9. **Wire into routes/navigation only when explicitly tasked**
   - When a task includes module pages, use `frontend/src/app/[module-name]/page.tsx`.
   - Do not update global navigation or routing unless the task explicitly includes integration work.

## Forbidden shortcuts

- Do not embed scoring rules inside React components.
- Do not invent network calls for later.
- Do not introduce auth or persistence.
- Do not refactor existing legacy layout unless explicitly requested.

## CV/interview readiness checklist

- The module explains itself: purpose, inputs, outputs, rules.
- Every score has reasons and rule hits.
- Mock data includes representative and edge scenarios.
- Analyzer logic is readable and deterministic.
- Documentation and UI may explain the module, but must not duplicate business logic.
