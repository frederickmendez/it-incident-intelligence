# Execution Tools

This folder is for deterministic Python scripts that perform repeatable work for the project.

## Rules

- Check existing scripts before creating a new one.
- Keep scripts focused on one job.
- Use command-line arguments for inputs and outputs when practical.
- Write outputs to `.tmp/` unless they are intended deliverables.
- Do not hard-code secrets or credentials.
- Read environment variables from `.env` when needed.
- Add comments only where they clarify non-obvious logic.

## Expected Future Tools

- Ticket classification.
- Incident anomaly detection.
- Recurring problem detection.
- Priority scoring.
- Dummy cloud billing CSV generation.
- Cloud cost waste auditing.

## Testing

Each script should be runnable on a small sample input. When a script changes, run it against sample data and confirm the output is clean, deterministic, and documented in the relevant directive.
