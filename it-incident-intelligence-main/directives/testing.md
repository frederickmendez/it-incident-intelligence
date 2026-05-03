# Directive: Testing for Nexus Modules

Testing is focused on deterministic correctness and explainability. This directive defines minimum expectations for future module work.

## Priorities

1. **Analyzer/scoring tests (highest priority)**
   - Required for every module.
   - Deterministic: same inputs => same outputs.
   - Explainability: reasons are present, ordered, and attributable to rule hits.
   - Edge cases: empty inputs, missing optional fields, policy toggles.

2. **Component rendering tests (secondary)**
   - Recommended when a task adds UI, unless the task explicitly requires them.
   - Render module views from mock analyzer outputs.
   - Validate empty states and error/none states (without inventing APIs).

3. **Integration tests (later)**
   - Only when modules are wired into the suite navigation and share layout primitives.

## What to test (minimum)

- Scoring thresholds and category mapping come from policies (not UI).
- Each finding includes `reasons` and structured evidence of rule hits.
- Sorting/aggregation needed by UI is computed in formatter/view-model logic, not React components.
- "No findings" state is stable and does not crash charts/tables.

## Where to put tests

- Prefer colocated analyzer tests near module logic, such as `frontend/src/lib/[module-name]/analyzer.test.ts`.
- Use `frontend/src/test` only when a task explicitly calls for centralized tests.
- Keep component tests near the component or in a clearly named test file selected by the task.

## What not to test (for now)

- Network integrations (there are none in this phase).
- Authentication/authorization (not in scope).
- Database persistence (not in scope).
