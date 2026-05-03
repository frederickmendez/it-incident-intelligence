# Nexus IT Operations & Security Suite

Nexus IT Operations & Security Suite is a production-inspired dashboard for IT operations, security, identity, endpoint, and FinOps workflows. It is built as a mock-data-driven portfolio project that demonstrates modular architecture, deterministic analysis, explainable scoring, and executive-friendly reporting.

This project does not connect to live systems yet. All current data is mocked or simulated locally, with no authentication, database, persistence layer, or live third-party API integrations.

---

## Product Overview

Nexus turns operational signals into a suite of focused dashboards. Each module takes representative mock records, applies deterministic rules, and presents results with plain-English reasoning so an engineer, manager, or recruiter can inspect both the output and the logic behind it.

The current app includes a global executive overview plus module views for ticket prioritization, cloud cost waste, MDM security posture, macOS compliance, and stale identity cleanup.

---

## Business Problem

IT teams often work across disconnected tools: ticket queues, cloud billing portals, MDM consoles, compliance reports, and identity platforms. Even when the data exists, teams still need to answer practical questions quickly:

- Which tickets need attention first?
- Where is cloud spend being wasted?
- Which devices introduce security or compliance risk?
- Which stale accounts should be reviewed or cleaned up?
- How can technical findings be explained clearly to non-technical stakeholders?

Nexus models those workflows in one dashboard using simulated data and deterministic analysis. The goal is not to claim production connectivity, but to show how a production-style operations suite could be structured.

---

## Five Modules

### Cloud Cost Auditor

Identifies mocked cloud resources with projected monthly waste, such as idle compute, unattached storage, and orphaned resources. The module summarizes potential savings and formats chart/table-ready data for the dashboard.

### MDM Security Monitor

Surfaces mocked managed-device security risks such as stale MDM check-ins, missing endpoint protection, disk encryption gaps, jailbreak/root detection, and unknown compliance state.

### Urgent Ticket Classifier

Ranks mocked support tickets by priority and risk signals. The dashboard shows a priority queue, score gauges, reasoning, and a risk hotspot matrix by category and service.

### MDM Compliance Checker

Evaluates mocked device evidence against a deterministic macOS compliance policy. Outputs include compliant, warning, and non-compliant results with rule-level explanations.

### Stale Account Cleanup

Analyzes mocked identity records for inactivity, protected scope, account type, and license savings. The module recommends review or cleanup actions while explaining why each account is classified that way.

---

## Architecture

Nexus follows a modular frontend architecture under `frontend/src`:

```text
frontend/src/
  app/                    Next.js routes
  components/             React UI components
  components/shared/      Shared app shell and reusable UI
  components/[module]/    Module-specific presentation
  data/mock/              Mock fixtures for simulated inputs
  data/policies/          Deterministic policy/config inputs
  lib/[module]/           Module logic, summaries, and formatters
  lib/shared/             Cross-module selectors and dashboard summaries
  types/                  Legacy/shared TypeScript types
```

The intended layering is:

- Mock data and policies provide deterministic inputs.
- Module logic in `lib/` performs scoring, summarization, and view-model formatting.
- React components render already-derived data and avoid business rules.
- The global overview imports module summaries instead of duplicating module-specific logic.

---

## Tech Stack

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Custom SVG chart components**
- **Vitest** for analyzer tests
- **Mock TypeScript fixtures** for local development data

There is legacy/demo support code in the repository, but the Nexus frontend is the current focus.

---

## Mock Data Strategy

Nexus is intentionally mock-data-first in its current phase. Fixtures live under `frontend/src/data/mock/` and represent realistic examples from ticketing, cloud cost, endpoint, compliance, and identity workflows.

Policies and deterministic configuration live under `frontend/src/data/policies/`. This keeps rule-bearing values out of React components and makes analysis easier to explain during code review or interviews.

Current limitations:

- No live Jira, ServiceNow, AWS, Azure, MDM, Okta, Google Workspace, or Microsoft Graph connections.
- No authentication.
- No database or persistence layer.
- No production monitoring or background jobs.

---

## Explainable Scoring Logic

The project emphasizes deterministic and explainable outputs. Module logic is designed so that the same input always produces the same result, and non-trivial decisions include reasons or rule hits.

Examples:

- Ticket priority views include plain-English reasoning for each scored ticket.
- macOS compliance results include expected values, observed values, and policy rule references.
- stale account cleanup results explain inactivity thresholds, protected groups, and savings assumptions.
- executive KPIs are calculated from module summary functions rather than hardcoded in UI components.

This makes the project useful for portfolio review because the reviewer can inspect not only what the dashboard displays, but how the result was derived.

---

## Screenshots

Screenshots will be added here as the Nexus UI stabilizes.

Suggested screenshots:

- Executive Overview
- Urgent Ticket Classifier
- Cloud Cost Auditor
- MDM Compliance Checker
- Stale Account Cleanup

---

## Setup Instructions

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Optional production build check:

```bash
npm run build
```

Useful scripts:

```bash
npm run lint
npm run test
```

---

## Portfolio / CV Explanation

Nexus is designed to show full-stack product thinking through a frontend-focused implementation. It demonstrates how to structure a complex operational dashboard with clear module boundaries, deterministic business logic, typed data contracts, explainable outputs, and recruiter-friendly presentation.

Good CV phrasing:

> Built Nexus IT Operations & Security Suite, a mock-data-driven Next.js and TypeScript dashboard that models IT operations, endpoint security, FinOps, compliance, and identity cleanup workflows. Implemented modular deterministic analyzers with explainable scoring, policy-driven decisions, and executive-level KPI summaries.

What this project demonstrates:

- Product thinking across IT operations and security workflows.
- Clean separation between React presentation and deterministic module logic.
- TypeScript modeling for realistic enterprise data shapes.
- Explainable scoring and rule-based analysis.
- Dashboard UX for both operational teams and executive stakeholders.

---

## Future Improvements

- Add real integration adapters for Jira or ServiceNow ticket data.
- Add optional AWS Cost Explorer and Azure Cost Management import flows.
- Add MDM provider adapters such as Jamf, Intune, or Kandji.
- Add identity provider adapters such as Okta, Microsoft Entra ID, or Google Workspace.
- Add export workflows for CSV, PDF, and executive reports.
- Add more analyzer tests for edge cases, scoring determinism, and explainability.
- Add module-level route pages for every Nexus module.
- Add screenshots and a short demo video once the UI stabilizes.
- Add accessibility and responsive QA passes across all dashboard views.

---

## Contact

**Frederick Mendez**

- LinkedIn: [linkedin.com/in/frederickmendez](https://www.linkedin.com/in/frederickmendez)
- GitHub: [github.com/frederickmendez](https://github.com/frederickmendez)

---

Built as a portfolio project to demonstrate production-inspired architecture, explainable analysis, and dashboard engineering.
